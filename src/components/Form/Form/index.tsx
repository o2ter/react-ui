//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import _ from 'lodash';
import React from 'react';
import { useFormGroup } from '../Group';
import { useEquivalent, useStableCallback, useStableRef } from 'sugax';
import { ISchema, object, TypeOfSchema, ValidateError } from '@o2ter/valid.js';
import { useAlert } from '../../Alert';
import { createMemoComponent } from '../../../internals/utils';

const cloneValue = (x: any): any => {
  if (_.isArray(x)) return x.map(v => cloneValue(v));
  if (_.isPlainObject(x)) return _.mapValues(x, v => cloneValue(v));
  return x;
}

export type FormState = {
  roles?: string[];
  values: Record<string, any>;
  errors: Error[];
  dirty: boolean;
  submitCount: number;
  resetCount: number;
  actionCounts: Record<string, number>;
  setValue: (path: string, value: React.SetStateAction<any>) => void;
  validate: (value: any, path?: string) => Error[];
  submit: VoidFunction;
  reset: VoidFunction;
  action: (action: string) => void;
  touched: (path: string) => boolean;
  setTouched: (path?: string) => void;
  addEventListener: (action: string, callback: () => void) => void;
  removeEventListener: (action: string, callback: () => void) => void;
};

const FormContext = React.createContext<FormState>({
  values: {},
  errors: [],
  dirty: false,
  submitCount: 0,
  resetCount: 0,
  actionCounts: {},
  setValue: () => { },
  validate: () => [],
  submit: () => { },
  reset: () => { },
  action: () => { },
  touched: () => false,
  setTouched: () => { },
  addEventListener: () => { },
  removeEventListener: () => { },
});

FormContext.displayName = 'FormContext';

type FormInternalState = {
  extraError: (id: string) => Error | undefined;
  setExtraError: (id: string, error?: Error) => void;
};

const FormInternalContext = React.createContext<FormInternalState>({
  extraError: () => void 0,
  setExtraError: () => { },
});

FormInternalContext.displayName = 'FormInternalContext';

const defaultValidation = (validate: (value: any) => ValidateError[]) => {

  let cache: [any, ValidateError[]] = [null, []];

  const _validate = (value: any) => {
    if (cache[0] === value) return cache[1];
    cache = [value, validate(value)];
    return cache[1];
  };

  return (value: any, path?: string) => {

    const errors = _validate(value);

    if (!_.isString(path)) return errors;

    const prefix = _.toPath(path).join('.');
    return errors.filter(e => {
      const path = e.path.join('.');
      return path === prefix || path.startsWith(`${prefix}.`);
    });
  };
};

type FormProps<S extends Record<string, ISchema<any, any>>> = {
  schema?: S;
  initialValues?: TypeOfSchema<ReturnType<typeof object<S>>>;
  roles?: string[];
  validate?: (value: any, path?: string) => Error[];
  validateOnMount?: boolean;
  onReset?: (state: FormState) => void;
  onChange?: (state: FormState) => void;
  onChangeValues?: (state: FormState) => void;
  onAction?: (action: string, state: FormState) => void;
  onSubmit?: (values: Record<string, any>, state: FormState) => void;
  onError?: (error: Error, state: FormState & { preventDefault: VoidFunction }) => void;
  children?: React.ReactNode | ((state: FormState) => React.ReactNode);
};

export const Form = createMemoComponent(<S extends Record<string, ISchema<any, any>>>({
  schema,
  initialValues,
  roles,
  validate,
  validateOnMount,
  onReset = () => { },
  onChange = () => { },
  onChangeValues = () => { },
  onAction = () => { },
  onSubmit = () => { },
  onError = () => { },
  children
}: FormProps<S>, forwardRef: React.ForwardedRef<FormState>) => {

  const _initialValues = React.useMemo(() => initialValues ?? object(schema ?? {}).getDefault() ?? {}, [initialValues]);
  const [_values, _setValues] = React.useState<typeof _initialValues>();
  const [extraError, setExtraError] = React.useState<{ id: string; error: Error; }[]>([]);

  const values = React.useMemo(() => _values ?? _initialValues, [_initialValues, _values]);
  const setValues = useStableCallback((
    update: React.SetStateAction<typeof _initialValues>
  ) => _setValues(_.isFunction(update) ? v => update(v ?? _initialValues) : update));

  const [counts, setCounts] = React.useState({ submit: 0, reset: 0, actions: {} as Record<string, number> });
  const [touched, setTouched] = React.useState<true | Record<string, boolean>>(validateOnMount ? true : {});
  const [listeners, setListeners] = React.useState<{ action: string; callback: () => void; }[]>([]);

  const _schema = React.useMemo(() => object(schema ?? {}), [schema]);
  const _validate = React.useMemo(() => validate ?? defaultValidation(_schema.validate), [_schema, validate]);

  const { showError } = useAlert();
  const _showError = React.useCallback((resolve: () => any) => {
    (async () => {
      try { await resolve(); } catch (e) {
        let defaultPrevented = false;
        await stableRef.current.error(e as Error, { ...formState, preventDefault: () => void (defaultPrevented = true) });
        if (!defaultPrevented) showError(e as Error);
      }
    })();
  }, [showError]);

  type NextTickParam = {
    values: typeof values;
    schema: typeof _schema;
    formState: typeof formState;
  };
  const [nextTick, setNextTick] = React.useState<((x: NextTickParam) => void)[]>([]);

  React.useEffect(() => {
    if (_.isEmpty(nextTick)) return;
    for (const callback of nextTick) callback({ values, formState, schema: _schema });
    setNextTick(v => _.filter(v, x => _.every(nextTick, c => c !== x)));
  }, [nextTick]);

  const actions = {
    reset: ({ formState }: NextTickParam) => {
      _setValues(undefined);
      if (_.isFunction(onReset)) _showError(() => onReset(formState));
      setCounts(c => ({ ...c, reset: c.reset + 1 }));
    },
    submit: ({ values, formState, schema }: NextTickParam) => {
      setTouched(true);
      if (_.isFunction(onSubmit)) _showError(() => onSubmit(schema.cast(values), formState));
      setCounts(c => ({ ...c, submit: c.submit + 1 }));
    },
    action: ({ formState }: NextTickParam, action: string) => {
      if (_.isFunction(onAction)) _showError(() => onAction(action, formState));
      setCounts(c => ({ ...c, actions: { ...c.actions, [action]: (c.actions[action] ?? 0) + 1 } }));
    },
  };

  const stableRef = useStableRef({
    error: async (error: Error, state: FormState & { preventDefault: VoidFunction }) => {
      if (_.isFunction(onError)) await onError(error, state);
    },
    reset: () => {
      _showError(async () => {
        const resolved = await Promise.all(_.flatMap(listeners, x => x.action === 'reset' ? x.callback() : []));
        if (_.isEmpty(resolved)) {
          actions.reset({ values, formState, schema: _schema });
        } else {
          setNextTick(v => [...v, actions.reset]);
        }
      });
    },
    submit: () => {
      _showError(async () => {
        const resolved = await Promise.all(_.flatMap(listeners, x => x.action === 'submit' ? x.callback() : []));
        if (_.isEmpty(resolved)) {
          actions.submit({ values, formState, schema: _schema });
        } else {
          setNextTick(v => [...v, actions.submit]);
        }
      });
    },
    action: (action: string) => {
      _showError(async () => {
        const resolved = await Promise.all(_.flatMap(listeners, x => x.action === action ? x.callback() : []));
        if (_.isEmpty(resolved)) {
          actions.action({ values, formState, schema: _schema }, action);
        } else {
          setNextTick(v => [...v, (x) => actions.action(x, action)]);
        }
      });
    },
  });

  const formAction = React.useMemo(() => ({
    setValue: (path: string, value: React.SetStateAction<any>) => setValues(
      values => _.set(cloneValue(values), path, _.isFunction(value) ? value(_.get(values, path)) : value)
    ),
    submit: () => stableRef.current.submit(),
    reset: () => stableRef.current.reset(),
    action: (action: string) => stableRef.current.action(action),
    setTouched: (path?: string) => setTouched(touched => _.isNil(path) || _.isBoolean(touched) ? true : { ...touched, [path]: true }),
    addEventListener: (action: string, callback: () => void) => setListeners(v => [...v, { action, callback }]),
    removeEventListener: (action: string, callback: () => void) => setListeners(v => _.filter(v, x => x.action !== action || x.callback !== callback)),
  }), []);

  const formState = React.useMemo(() => ({
    roles,
    values,
    validate: _validate,
    get dirty() { return !_.isNil(_values) },
    get submitCount() { return counts.submit },
    get resetCount() { return counts.reset },
    get actionCounts() { return counts.actions },
    get errors() { return [..._validate(values), ..._.map(extraError, x => x.error)] },
    touched: (path: string) => _.isBoolean(touched) ? touched : touched[path] ?? false,
    ...formAction,
  }), [useEquivalent(roles), counts, values, _validate, touched, extraError]);

  const [initState] = React.useState(formState);
  React.useEffect(() => {
    if (initState !== formState && _.isFunction(onChange)) _showError(() => onChange(formState));
  }, [formState, _showError]);
  React.useEffect(() => {
    if (initState !== formState && _.isFunction(onChangeValues)) _showError(() => onChangeValues(formState));
  }, [values]);

  React.useImperativeHandle(forwardRef, () => formState, [formState]);

  const formInternalState: FormInternalState = React.useMemo(() => ({
    extraError: (id) => { 
      return _.find(extraError, x => x.id === id)?.error;
    },
    setExtraError: (id, error) => {
      if (error) {
        setExtraError(v => [..._.filter(v, x => x.id !== id), { id: id, error }]);
      } else {
        setExtraError(v => _.filter(v, x => x.id !== id));
      }
    },
  }), [extraError]);

  return (
    <FormContext.Provider value={formState}>
      <FormInternalContext.Provider value={formInternalState}>
        {_.isFunction(children) ? children(formState) : children}
      </FormInternalContext.Provider>
    </FormContext.Provider>
  );
}, {
  displayName: 'Form',
});

export const FormConsumer = FormContext.Consumer;

export const useForm = () => ({
  ...React.useContext(FormContext),
  groupPath: useFormGroup(),
});

export const useField = (name: string | string[]) => {

  const formState = useForm();
  const { roles, values, setValue, validate, touched, setTouched, submit, reset, groupPath } = formState;
  const path = [...groupPath, ..._.toPath(name)].join('.');
  const value = _.get(values, path);

  const onChange = React.useCallback((value: React.SetStateAction<any>) => setValue(path, value), [path]);
  const _setTouched = React.useCallback(() => setTouched(path), [path]);

  const { extraError, setExtraError } = React.useContext(FormInternalContext);

  const uniqId = React.useId();
  React.useEffect(() => { return () => setExtraError(uniqId); }, []);

  const useValidator = useStableCallback((
    validator?: (value: any) => void
  ) => {
    React.useEffect(() => {
      try {
        validator?.(value);
        setExtraError(uniqId, undefined);
      } catch (e) {
        setExtraError(uniqId, e as Error);
      }
    }, [value]);
  });

  return {
    value,
    form: formState,
    roles,
    get error() { return _.compact([...validate(values, path), extraError(uniqId)]) },
    get touched() { return touched(path) },
    setTouched: _setTouched,
    useValidator,
    onChange,
    submit,
    reset,
  };
}
