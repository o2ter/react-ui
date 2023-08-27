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
import { Platform, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

import { createComponent } from '../../internals/utils';
import { ClassNames, useComponentStyle } from '../Style';
import View from '../View';
import { Path, Svg } from 'react-native-svg';
import { Modify } from '../../internals/types';
import { flattenStyle } from '../Style/flatten';

type CheckboxProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  selected?: boolean;
  tabIndex?: number;
  style?: StyleProp<ViewStyle> | ((state: { selected: boolean; }) => StyleProp<ViewStyle>);
  children: React.ReactNode | ((state: { selected: boolean; }) => React.ReactNode);
}>;

export const Checkbox = createComponent((
  {
    classes,
    style,
    selected,
    children,
    ...props
  }: CheckboxProps & { classes?: ClassNames },
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const theme = useTheme();
  const textStyle = useComponentStyle('text') as TextStyle;
  const checkboxStyle = useComponentStyle('checkbox', classes, [
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
  ]);

  const fontSize = textStyle.fontSize ?? theme.root.fontSize;
  const lineHeight = textStyle.lineHeight ?? theme.root.lineHeight;

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
      borderRadius: 0.25 * fontSize,
      backgroundColor: selected ? theme.styles.checkboxColor(selected ?? false) : theme.root.backgroundColor,
      borderColor: selected ? theme.styles.checkboxColor(selected ?? false) : theme.grays['300'],
      borderWidth: theme.borderWidth,
      opacity: props.disabled ? 0.65 : 1,
    },
    checkboxStyle,
    _.isFunction(style) ? style({ selected: selected ?? false }) : style,
  ]);

  return (
    <Pressable
      ref={forwardRef}
      style={_.omit(_style, ...innerStyle)}
      {...Platform.select({
        web: { tabIndex: props.tabIndex ?? (props.disabled ? -1 : 0) },
        default: {},
      })}
      {...props}
    >
      <View style={[
        _.pick(_style, ...innerStyle),
        { marginTop: _.isNumber(lineHeight) ? (lineHeight - 1) * 0.5 * fontSize : 0 }
      ]}>
        {selected && <Svg width='100%' height='100%' viewBox='0 0 20 20'>
          <Path
            fill='none'
            stroke='white'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m6 10 3 3 6-6'
          />
        </Svg>}
      </View>
      {_.isFunction(children) ? children({ selected: selected ?? false }) : children}
    </Pressable>
  )
}, {
  displayName: 'Checkbox'
});

export default Checkbox;