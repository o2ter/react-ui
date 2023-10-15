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
  PressableStateCallbackType,
} from 'react-native';

import { useTheme } from '../../theme';
import { transparent } from '../../color';
import { textStyleKeys } from '../Text/style';
import { Modify } from '../../internals/types';
import { Text } from '../Text';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames, useComponentStyle } from '../Style';
import { flattenStyle } from '../Style/flatten';
import { AnimatedPressable } from '../Animated';

type ButtonStateCallbackType = PressableStateCallbackType & {
  hovered: boolean;
};

type ButtonProps = Modify<PressableProps, {
  classes?: ClassNames;
  color?: string;
  variant?: string;
  outline?: boolean;
  size?: string;
  title?: string;
  style?: StyleProp<ViewStyle> | ((state: ButtonStateCallbackType) => StyleProp<ViewStyle>);
  titleStyle?: StyleProp<TextStyle> | ((state: ButtonStateCallbackType) => StyleProp<TextStyle>);
  onHoverIn?: (event: GestureResponderEvent) => void;
  onHoverOut?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode | ((state: ButtonStateCallbackType) => React.ReactNode);
}>;

const ButtonText = Animated.createAnimatedComponent(createMemoComponent((
  {
    style,
    children,
  }: React.PropsWithChildren<{ style: TextStyle; }>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Text>>
) => {
  return (
    <Text ref={forwardRef} style={style} selectable={false}>{children}</Text>
  );
}));

export const Button = createMemoComponent(({
  classes,
  color,
  variant = 'primary',
  outline = false,
  size = 'normal',
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
}: ButtonProps, forwardRef: React.ForwardedRef<typeof AnimatedPressable>) => {

  const [focused, setFocused] = React.useState({ hovered: false, pressed: false });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: focused.hovered || focused.pressed ? 1 : 0,
      duration: theme.buttonDuration,
      easing: theme.buttonEasing,
      useNativeDriver: false,
    }).start();

  }, [focused.hovered || focused.pressed]);

  const theme = useTheme();
  const buttonStyle = useComponentStyle('button', classes, [
    focused.hovered && 'hover',
    focused.pressed && 'active',
    disabled ? 'disabled' : 'enabled',
  ]);
  const selectedColor = color ?? theme.themeColors[variant] ?? theme.colors[variant];

  const colors = React.useMemo(() => {

    const fromColors = theme.palette.buttonColors(selectedColor);
    const toColors = theme.palette.buttonFocusedColors(selectedColor);

    const _interpolate = (c1: string, c2: string) => c1 === c2 ? c1 : fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [c1, c2] });
    return {
      color: _interpolate(outline ? selectedColor : fromColors.color, toColors.color),
      backgroundColor: outline ? _interpolate(transparent(selectedColor, 0), selectedColor) : _interpolate(fromColors.backgroundColor, toColors.backgroundColor),
      borderColor: outline ? selectedColor : _interpolate(fromColors.borderColor, toColors.borderColor),
    };

  }, [theme, selectedColor, outline]);

  const _defaultStyle = React.useMemo(() => flattenStyle([
    {
      textAlign: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: theme.borderWidth,
      borderRadius: theme.borderRadiusBase,
      fontSize: theme.fontSizes[size] ?? theme.root.fontSize,
      fontWeight: theme.fontWeights['normal'] ?? theme.root.fontWeight,
      opacity: disabled ? 0.65 : 1,
    } as TextStyle,
    buttonStyle,
  ]), [theme, size, disabled]);

  const defaultStyle = React.useMemo(() => StyleSheet.create({
    text: _.pick(_defaultStyle, textStyleKeys),
    button: _.omit(_defaultStyle, textStyleKeys),
  }), [_defaultStyle]);

  const _style = flattenStyle([
    defaultStyle.text,
    _.pick(colors, textStyleKeys) as TextStyle,
    _.isFunction(titleStyle) ? titleStyle(focused) : titleStyle,
  ]);
  const _wrapped = (children: React.ReactNode) => <ButtonText style={_style}>{children}</ButtonText>;

  const content = _.isEmpty(children) && !_.isEmpty(title)
    ? <Animated.Text selectable={false} style={_style}>{title}</Animated.Text>
    : _.isFunction(children) ? () => _wrapped(children(focused)) : _wrapped(children);

  const callbacks: any = Platform.select({
    web: {
      onHoverIn: (e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, hovered: true }));
        if (_.isFunction(onHoverIn)) onHoverIn(e);
      },
      onHoverOut: (e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, hovered: false }));
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
      style={[
        defaultStyle.button,
        _.omit(colors, textStyleKeys),
        _.isFunction(style) ? style(focused) : style,
      ]}
      onPressIn={(e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, pressed: true }));
        if (_.isFunction(onPressIn)) onPressIn(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setFocused(state => ({ ...state, pressed: false }));
        if (_.isFunction(onPressOut)) onPressOut(e);
      }}
      {...callbacks} {...props}>
      {content}
    </AnimatedPressable>
  );
}, {
  displayName: 'Button',
});

export default Button;