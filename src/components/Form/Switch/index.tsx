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
import Switch from '../../Switch';
import { useFocus } from '../../../internals/focus';

type FormSwitchProps = Modify<React.ComponentPropsWithoutRef<typeof Switch>, {
  name: string | string[];
  value?: string;
}>;

export const FormSwitch = createMemoComponent((
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
  }: FormSwitchProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Switch>>
) => {

  const { value: state, error, touched, onChange } = useField(name);
  const invalid = !_.isEmpty(error);

  const selected = _.isNil(value) ? !!state : _.isArray(state) && state.includes(value);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const formSwitchStyle = useComponentStyle('formSwitch', classes, [
    focused && 'focus',
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  return (
    <Switch
      ref={forwardRef}
      selected={selected}
      style={[
        formSwitchStyle,
        _.isFunction(style) ? style({ selected: selected ?? false, focused }) : style,
      ]}
      onPress={onPress ?? (() => onChange((state: any) => {
        if (_.isNil(value)) return !state;
        return _.isArray(state) && state.includes(value) ? state.filter(x => x !== value) : [..._.castArray(state ?? []), value];
      }))}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
    >{children}</Switch>
  )
}, {
  displayName: 'Form.Switch'
});

export default FormSwitch;