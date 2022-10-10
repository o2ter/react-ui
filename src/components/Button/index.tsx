//
//  index.tsx
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
  Platform,
  Animated,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

import { useTheme } from '../../theme';
import { transparent } from '../../color';
import { text_style } from '../../internals/text_style';
import { Modify } from '../../internals/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = Modify<PressableProps, Partial<{
  variant: string;
  outline: boolean;
  title: string;
  style: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
  onHoverIn: (event: GestureResponderEvent) => void;
  onHoverOut: (event: GestureResponderEvent) => void;
}>>

export const Button = React.forwardRef<typeof AnimatedPressable, ButtonProps>(({
  variant = 'primary',
  outline = false,
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
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: focused.hover || focused.press ? 1 : 0,
      duration: theme.buttonDuration,
      easing: theme.buttonEasing,
      useNativeDriver: false,
    }).start();

  }, [focused.hover || focused.press]);

  const theme = useTheme();
  const selectedColor = theme.colors[variant];

  const fromColors = theme.styles.buttonColors(selectedColor);
  const toColors = theme.styles.buttonFocusedColors(selectedColor);

  const _interpolate = (c1: string, c2: string) => fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [c1, c2] });
  const colors = {
    color: _interpolate(outline ? selectedColor : fromColors.color, toColors.color),
    backgroundColor: outline ? _interpolate(transparent(selectedColor, 0), selectedColor) : _interpolate(fromColors.backgroundColor, toColors.backgroundColor),
    borderColor: outline ? selectedColor : _interpolate(fromColors.borderColor, toColors.borderColor),
  };

  const defaultStyle = StyleSheet.flatten([
    {
      textAlign: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: theme.borderWidth,
      borderRadius: theme.borderRadius,
      fontSize: theme.fontSizeBase,
      fontWeight: theme.fontWeightNormal,
    } as TextStyle,
    theme.styles.buttonStyle,
    colors,
  ]);

  const content = _.isEmpty(children) && !_.isEmpty(title) ? (
    <Animated.Text style={[_.pick(defaultStyle, text_style), titleStyle]}>{title}</Animated.Text>
  ) : children;

  const callbacks: any = Platform.select({
    web: {
      onHoverIn: (e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, hover: true }));
        if (_.isFunction(onHoverIn)) onHoverIn(e);
      },
      onHoverOut: (e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, hover: false }));
        if (_.isFunction(onHoverOut)) onHoverOut(e);
      },
    },
    default: {},
  });

  return (
    <AnimatedPressable
      ref={forwardRef}
      disabled={disabled}
      focusable={!disabled && focusable !== false}
      style={[_.omit(defaultStyle, text_style), style]}
      onPressIn={(e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, press: true }));
        if (_.isFunction(onPressIn)) onPressIn(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, press: false }));
        if (_.isFunction(onPressOut)) onPressOut(e);
      }}
      {...callbacks} {...props}>
      {content}
    </AnimatedPressable>
  );
})

export default Button;