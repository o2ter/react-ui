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
import { TextProps, StyleProp, TextStyle } from 'react-native';
import Text from '../Text';
import { GLYPH_MAPS, ICON_SETS } from '../Icons';
import { Modify } from '../../internals/types';
import { textStyleKeys } from '../Text/style';
import { createComponent } from '../../internals/utils';
import { ClassNames, useComponentStyle } from '../Style';
import { flattenStyle } from '../Style/flatten';
import { useThemeVariables } from '../../theme';

type IconProps<Icon extends keyof typeof GLYPH_MAPS> = Modify<TextProps, {
  icon: Icon;
  name: keyof (typeof GLYPH_MAPS)[Icon];
  iconStyle?: StyleProp<TextStyle>;
}>

const IconBody = <Icon extends keyof typeof GLYPH_MAPS>({
  icon,
  name,
  style,
}: {
  icon: Icon;
  name: keyof (typeof GLYPH_MAPS)[Icon];
  style?: StyleProp<TextStyle>;
}) => {

  const _Icon = ICON_SETS[icon];

  const theme = useThemeVariables();
  const textStyle = useComponentStyle('text') as TextStyle;
  const { fontSize, color, ..._style } = flattenStyle([{
    fontSize: theme.root.fontSize,
    lineHeight: theme.root.lineHeight,
  }, textStyle, style]) ?? {};

  return (
    <>
      {!_.isNil(_Icon) && <_Icon name={name} size={fontSize} color={color} style={_.pick(_style, textStyleKeys)} />}
    </>
  );
}

export const Icon = createComponent(<Icon extends keyof typeof GLYPH_MAPS>(
  {
    classes,
    icon,
    name,
    style,
    iconStyle,
    children,
    ...props
  }: IconProps<Icon> & { classes?: ClassNames },
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Text>>
) => {

  return <Text ref={forwardRef} classes={classes} style={style} {...props}>
    <IconBody icon={icon} name={name} style={iconStyle} />
    {children}
  </Text>;
}, {
  displayName: 'Icon',
});

export default Icon;