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
import { useTheme } from '../../../theme';
import { Select } from '../../Select';
import { Modify } from '../../../internals/types';
import { createMemoComponent } from '../../../internals/utils';
import { _useComponentStyle } from '../../Style';
import { useFocus, useFocusRing } from '../../../internals/focus';
import { StyleProp, TextStyle } from 'react-native';
import { SelectValue } from '../../Select/types';

type FormSelectState<T, M extends boolean> = {
  value: SelectValue<T, M>;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  valid: boolean;
};

type FormSelectProps<T, M extends boolean> = Modify<React.ComponentPropsWithoutRef<typeof Select<T, M>>, {
  name: string | string[];
  roles?: string[];
  style?: StyleProp<TextStyle> | ((state: FormSelectState<T, M>) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: FormSelectState<T, M>) => React.ReactNode);
  append?: React.ReactNode | ((state: FormSelectState<T, M>) => React.ReactNode);
  validate?: (value: any) => void;
}>

export const FormSelect = createMemoComponent(<T extends unknown = any, M extends boolean = false>(
  {
    classes,
    name,
    roles,
    style,
    multiple,
    disabled,
    prepend,
    append,
    onFocus,
    onBlur,
    validate,
    ...props
  }: FormSelectProps<T, M>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Select<T, M>>>
) => {

  const { value, roles: _roles, disabled: formDisabled, error, touched, setTouched, onChange, useValidator } = useField(name);
  const invalid = !_.isEmpty(error);

  useValidator(validate);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const _disabled = formDisabled || disabled || (!_.isNil(roles ?? _roles) && _.isEmpty(_.intersection(roles ?? _roles, _roles ?? roles)));

  const formSelectStyle = _useComponentStyle('formSelect', classes, [
    focused && 'focus',
    _disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  const _onChange = React.useCallback((value: T[] | T | undefined) => {
    onChange(value);
    setTouched();
  }, []);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  const state = {
    focused,
    disabled: _disabled,
    valid: touched && !invalid,
    invalid: touched && invalid,
    value: multiple ? value ?? [] : value,
  };

  return (
    <Select
      ref={forwardRef}
      value={value}
      multiple={multiple}
      disabled={_disabled}
      onValueChange={_onChange}
      onFocus={_onFocus}
      onBlur={_onBlur}
      prepend={_.isFunction(prepend) ? prepend(state) : prepend}
      append={_.isFunction(append) ? append(state) : append}
      style={[
        touched && focusRing,
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        formSelectStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      {...props as any}
    />
  )
}, {
  displayName: 'Form.Select'
});

export default FormSelect;
