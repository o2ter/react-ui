//
//  hooks.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the 'Software'), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
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
import { useStableCallback } from 'sugax';
import { FormContext, FormInternalContext } from './context';

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
    get error() { return _.compact([...validate(values, path), extraError(uniqId)]); },
    get touched() { return touched(path); },
    setTouched: _setTouched,
    useValidator,
    onChange,
    submit,
    reset,
  };
};
