//
//  native.tsx
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
import { StyleProp, TextStyle } from 'react-native';
import { Picker as RNPicker, PickerItemProps } from '@react-native-picker/picker';
import { createMemoComponent } from '../../internals/utils';
import { flattenStyle } from '../Style/flatten';
import { useTheme } from '../../theme';
import { ClassNames } from '../Style';

export type ItemValue = number | string;

type PickerNativeProps<T = ItemValue> = {
  value?: T;
  items: PickerItemProps<T>[];
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  renderText?: (label?: PickerItemProps<T>) => any
  onValueChange?: (itemValue: T, itemIndex: number) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
}

export type PickerProps<T = ItemValue> = PickerNativeProps<T> & {
  classes?: ClassNames;
};

export const PickerNative = createMemoComponent(<T = ItemValue>({
  value,
  items,
  disabled = false,
  style,
  onValueChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
}: PickerNativeProps<T>, forwardRef: React.ForwardedRef<RNPicker<T>>) => {

  const id = React.useId();
  const _style = React.useMemo(() => flattenStyle(style), [style]);

  const theme = useTheme();

  return (
    <RNPicker
      ref={forwardRef}
      style={_style}
      enabled={!disabled}
      onValueChange={onValueChange}
      selectedValue={value}
      onFocus={onFocus}
      onBlur={onBlur}>
      {_.map(items, ({ style, ...props }, index) => (
        <RNPicker.Item
          key={`${id}-${index}`}
          style={[{ fontSize: theme.root.fontSize }, style]}
          {...props}
        />
      ))}
    </RNPicker>
  );
}, {
  displayName: 'Picker',
});

export default PickerNative;