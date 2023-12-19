//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2023 O2ter Limited. All rights reserved.
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
import { useForm } from '../Form';
import { Button } from '../../Button';
import { Modify } from '../../../internals/types';
import { createMemoComponent } from '../../../internals/utils';

type FormButtonProps = Modify<React.ComponentPropsWithoutRef<typeof Button>, {
  action?: 'submit' | 'reset' | (string & {});
}>

export const FormButton = createMemoComponent((
  {
    action = 'submit',
    ...props
  }: FormButtonProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Button>>
) => {

  const { submit, reset, action: _action } = useForm();

  const defaultProps = {
    submit: {
      color: 'primary',
      onPress: submit,
    },
    reset: {
      color: 'danger',
      onPress: reset,
    },
  }

  return (
    <Button
      ref={forwardRef}
      title={_.upperCase(action)}
      {..._.get(defaultProps, action, { onPress: () => _action(action) })}
      {...props} />
  );
}, {
  displayName: 'Form.Button'
});

export default FormButton;