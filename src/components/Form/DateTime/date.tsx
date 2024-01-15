//
//  date.tsx
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
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';
import { DatePicker } from '../../DateTime';
import { createMemoComponent } from '../../../internals/utils';
import { _useComponentStyle } from '../../Style';
import { ClassNames } from '../../Style/types';
import { useFocus, useFocusRing } from '../../../internals/focus';
import { StyleProp, TextStyle } from 'react-native';

type FormDateState = {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  valid: boolean;
};

type FormDateProps = Modify<React.ComponentPropsWithoutRef<typeof DatePicker>, {
  classes?: ClassNames;
  name: string | string[];
  roles?: string[];
  style?: StyleProp<TextStyle> | ((state: FormDateState) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: FormDateState) => React.ReactNode);
  append?: React.ReactNode | ((state: FormDateState) => React.ReactNode);
  validate?: (value: any) => void;
}>;

export const FormDate = /*#__PURE__*/ createMemoComponent((
  {
    classes,
    name,
    roles,
    min,
    max,
    multiple,
    style,
    disabled = false,
    prepend,
    append,
    onFocus,
    onBlur,
    selectable = () => true,
    validate,
    children,
    ...props
  }: FormDateProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof DatePicker>>
) => {

  const { value, roles: _roles, error, touched, setTouched, onChange, useValidator } = useField(name);
  const invalid = !_.isEmpty(error);

  useValidator(validate);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const _disabled = disabled || (!_.isNil(roles ?? _roles) && _.isEmpty(_.intersection(roles ?? _roles, _roles ?? roles)));

  const formDateStyle = _useComponentStyle('formDate', classes, [
    focused && 'focus',
    _disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  const _onChange = React.useCallback((value: any) => {
    onChange(multiple ? value : _.first(value));
    setTouched();
  }, []);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  const state = {
    focused,
    disabled: _disabled,
    valid: touched && !invalid,
    invalid: touched && invalid,
  };

  return (
    <DatePicker
      ref={forwardRef}
      value={value}
      min={min}
      max={max}
      multiple={multiple}
      onChange={_onChange}
      onFocus={_onFocus}
      onBlur={_onBlur}
      selectable={selectable}
      disabled={_disabled}
      prepend={_.isFunction(prepend) ? prepend(state) : prepend}
      append={_.isFunction(append) ? append(state) : append}
      style={[
        touched && focusRing,
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        formDateStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      {...props} />
  )
}, {
  displayName: 'Form.Date'
});

export default FormDate;