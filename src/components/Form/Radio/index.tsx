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
import { useField } from '../Form';

import { createMemoComponent } from '../../../internals/utils';
import { useComponentStyle } from '../../Style';
import { Modify } from '../../../internals/types';
import Radio from '../../Radio';
import { useFocus, useFocusRing } from '../../../internals/focus';

type FormRadioProps = Modify<React.ComponentPropsWithoutRef<typeof Radio>, {
  name: string | string[];
  value: any;
}>;

export const FormRadio = createMemoComponent((
  {
    classes,
    name,
    value,
    style,
    onPress,
    onFocus,
    onBlur,
    children,
    ...props
  }: FormRadioProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Radio>>
) => {

  const { value: _value, error, touched, onChange } = useField(name);
  const invalid = !_.isEmpty(error);

  const selected = value === _value;

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const formRadioStyle = useComponentStyle('formRadio', classes, [
    focused && 'focus',
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  return (
    <Radio
      ref={forwardRef}
      selected={selected}
      style={[
        touched && useFocusRing(focused, invalid ? 'error' : 'primary'),
        formRadioStyle,
        _.isFunction(style) ? style({ selected: selected ?? false, focused }) : style,
      ]}
      onPress={onPress ?? (() => onChange(value))}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
    >{children}</Radio>
  )
}, {
  displayName: 'Form.Radio'
});

export default FormRadio;