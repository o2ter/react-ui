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
import React, { ComponentRef } from 'react';
import { TextProps, StyleProp, TextStyle, StyleSheet } from 'react-native';
import Text from '../Text';
import * as Icons from '../Icons';
import { Modify } from '../../internals/types';
import { useTheme } from '../../theme';
import { useTextStyle } from '../Text/style';
import { text_style } from '../../internals/text_style';

type IconProps = Modify<TextProps, {
  icon: keyof typeof Icons;
  name: string;
  iconStyle?: StyleProp<TextStyle>;
}>

export const Icon = React.forwardRef<ComponentRef<typeof Text>, IconProps>(({
  icon,
  name,
  style,
  iconStyle,
  children,
  ...props
}, forwardRef) => {

  const _Icon = Icons[icon];

  const theme = useTheme();
  const textStyle = useTextStyle();
  const defaultStyle = React.useMemo(() => StyleSheet.create({ style: { color: theme.bodyColor } }).style, [theme]) as TextStyle;

  const _iconStyle = StyleSheet.flatten([defaultStyle, theme.styles.textStyle, textStyle, style, iconStyle]);
  const { fontSize, color } = _iconStyle ?? {};

  return <Text ref={forwardRef} style={style} {...props}>
    {!_.isNil(_Icon) && <_Icon name={name} size={fontSize} color={color} style={_.pick(_iconStyle, text_style)} />}
    {children}
  </Text>;
});

export default Icon;