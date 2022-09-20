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
import { useCallbackRef } from 'sugax';
import { AnySchema, object } from 'yup';

type FormState = {
  values: Record<string, any>;
  errors: Record<string, any>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  submit: () => void;
  reset: () => void;
}

const FormContext = React.createContext<FormState>({
  values: {},
  errors: {},
  setValues: () => {},
  submit: () => {},
  reset: () => {},
});

type FormProps = {
  schema: Record<string, AnySchema>,
  initialValues: Record<string, any>,
  onReset: (state: FormState) => void,
  onSubmit: (values: Record<string, any>, state: FormState) => void,
}

export const Form: React.FC<Partial<FormProps>> = ({
  schema = {},
  initialValues = {},
  onReset = () => {},
  onSubmit = () => {},
  children
}) => {

  const [values, setValues] = React.useState(initialValues);
  
  const onResetRef = useCallbackRef(onReset);
  const onSubmitRef = useCallbackRef(onSubmit);

  const formState = React.useMemo(() => {
    
    let errors: Record<string, any>;

    return {

      values, setValues,

      get errors() {
        if (_.isNil(errors)) errors = object(schema).validateSync(values);
        return errors;
      },

      submit: () => { if (_.isFunction(onSubmitRef.current)) onSubmitRef.current(values, formState); },

      reset: () => {
        setValues(initialValues);
        if (_.isFunction(onResetRef.current)) onResetRef.current(formState);
      },
    };
  }, [values, setValues]);

  return <FormContext.Provider value={formState}>
    {children}
  </FormContext.Provider>;
};
