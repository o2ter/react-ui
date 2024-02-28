//
//  types.ts
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

import React from 'react';
import { ISchema, object, TypeOfSchema } from '@o2ter/valid.js';

export type FormState = {
  roles?: string[];
  values: Record<string, any>;
  errors: Error[];
  dirty: boolean;
  submitting: boolean;
  resetting: boolean;
  loading: string[];
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

export type FormProps<S extends Record<string, ISchema<any, any>>> = {
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
  onError?: (error: Error, state: FormState & { preventDefault: VoidFunction; }) => void;
  children?: React.ReactNode | ((state: FormState) => React.ReactNode);
};

