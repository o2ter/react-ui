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
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useThemeVariables } from '../../theme';
import { createComponent } from '../../internals/utils';
import { ClassNames, StyleProvider, useComponentStyle } from '../Style';
import { textStyleKeys, textStyleNormalize } from './style';

export const Text = createComponent(({
  classes,
  style,
  children,
  ...props
}: TextProps & { classes?: ClassNames }, forwardRef: React.ForwardedRef<RNText>) => {
  const theme = useThemeVariables();
  const textStyle = useComponentStyle('text', classes);
  return (
    <RNText
      ref={forwardRef}
      style={textStyleNormalize([{
        color: theme.root.textColor,
        fontSize: theme.root.fontSize,
        lineHeight: theme.root.lineHeight,
      }, textStyle, style])}
      {...props}>
      <StyleProvider components={{
        text: [
          _.pick(textStyle, ...textStyleKeys) as TextStyle,
          _.pick(style, ...textStyleKeys) as TextStyle,
        ],
      }}>
        {children}
      </StyleProvider>
    </RNText>
  );
}, {
  displayName: 'Text',
});

export default Text;
