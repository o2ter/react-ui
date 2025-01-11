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
import { NativeSyntheticEvent, StyleProp, TextInputEndEditingEventData, TextStyle } from 'react-native';
import TextInput from '../../TextInput';
import { useField } from '../Form/hooks';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';
import { createMemoComponent } from '../../../internals/utils';
import { _useComponentStyle } from '../../Style';
import { useFocus, useFocusRing } from '../../../internals/focus';

type FormTextFieldState = {
  value: string;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  valid: boolean;
};

type FormTextFieldProps = Modify<React.ComponentPropsWithoutRef<typeof TextInput>, {
  name: string | string[];
  roles?: string[];
  style?: StyleProp<TextStyle> | ((state: FormTextFieldState) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: FormTextFieldState) => React.ReactNode);
  append?: React.ReactNode | ((state: FormTextFieldState) => React.ReactNode);
  validate?: (value: any) => void;
}>

export const FormTextField = createMemoComponent((
  {
    classes,
    name,
    roles,
    style,
    editable = true,
    readOnly = !editable,
    prepend,
    append,
    onFocus,
    onBlur,
    validate,
    ...props
  }: FormTextFieldProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof TextInput>>
) => {

  const { value, roles: _roles, error, touched, setTouched, onChange, submit, useValidator } = useField(name);
  const invalid = !_.isEmpty(error);

  useValidator(validate);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const _disabled = !!readOnly || (!_.isNil(roles ?? _roles) && _.isEmpty(_.intersection(roles ?? _roles, _roles ?? roles)));

  const formTextFieldStyle = _useComponentStyle('formTextField', classes, [
    focused && 'focus',
    _disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  const onEndEditing = React.useCallback((e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    onChange(e.nativeEvent.text);
    setTouched();
  }, []);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  const state = {
    value: value ?? '',
    focused,
    disabled: _disabled,
    valid: touched && !invalid,
    invalid: touched && invalid,
  };

  return (
    <TextInput
      ref={forwardRef}
      value={value ?? ''}
      readOnly={_disabled}
      onChangeText={onChange}
      onEndEditing={onEndEditing}
      onSubmitEditing={submit}
      onFocus={_onFocus}
      onBlur={_onBlur}
      prepend={_.isFunction(prepend) ? prepend(state) : prepend}
      append={_.isFunction(append) ? append(state) : append}
      style={[
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        touched && focusRing,
        formTextFieldStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      {...props} />
  );
}, {
  displayName: 'Form.TextField'
});

export default FormTextField;