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
import React, { ComponentRef } from 'react';
import { StyleSheet } from 'react-native';
import { PickerNative, PickerNativeProps } from './native';
import { useTheme } from '../../theme';

const _style = StyleSheet.create({
  picker: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: '0 solid black',
    borderRadius: 0,
    margin: 0,
    padding: 0,
  }
});

export const PickerWeb = React.forwardRef<ComponentRef<typeof PickerNative>, PickerNativeProps>(({
  value,
  items = [],
  disabled = false,
  style,
  renderText = (item) => item?.label,
  onValueChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}, forwardRef) => {

  const theme = useTheme();

  return (
    <PickerNative
      ref={forwardRef}
      value={value}
      items={items}
      disabled={disabled}
      renderText={renderText}
      onValueChange={onValueChange}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[_style.picker, theme.styles.pickerStyle, style]} />
  );
});

export default PickerWeb;