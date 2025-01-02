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
import { useField } from '../Form/hooks';

import { createMemoComponent } from '../../../internals/utils';
import { _useComponentStyle } from '../../Style';
import { Modify } from '../../../internals/types';
import Switch from '../../Switch';
import { useFocus, useFocusRing } from '../../../internals/focus';
import { StyleProp, ViewStyle } from 'react-native';

type FormSwitchState = {
  selected: boolean;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  valid: boolean;
};

type FormSwitchProps = Modify<React.ComponentPropsWithoutRef<typeof Switch>, {
  name: string | string[];
  value?: string;
  roles?: string[];
  style?: StyleProp<ViewStyle> | ((state: FormSwitchState) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: FormSwitchState) => React.ReactNode);
  validate?: (value: any) => void;
}>;

export const FormSwitch = createMemoComponent((
  {
    classes,
    name,
    value,
    roles,
    style,
    disabled,
    onPress,
    onFocus,
    onBlur,
    validate,
    children,
    ...props
  }: FormSwitchProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Switch>>
) => {

  const { value: _value, roles: _roles, error, touched, onChange, useValidator } = useField(name);
  const invalid = !_.isEmpty(error);

  useValidator(validate);

  const selected = _.isNil(value) ? !!_value : _.isArray(_value) && _value.includes(value);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const _disabled = disabled || (!_.isNil(roles ?? _roles) && _.isEmpty(_.intersection(roles ?? _roles, _roles ?? roles)));

  const formSwitchStyle = _useComponentStyle('formSwitch', classes, [
    focused && 'focus',
    selected && 'checked',
    _disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  const state = {
    focused,
    selected: selected ?? false,
    disabled: _disabled,
    valid: touched && !invalid,
    invalid: touched && invalid,
  };

  return (
    <Switch
      ref={forwardRef}
      selected={selected}
      disabled={_disabled}
      style={[
        touched && focusRing,
        formSwitchStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      onPress={onPress ?? (() => onChange((state: any) => {
        if (_.isNil(value)) return !state;
        return _.isArray(state) && state.includes(value) ? state.filter(x => x !== value) : [..._.castArray(state ?? []), value];
      }))}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
    >{_.isFunction(children) ? children(state) : children}</Switch>
  )
}, {
  displayName: 'Form.Switch'
});

export default FormSwitch;