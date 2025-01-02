//
//  andorid.tsx
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
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ItemValue, PickerNative, PickerProps } from './native';
import { createMemoComponent } from '../../internals/utils';
import { useFocus } from '../../internals/focus';
import { PickerBox } from './box';

export const PickerAndroid = createMemoComponent(<T = ItemValue>({
  classes,
  value,
  items = [],
  disabled = false,
  baseStyle,
  style,
  renderText = (item) => item?.label,
  onValueChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  prepend,
  append,
}: PickerProps<T>, forwardRef: React.ForwardedRef<React.ComponentRef<typeof PickerBox>>) => {

  const selected = _.find(items, x => x.value === value);
  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  function _setShowPicker(value: boolean) {
    value ? _onFocus() : _onBlur();
  }

  const state = { focused, disabled, value };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => { if (!disabled) _setShowPicker(true) }}>
      <PickerBox
        ref={forwardRef}
        classes={classes}
        style={[baseStyle, _.isFunction(style) ? style(state) : style]}
        focused={focused}
        disabled={disabled}
        prepend={_.isFunction(prepend) ? prepend(state) : prepend}
        append={_.isFunction(append) ? append(state) : append}
      >
        {renderText(selected)}
      </PickerBox>
      <PickerNative
        value={value}
        items={items}
        onValueChange={onValueChange}
        style={[StyleSheet.absoluteFill, {
          minWidth: '100%',
          minHeight: '100%',
          opacity: 0,
        }]} />
    </TouchableOpacity>
  )
}, {
  displayName: 'Picker',
});

export default PickerAndroid;