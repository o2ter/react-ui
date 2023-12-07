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
import { NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import TextInput from '../../TextInput';
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';
import { createMemoComponent } from '../../../internals/utils';
import { useComponentStyle } from '../../Style';
import { useFocus, useFocusRing } from '../../../internals/focus';

type FormTextFieldProps = Modify<React.ComponentPropsWithoutRef<typeof TextInput>, {
  name: string | string[];
}>

export const FormTextField = createMemoComponent((
  {
    classes,
    name,
    style,
    onFocus,
    onBlur,
    ...props
  }: FormTextFieldProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof TextInput>>
) => {

  const { value, error, touched, setTouched, onChange, submit } = useField(name);
  const invalid = !_.isEmpty(error);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const formTextFieldStyle = useComponentStyle('formTextField', classes, [
    focused && 'focus',
    props.editable ? 'enabled' : 'disabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  const onEndEditing = React.useCallback((e: NativeSyntheticEvent<TextInputEndEditingEventData>) => { onChange(e.nativeEvent.text); setTouched(); }, []);

  const focusRing = useFocusRing(focused, invalid ? 'error' : 'primary');

  return (
    <TextInput
      ref={forwardRef}
      value={value ?? ''}
      onChangeText={onChange}
      onEndEditing={onEndEditing}
      onSubmitEditing={submit}
      onFocus={_onFocus}
      onBlur={_onBlur}
      style={[
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        touched && focusRing,
        formTextFieldStyle,
        _.isFunction(style) ? style({ focused }) : style,
      ]}
      {...props} />
  );
}, {
  displayName: 'Form.TextField'
});

export default FormTextField;