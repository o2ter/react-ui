//
//  index.tsx
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

import {
  Animated,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  MouseEvent,
  GestureResponderEvent,
  PressableStateCallbackType,
  Platform,
} from 'react-native';

import { useTheme } from '../../theme';
import { textStyleKeys } from '../Text/style';
import { Modify } from '../../internals/types';
import { Text } from '../Text';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import { normalizeStyle, flattenStyle } from '../Style/flatten';
import { _AnimatedPressable, _useToggleAnim } from '../_Animated';
import { ThemeColors } from '../../theme/variables';

type ButtonStateCallbackType = PressableStateCallbackType & {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
  activated: boolean;
};

type ButtonProps = Modify<PressableProps, {
  classes?: ClassNames;
  color?: ThemeColors | (string & {});
  variant?: 'solid' | 'subtle' | 'outline' | 'link' | 'ghost' | 'unstyled';
  size?: string;
  title?: string;
  activated?: boolean;
  style?: StyleProp<ViewStyle> | ((state: ButtonStateCallbackType) => StyleProp<ViewStyle>);
  titleStyle?: StyleProp<TextStyle> | ((state: ButtonStateCallbackType) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: ButtonStateCallbackType) => React.ReactNode);
  append?: React.ReactNode | ((state: ButtonStateCallbackType) => React.ReactNode);
  onHoverIn?: (event: MouseEvent) => void;
  onHoverOut?: (event: MouseEvent) => void;
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
  color = 'primary',
  variant = 'solid',
  size = 'normal',
  title,
  style,
  titleStyle,
  disabled,
  focusable,
  activated,
  prepend,
  append,
  children,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
  ...props
}: ButtonProps, forwardRef: React.ForwardedRef<typeof _AnimatedPressable>) => {

  const theme = useTheme();

  const [state, setState] = React.useState({ hovered: false, pressed: false, focused: false });
  const _activated = activated || state.hovered || state.pressed || (_.isNil(activated) && state.focused);
  const _state = { ...state, activated: activated ?? false };

  const fadeAnim = _useToggleAnim({
    value: _activated,
    timing: {
      duration: theme.buttonDuration,
      easing: theme.buttonEasing,
      useNativeDriver: false,
    },
  });

  const buttonStyle = _useComponentStyle('button', classes, [
    state.hovered && 'hover',
    (activated || state.pressed) && 'active',
    state.focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);
  const selectedColor = theme.pickColor(color);

  const colors = React.useMemo(() => {

    const fromColors = theme.palette.buttonColors(selectedColor);
    const toColors = theme.palette.buttonFocusedColors(selectedColor);

    const _interpolate = (c1: string, c2: string) => c1 === c2 ? c1 : fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [c1, c2] });

    const _from = {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      ...fromColors[variant],
    };
    const _to = {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      ...toColors[variant],
    };

    return {
      color: _from.color === _to.color ? _to.color : _interpolate(_from.color, _to.color),
      backgroundColor: _from.backgroundColor === _to.backgroundColor ? _to.backgroundColor : _interpolate(_from.backgroundColor, _to.backgroundColor),
      borderColor: _from.borderColor === _to.borderColor ? _to.borderColor : _interpolate(_from.borderColor, _to.borderColor),
    };

  }, [theme, selectedColor, variant]);

  const _defaultStyle = React.useMemo(() => flattenStyle([
    {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacer * 0.375,
      textAlign: 'center',
      fontSize: theme.fontSizes[size] ?? theme.root.fontSize,
      fontWeight: theme.fontWeights['normal'] ?? theme.root.fontWeight,
    } as TextStyle,
    variant === 'link' && _activated && { textDecorationLine: 'underline' } as TextStyle,
    variant !== 'unstyled' && {
      paddingHorizontal: 12,
      paddingVertical: 6,
      opacity: disabled ? 0.65 : 1,
    },
    colors.borderColor !== 'transparent' && { borderWidth: theme.borderWidth },
    (colors.borderColor !== 'transparent' || colors.backgroundColor !== 'transparent') && { borderRadius: theme.borderRadiusBase },
    buttonStyle,
  ]), [theme, colors, size, disabled, _activated, buttonStyle]);

  const defaultStyle = React.useMemo(() => StyleSheet.create({
    text: _.pick(_defaultStyle, textStyleKeys),
    button: _.omit(_defaultStyle, textStyleKeys),
  }), [_defaultStyle]);

  const _style = flattenStyle([
    _.pick(colors, textStyleKeys) as TextStyle,
    defaultStyle.text,
    _.isFunction(titleStyle) ? titleStyle(_state) : titleStyle,
  ]);
  const _wrapped = (children?: React.ReactNode) => <ButtonText style={_style}>{children}</ButtonText>;

  const content = _.isEmpty(children) && !_.isEmpty(title)
    ? <Animated.Text selectable={false} style={_style}>{title}</Animated.Text>
    : _.isFunction(children) ? () => _wrapped(children(_state)) : _wrapped(children);

  return (
    <_AnimatedPressable
      ref={forwardRef}
      disabled={disabled}
      focusable={!disabled && focusable !== false}
      style={normalizeStyle([
        _.omit(colors, textStyleKeys),
        defaultStyle.button,
        Platform.select({
          web: { outline: 0 } as any,
          default: {},
        }),
        _.isFunction(style) ? style(_state) : style,
      ])}
      onPressIn={(e: GestureResponderEvent) => {
        setState(state => ({ ...state, pressed: true }));
        if (_.isFunction(onPressIn)) onPressIn(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setState(state => ({ ...state, pressed: false }));
        if (_.isFunction(onPressOut)) onPressOut(e);
      }}
      onHoverIn={(e) => {
        setState(state => ({ ...state, hovered: true }));
        if (_.isFunction(onHoverIn)) onHoverIn(e);
      }}
      onHoverOut={(e) => {
        setState(state => ({ ...state, hovered: false }));
        if (_.isFunction(onHoverOut)) onHoverOut(e);
      }}
      onFocus={(e) => {
        setState(state => ({ ...state, focused: true }));
        if (_.isFunction(onFocus)) onFocus(e);
      }}
      onBlur={(e) => {
        setState(state => ({ ...state, focused: false }));
        if (_.isFunction(onBlur)) onBlur(e);
      }}
      {...props}>
      {_.isFunction(prepend) ? prepend(_state) : prepend}
      {_.isFunction(content) ? content() : content}
      {_.isFunction(append) ? append(_state) : append}
    </_AnimatedPressable>
  );
}, {
  displayName: 'Button',
});

export default Button;