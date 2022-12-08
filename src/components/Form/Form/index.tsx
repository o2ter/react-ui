//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2022 O2ter Limited. All rights reserved.
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
import { useStableRef, ISchema, object, ValidateError } from 'sugax';

type FormState = {
  values: Record<string, any>;
  errors: Error[];
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  validate: (value: any, path?: string) => Error[];
  submit: VoidFunction;
  reset: VoidFunction;
  touched: (path: string) => boolean;
  setTouched: (path?: string) => void;
}

const FormContext = React.createContext<FormState>({
  values: {},
  errors: [],
  setValues: () => { },
  validate: () => [],
  submit: () => { },
  reset: () => { },
  touched: () => false,
  setTouched: () => { },
});

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

export const Form: React.FC<{
  schema?: Record<string, ISchema<any, any>>;
  initialValues?: Record<string, any>;
  validate?: (value: any, path?: string) => Error[];
  validateOnMount?: boolean;
  onReset?: (state: FormState) => void;
  onSubmit?: (values: Record<string, any>, state: FormState) => void;
  children: React.ReactNode | ((state: FormState) => React.ReactNode);
}> = ({
  schema = {},
  initialValues = object(schema).getDefault() ?? {},
  validate,
  validateOnMount,
  onReset = () => { },
  onSubmit = () => { },
  children
}) => {

  const [values, setValues] = React.useState(initialValues);
  const [touched, setTouched] = React.useState<true | Record<string, boolean>>(validateOnMount ? true : {});

  const _schema = React.useMemo(() => object(schema), [schema]);
  const _validate = React.useMemo(() => validate ?? defaultValidation(_schema.validate), [_schema, validate]);

  const stableRef = useStableRef({
    values,
    initialValues,
    touched,
    validate: _validate,
    onReset,
    onSubmit,
  });

  const formState = React.useMemo(() => ({
    setValues,
    get values() { return stableRef.current.values },
    get validate() { return stableRef.current.validate },
    get errors() { return stableRef.current.validate(values) },
    submit: () => {
      setTouched(true);
      if (_.isFunction(stableRef.current.onSubmit)) stableRef.current.onSubmit(_schema.cast(stableRef.current.values), formState);
    },
    reset: () => {
      setValues(stableRef.current.initialValues);
      if (_.isFunction(stableRef.current.onReset)) stableRef.current.onReset(formState);
    },
    touched: (path: string) => { return _.isBoolean(stableRef.current.touched) ? stableRef.current.touched : stableRef.current.touched[path] ?? false },
    setTouched: (path?: string) => { setTouched(touched => _.isNil(path) || _.isBoolean(touched) ? true : { ...touched, [path]: true }) },
  }), []);

  return <FormContext.Provider value={formState}>
    {_.isFunction(children) ? children(formState) : children}
  </FormContext.Provider>;
};

export const FormConsumer = FormContext.Consumer;

export const useForm = () => ({
  ...React.useContext(FormContext),
  groupPath: useFormGroup(),
});

export const useField = (name: string | string[]) => {

  const { values, setValues, validate, touched, setTouched, groupPath } = useForm();
  const path = [...groupPath, ..._.toPath(name)].join('.');

  const onChange = React.useCallback((value: React.SetStateAction<any>) => setValues(
    values => _.set(_.cloneDeep(values), path, _.isFunction(value) ? value(_.get(values, path)) : value)
  ), []);

  const _setTouched = React.useCallback(() => setTouched(path), []);

  return {
    value: _.get(values, path),
    get error() { return validate(values, path) },
    get touched() { return touched(path) },
    setTouched: _setTouched,
    onChange,
  };
}
