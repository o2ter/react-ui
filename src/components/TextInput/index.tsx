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
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import { useDefaultInputStyle } from './style';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames, useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';
import { useFocus, useFocusRing } from '../../internals/focus';

type TextInputProps = Omit<RNTextInputProps, 'style'> & {
  classes?: ClassNames;
  style?: StyleProp<TextStyle> | ((state: { focused: boolean; }) => StyleProp<TextStyle>);
};

export const TextInput = createMemoComponent(({
  classes,
  style,
  onFocus,
  onBlur,
  children,
  ...props
}: TextInputProps, forwardRef: React.ForwardedRef<RNTextInput>) => {

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textInputStyle = useComponentStyle('textInput', classes, [
    focused && 'focus',
  ]);
  const defaultStyle = useDefaultInputStyle(theme);

  return (
    <RNTextInput
      ref={forwardRef}
      style={textStyleNormalize([
        defaultStyle,
        useFocusRing(focused),
        textInputStyle,
        _.isFunction(style) ? style({ focused }) : style,
      ])}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}>
      {children}
    </RNTextInput>
  );
}, {
  displayName: 'TextInput',
});

export default TextInput;