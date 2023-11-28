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

type FormPickerProps<T = ItemValue> = Modify<React.ComponentPropsWithoutRef<typeof Picker<T>>, {
  name: string | string[];
}>

export const FormPicker = createMemoComponent(<T = ItemValue>(
  {
    classes,
    name,
    style,
    items,
    onFocus,
    onBlur,
    ...props
  }: FormPickerProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Picker<T>>>
) => {

  const { value, error, touched, setTouched, onChange } = useField(name);
  const invalid = !_.isEmpty(error);

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const formPickerStyle = useComponentStyle('formPicker', classes, [
    focused && 'focus',
    props.disabled ? 'disabled' : 'enabled',
    touched && (invalid ? 'invalid' : 'valid'),
  ]);

  React.useEffect(() => {

    if (!_.some(items, x => x.value === value)) onChange(_.first(items)?.value);

  }, [useEquivalent(_.map(items, x => x.value))]);

  const _onChange = React.useCallback((value: any) => { onChange(value); setTouched(); }, []);

  return (
    <Picker
      ref={forwardRef}
      value={value}
      items={items}
      onValueChange={_onChange}
      onFocus={_onFocus}
      onBlur={_onBlur}
      style={[
        touched && useFocusRing(focused, invalid ? 'error' : 'primary'),
        defaultStyle,
        touched && invalid ? { borderColor: theme.themeColors.danger } : {},
        formPickerStyle,
        _.isFunction(style) ? style({ focused }) : style,
      ]}
      {...props} />
  )
}, {
  displayName: 'Form.Picker'
});

export default FormPicker;