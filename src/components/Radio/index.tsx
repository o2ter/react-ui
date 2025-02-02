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
import { Platform, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import View from '../View';
import { Circle, Svg } from 'react-native-svg';
import { Modify } from '../../internals/types';
import { flattenStyle } from '../Style/flatten';
import { useFocus, useFocusRing } from '../../internals/focus';
import { ThemeColors } from '../../theme/variables';

type RadioState = {
  selected: boolean;
  focused: boolean;
};

type RadioProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  classes?: ClassNames;
  color?: ThemeColors | (string & {});
  innerColor?: ThemeColors | (string & {});
  selected?: boolean;
  tabIndex?: number;
  focusRingColor?: string;
  style?: StyleProp<ViewStyle> | ((state: RadioState) => StyleProp<ViewStyle>);
  children?: React.ReactNode | ((state: RadioState) => React.ReactNode);
}>;

export const Radio = createMemoComponent((
  {
    classes,
    color = 'primary',
    innerColor,
    style,
    selected,
    focusRingColor,
    tabIndex,
    onFocus,
    onBlur,
    children,
    ...props
  }: RadioProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const theme = useTheme();
  const textStyle = _useComponentStyle('text') as TextStyle;

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const radioStyle = _useComponentStyle('radio', classes, [
    focused && 'focus',
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
  ]);

  const fontSize = textStyle.fontSize ?? theme.root.fontSize;
  const lineHeight = textStyle.lineHeight ?? theme.root.lineHeight;

  const state = { selected: selected ?? false, focused };

  const innerStyle = [
    'width',
    'height',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'borderWidth',
    'borderTopWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderRadius',
    'borderTopLeftRadius',
    'borderBottomLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'opacity',
  ];
  const _style = flattenStyle([
    {
      flexDirection: 'row',
      gap: 0.5 * fontSize,
      width: fontSize,
      height: fontSize,
      borderRadius: 0.5 * fontSize,
      backgroundColor: selected ? theme.pickColor(color) : theme.root.backgroundColor,
      borderColor: selected ? theme.pickColor(color) : theme.grays['300'],
      borderWidth: theme.borderWidth,
      opacity: props.disabled ? 0.65 : 1,
    },
    Platform.select({
      web: { outline: 0 } as any,
      default: {},
    }),
    radioStyle,
    _.isFunction(style) ? style(state) : style,
  ]);

  const focusRing = useFocusRing(focused, focusRingColor ?? 'primary');

  return (
    <Pressable
      ref={forwardRef}
      style={_.omit(_style, ...innerStyle)}
      {...Platform.select({
        web: { tabIndex: tabIndex ?? (props.disabled ? -1 : 0) } as any,
        default: {},
      })}
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
    >
      <View style={[
        focusRing,
        _.pick(_style, ...innerStyle),
        { marginTop: _.isNumber(lineHeight) ? (lineHeight - 1) * 0.5 * fontSize : 0 }
      ]}>
        {selected && <Svg width='100%' height='100%' viewBox='-4 -4 8 8'>
          <Circle r='2' fill={innerColor ? theme.pickColor(innerColor) : theme.colorContrast(theme.pickColor(color))} />
        </Svg>}
      </View>
      {_.isFunction(children) ? children(state) : children}
    </Pressable>
  )
}, {
  displayName: 'Radio'
});

export default Radio;