//
//  web.tsx
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
import { StyleSheet } from 'react-native';
import { ItemValue, PickerNative, PickerProps } from './native';
import { createMemoComponent } from '../../internals/utils';
import { useComponentStyle } from '../Style';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import View from '../View';
import Text from '../Text';

export const PickerWeb = createMemoComponent(<T = ItemValue>(
  {
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
  }: PickerProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof PickerNative<T>>>
) => {

  const theme = useTheme();

  const selected = _.find(items, x => x.value === value);
  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textStyle = useComponentStyle('text');
  const pickerStyle = useComponentStyle('picker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const focusRing = useFocusRing(focused);

  const state = { focused, disabled };
  const content = renderText(selected);

  return (
    <View style={[
      baseStyle,
      {
        flexDirection: 'row',
        gap: theme.spacer * 0.375,
        color: theme.root.textColor,
        fontSize: theme.root.fontSize,
        lineHeight: theme.root.lineHeight,
      },
      focusRing,
      textStyle,
      pickerStyle,
      _.isFunction(style) ? style(state) : style,
    ]}>
      {_.isFunction(prepend) ? prepend(state) : prepend}
      <Text style={{ flex: 1 }}>{_.isEmpty(content) ? ' ' : content}</Text>
      {_.isFunction(append) ? append(state) : append}
      <PickerNative
        ref={forwardRef}
        value={value}
        items={items}
        disabled={disabled}
        onValueChange={onValueChange}
        onFocus={_onFocus}
        onBlur={_onBlur}
        style={[
          StyleSheet.absoluteFill,
          {
            minWidth: '100%',
            minHeight: '100%',
            opacity: 0,
          }
        ]} />
    </View>
  );
}, {
  displayName: 'Picker',
});

export default PickerWeb;