//
//  style.tsx
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
import { TextStyle, StyleProp } from 'react-native';
import { flattenStyle } from '../Style/flatten';
import { ClassNames, StyleProvider, useStyle } from '../Style';

export const textStyleKeys = [
  'color',
  'fontFamily',
  'fontFeatureSettings',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'includeFontPadding',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textAlignVertical',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textIndent',
  'textOverflow',
  'textRendering',
  'textShadow',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'unicodeBidi',
  'whiteSpace',
  'wordBreak',
  'wordWrap',
  'writingDirection',
];

export const textStyleNormalize = (style?: StyleProp<TextStyle>) => {
  const { lineHeight, fontSize, ...remains } = flattenStyle(style);
  return {
    ...remains,
    fontSize,
    lineHeight: _.isNumber(fontSize) && _.isNumber(lineHeight) ? fontSize * lineHeight : undefined,
  };
}

export const TextStyleProvider: React.FC<React.PropsWithChildren<{
  classes?: ClassNames;
  style?: StyleProp<TextStyle>;
}>> = ({
  classes,
  style,
  children,
}) => {
  const _style = flattenStyle([useStyle(classes) as TextStyle, style]);
  return (
    <StyleProvider components={{ text: _.pick(_style, ...textStyleKeys) }}>{children}</StyleProvider>
  )
}
