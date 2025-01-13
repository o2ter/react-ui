//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { useEquivalent, useStableCallback, useStableRef } from 'sugax';
import { isSchema, ISchema, object, ValidateError } from '@o2ter/valid.js';
import { useAlert } from '../../Alert';
import { createMemoComponent } from '../../../internals/utils';
import { FormState } from './types';
import { FormInternalState, FormContext, FormInternalContext } from './context';
import { FormProps } from './types';
import { useActivity } from '../../ActivityIndicator';
import { FormGroupContext } from '../Group/context';

const cloneValue = (x: any): any => {
  if (_.isArray(x)) return x.map(v => cloneValue(v));
  if (_.isPlainObject(x)) return _.mapValues(x, v => cloneValue(v));
  return x;
}

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
      if (!_.isArray(e.path) || !_.every(e.path, v => _.isString(v))) return false;
      const path = e.path.join('.');
      return path === prefix || path.startsWith(`${prefix}.`);
    });
  };
};

export const Form = createMemoComponent(<S extends Record<string, ISchema<any, any>>>({
  schema,
  initialValues,
  roles,
  activity,
  validate,
  validateOnMount,
  onReset,
  onChange,
  onChangeValues,
  onAction,
  onSubmit,
  onError,
  onLoading,
  children
}: FormProps<S>, forwardRef: React.ForwardedRef<FormState>) => {

  const _schema = React.useMemo(() => isSchema(schema) ? schema : object(schema ?? {} as S), [schema]);
  const _validate = React.useMemo(() => validate ?? defaultValidation(_schema.validate), [_schema, validate]);

  const _initialValues = React.useMemo(() => initialValues ?? _schema.getDefault() ?? {}, [initialValues, _schema]);
  const [_values, _setValues] = React.useState<typeof _initialValues>();
  const [extraError, setExtraError] = React.useState<{ id: string; error: Error; }[]>([]);

  const values = React.useMemo(() => _values ?? _initialValues, [_initialValues, _values]);
  const setValues = useStableCallback((
    update: React.SetStateAction<typeof _initialValues>
  ) => _setValues(_.isFunction(update) ? v => update(v ?? _initialValues) : update));

  const [loading, setLoading] = React.useState<Record<string, string[]>>({});
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [touched, setTouched] = React.useState<true | Record<string, boolean>>(validateOnMount ? true : {});
  const [listeners, setListeners] = React.useState<{ action: string; callback: VoidFunction; }[]>([]);
  const [refresh, setRefresh] = React.useState(0);

  const startActivity = useActivity();

  const { showError } = useAlert();
  const _showError = React.useCallback(async (resolve: () => any) => {
    try { await resolve(); } catch (e) {
      let defaultPrevented = false;
      await stableRef.current.error(e as Error, { ...formState, preventDefault: () => void (defaultPrevented = true) });
      if (!defaultPrevented) showError(e as Error);
    }
  }, []);

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

  const stableRef = useStableRef({
    error: async (error: Error, state: FormState & { preventDefault: VoidFunction }) => {
      if (_.isFunction(onError)) await onError(error, state);
    },
    action: (action: string) => {
      const taskId = _.uniqueId();
      let resolve: VoidFunction;
      const promise = new Promise<void>(res => resolve = res);
      if (_.isFunction(onLoading)) onLoading(action, promise, formState);
      if (activity) {
        const actions = _.isBoolean(activity) ? undefined : activity.actions;
        const delay = _.isBoolean(activity) ? undefined : activity.delay;
        if (_.isNil(actions) || _.includes(actions, action)) {
          startActivity(() => promise, delay);
        }
      }
      const callback = ({ values, formState, schema }: NextTickParam) => {
        (async () => {
          switch (action) {
            case 'submit':
              setTouched(true);
              if (_.isFunction(onSubmit)) await _showError(() => onSubmit(schema.cast(values), formState));
              break;
            case 'reset':
              _setValues(undefined);
              if (_.isFunction(onReset)) await _showError(() => onReset(formState));
              break;
            default:
              if (_.isFunction(onAction)) await _showError(() => onAction(action, formState));
              break;
          }
          setCounts(c => ({ ...c, [action]: (c[action] ?? 0) + 1 }));
          setLoading(v => ({ ...v, [action]: _.filter(v[action], x => x !== taskId) }));
          resolve();
        })();
      };
      _showError(async () => {
        try {
          setLoading(v => ({ ...v, [action]: [...v[action] ?? [], taskId] }));
          const resolved = await Promise.all(_.flatMap(listeners, x => x.action === action ? x.callback() : []));
          if (_.isEmpty(resolved)) {
            callback({ values, formState, schema: _schema });
          } else {
            setNextTick(v => [...v, callback]);
          }
        } catch (error) {
          setLoading(v => ({ ...v, [action]: _.filter(v[action], x => x !== taskId) }));
          resolve();
          throw error;
        }
      });
    },
  });

  const formAction = React.useMemo(() => ({
    setValue: (path: string, value: React.SetStateAction<any>) => setValues(
      values => _.set(cloneValue(values), path, _.isFunction(value) ? value(_.get(values, path)) : value)
    ),
    submit: () => stableRef.current.action('submit'),
    reset: () => stableRef.current.action('reset'),
    refresh: () => setRefresh(v => v + 1),
    action: (action: string) => stableRef.current.action(action),
    setTouched: (path?: string) => setTouched(touched => _.isNil(path) || _.isBoolean(touched) ? true : { ...touched, [path]: true }),
    addEventListener: (action: string, callback: VoidFunction) => setListeners(v => [...v, { action, callback }]),
    removeEventListener: (action: string, callback: VoidFunction) => setListeners(v => _.filter(v, x => x.action !== action || x.callback !== callback)),
  }), []);

  const formState = React.useMemo(() => ({
    roles,
    values,
    validate: _validate,
    get dirty() { return !_.isNil(_values) },
    get submitting() { return !_.isEmpty(loading.submit) },
    get resetting() { return !_.isEmpty(loading.reset) },
    get loading() { return _.keys(_.pickBy(loading, x => !_.isEmpty(x))) },
    get submitCount() { return counts.submit },
    get resetCount() { return counts.reset },
    get actionCounts() { return counts },
    get errors() { return [..._validate(values), ..._.map(extraError, x => x.error)] },
    touched: (path: string) => _.isBoolean(touched) ? touched : touched[path] ?? false,
    ...formAction,
  }), [useEquivalent(roles), loading, counts, values, _validate, touched, extraError, refresh]);

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
        <FormGroupContext.Provider value={[]}>
          {_.isFunction(children) ? children(formState) : children}
        </FormGroupContext.Provider>
      </FormInternalContext.Provider>
    </FormContext.Provider>
  );
}, {
  displayName: 'Form',
});
