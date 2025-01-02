//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { Animated, Easing, Platform, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import { Modify } from '../../internals/types';
import { normalizeStyle } from '../Style/flatten';
import { _AnimatedPressable } from '../_Animated';
import { useFocus, useFocusRing } from '../../internals/focus';

type SwitchProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  classes?: ClassNames;
  selected?: boolean;
  tabIndex?: number;
  style?: StyleProp<ViewStyle> | ((state: { selected: boolean; focused: boolean; }) => StyleProp<ViewStyle>);
}>;

export const Switch = createMemoComponent((
  {
    classes,
    style,
    selected,
    tabIndex,
    onFocus,
    onBlur,
    children,
    ...props
  }: SwitchProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const theme = useTheme();
  const textStyle = _useComponentStyle('text') as TextStyle;

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const switchStyle = _useComponentStyle('switch', classes, [
    focused && 'focus',
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
  ]);

  const fontSize = textStyle.fontSize ?? theme.root.fontSize;
  const lineHeight = textStyle.lineHeight ?? theme.root.lineHeight;

  const size = _.isNumber(lineHeight) ? lineHeight * fontSize : fontSize;
  const animate = React.useRef(new Animated.Value(selected ? 1 : 0)).current;

  const focusRing = useFocusRing(focused);

  const _style = normalizeStyle([
    {
      width: size * 2,
      height: size,
      padding: theme.borderWidth,
      borderRadius: 0.5 * size,
      borderWidth: theme.borderWidth,
      opacity: props.disabled ? 0.65 : 1,
    },
    focusRing,
    switchStyle,
  ]);

  React.useEffect(() => {

    Animated.timing(animate, {
      toValue: selected ? 1 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

  }, [selected]);

  return (
    <_AnimatedPressable
      ref={forwardRef}
      style={normalizeStyle([
        _style,
        {
          backgroundColor: animate.interpolate({
            inputRange: [0, 1], outputRange: [theme.root.backgroundColor, theme.themeColors.primary]
          }),
          borderColor: animate.interpolate({
            inputRange: [0, 1], outputRange: [theme.grays['300'], theme.themeColors.primary]
          }),
        },
        _.isFunction(style) ? style({ selected: selected ?? false, focused }) : style,
      ])}
      {...Platform.select({
        web: { tabIndex: tabIndex ?? (props.disabled ? -1 : 0) } as any,
        default: {},
      })}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
    >
      <Animated.View
        style={{
          width: size - theme.borderWidth * 4,
          height: size - theme.borderWidth * 4,
          borderRadius: 0.5 * size - theme.borderWidth * 2,
          left: animate.interpolate({ inputRange: [0, 1], outputRange: [0, size] }),
          backgroundColor: animate.interpolate({
            inputRange: [0, 1], outputRange: [theme.grays['300'], 'white']
          }),
        }}
      />
    </_AnimatedPressable>
  )
}, {
  displayName: 'Switch'
});

export default Switch;