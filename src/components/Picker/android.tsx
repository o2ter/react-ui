//
//  andorid.tsx
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
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ItemValue, PickerNative, PickerProps } from './native';
import { createMemoComponent } from '../../internals/utils';
import { useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';

export const PickerAndroid = createMemoComponent(<T = ItemValue>({
  classes,
  value,
  items = [],
  disabled = false,
  style,
  renderText = (item) => item?.label,
  onValueChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}: PickerProps<T>, forwardRef: React.ForwardedRef<Text>) => {

  const selected = _.find(items, x => x.value === value);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textStyle = useComponentStyle('text');
  const pickerStyle = useComponentStyle('picker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  function _setShowPicker(value: boolean) {
    value ? _onFocus() : _onBlur();
  }

  const focusRing = useFocusRing(focused);

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => { if (!disabled) _setShowPicker(true) }}>
      <Text ref={forwardRef} style={textStyleNormalize([
        focusRing,
        {
          color: theme.root.textColor,
          fontSize: theme.root.fontSize,
          lineHeight: theme.root.lineHeight,
        },
        textStyle,
        pickerStyle,
        _.isFunction(style) ? style({ focused }) : style,
      ])}>{renderText(selected)}</Text>
      <PickerNative
        value={value}
        items={items}
        onValueChange={onValueChange}
        style={[StyleSheet.absoluteFill, {
          color: 'transparent',
          opacity: 0,
        }]} />
    </TouchableOpacity>
  )
}, {
  displayName: 'Picker',
});

export default PickerAndroid;