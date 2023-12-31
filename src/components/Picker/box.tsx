//
//  box.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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
import { ClassNames, _useComponentStyle } from '../Style';
import { useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import { createComponent } from '../../internals/utils';
import View from '../View';
import Text from '../Text';

type PickerBoxProps = React.PropsWithChildren<{
  classes?: ClassNames;
  style?: StyleProp<TextStyle> | ((state: { focused: boolean; }) => StyleProp<TextStyle>);
  focused: boolean;
  disabled?: boolean;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}>;

export const PickerBox = createComponent(({
  classes,
  style,
  focused,
  disabled,
  prepend,
  append,
  children,
}: PickerBoxProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>) => {

  const theme = useTheme();

  const textStyle = _useComponentStyle('text');
  const pickerStyle = _useComponentStyle('picker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const focusRing = useFocusRing(focused);

  return (
    <View ref={forwardRef} style={[
      focusRing,
      {
        flexDirection: 'row',
        gap: theme.spacer * 0.375,
        color: theme.root.textColor,
        fontSize: theme.root.fontSize,
        lineHeight: theme.root.lineHeight,
      },
      textStyle,
      pickerStyle,
      _.isFunction(style) ? style({ focused }) : style,
    ]}>
      {prepend}
      <Text style={{ flex: 1 }}>{children || ' '}</Text>
      {append}
    </View>
  );
});
