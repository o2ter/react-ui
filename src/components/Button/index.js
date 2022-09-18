//
//  index.js
//
//  The MIT License
//  Copyright (c) 2021 - 2022 O2ter Limited. All rights reserved.
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

import {
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../theme';

const text_style = [
  'color',
  'fontFamily',
  'fontFeatureSettings',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'includeFontPadding',
  'fontVariant',
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
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'unicodeBidi',
  'whiteSpace',
  'wordBreak',
  'wordWrap',
  'writingDirection',
]

export const Button = React.forwardRef(({
  variant = 'primary',
	title,
	style,
	titleStyle,
	disabled,
	focusable,
	children,
	onHoverIn,
	onHoverOut,
	onPressIn,
	onPressOut,
	...props
}, forwardRef) => {

  const [focused, setFocused] = React.useState({ hover: false, press: false });
  
  const theme = useTheme();
  const selectedColor = theme.colors[variant];
  
  const defaultStyle = StyleSheet.flatten([
    theme.styles.buttonStyle,
    focused.hover || focused.press ? theme.styles.buttonFocusedColors(selectedColor) : theme.styles.buttonColors(selectedColor),
  ]);
  
	const content = _.isEmpty(children) && !_.isEmpty(title) ? (
    <Text style={[_.pick(defaultStyle, text_style), titleStyle]}>{title}</Text>
  ) : children;

  return (
    <Pressable
    ref={forwardRef}
    disabled={disabled}
    focusable={!disabled && focusable !== false}
    style={[_.omit(defaultStyle, text_style), style]}
    onHoverIn={(e) => {
      setFocused(state => ({ ...state, hover: true }));
      if (onHoverIn) onHoverIn(e);
    }}
    onHoverOut={(e) => {
      setFocused(state => ({ ...state, hover: false }));
      if (onHoverOut) onHoverOut(e);
    }}
    onPressIn={(e) => {
      setFocused(state => ({ ...state, press: true }));
      if (onPressIn) onPressIn(e);
    }}
    onPressOut={(e) => {
      setFocused(state => ({ ...state, press: false }));
      if (onPressOut) onPressOut(e);
    }}
    {...props}>
		  {content}
    </Pressable>
  );
})

export default Button;