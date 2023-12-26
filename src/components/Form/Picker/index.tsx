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
import { useTheme } from '../../../theme';
import { Picker } from '../../Picker';
import { Modify } from '../../../internals/types';
import { useDefaultInputStyle } from '../../TextInput/style';
import { useEquivalent } from 'sugax';
import { createMemoComponent } from '../../../internals/utils';
import { ItemValue } from '../../Picker/native';
import { useComponentStyle } from '../../Style';
import { useFocus, useFocusRing } from '../../../internals/focus';
import { StyleProp, TextStyle } from 'react-native';

type FormPickerState = {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
  valid: boolean;
};

type FormPickerProps<T = ItemValue> = Modify<React.ComponentPropsWithoutRef<typeof Picker<T>>, {
  name: string | string[];
  variant?: 'outline' | 'underlined' | 'unstyled';
  style?: StyleProp<TextStyle> | ((state: FormPickerState) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: FormPickerState) => React.ReactNode);
  append?: React.ReactNode | ((state: FormPickerState) => React.ReactNode);
  validate?: (value: any) => void;
}>

export const FormPicker = createMemoComponent(<T = ItemValue>(
  {
    classes,
    name,
    baseStyle,
    style,
    variant,
    items,
    disabled,
    prepend,
    append,
    onFocus,
    onBlur,
    validate,
    ...props
  }: FormPickerProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Picker<T>>>
) => {

  const { value, error, touched, setTouched, onChange, useValidator } = useField(name);
  const invalid = !_.isEmpty(error);

  useValidator(validate);

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const formPickerStyle = useComponentStyle('formPicker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  React.useEffect(() => {

    if (!_.some(items, x => x.value === value)) onChange(_.first(items)?.value);

  }, [useEquivalent(_.map(items, x => x.value))]);

  const _onChange = React.useCallback((value: any) => { onChange(value); setTouched(); }, []);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  const state = {
    focused,
    disabled: disabled ?? false,
    valid: touched && !invalid,
    invalid: touched && invalid,
  };

  return (
    <Picker
      ref={forwardRef}
      value={value}
      items={items}
      disabled={disabled}
      onValueChange={_onChange}
      onFocus={_onFocus}
      onBlur={_onBlur}
      prepend={_.isFunction(prepend) ? prepend(state) : prepend}
      append={_.isFunction(append) ? append(state) : append}
      baseStyle={[defaultStyle, baseStyle]}
      style={[
        touched && focusRing,
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        formPickerStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      {...props} />
  )
}, {
  displayName: 'Form.Picker'
});

export default FormPicker;
