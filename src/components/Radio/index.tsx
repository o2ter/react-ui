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
import { Platform, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

import { createComponent } from '../../internals/utils';
import { ClassNames, useComponentStyle } from '../Style';
import View from '../View';
import { Circle, Svg } from 'react-native-svg';
import { Modify } from '../../internals/types';
import { flattenStyle } from '../index.web';

type RadioProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  selected?: boolean;
  tabIndex?: number;
  style?: StyleProp<ViewStyle> | ((state: { selected: boolean; }) => StyleProp<ViewStyle>);
  children: React.ReactNode | ((state: { selected: boolean; }) => React.ReactNode);
}>;

export const Radio = createComponent(({
  classes,
  style,
  selected,
  children,
  ...props
}: RadioProps & { classes?: ClassNames }, forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>) => {

  const theme = useTheme();
  const radioStyle = useComponentStyle('radio', classes, [
    selected && 'checked',
    props.disabled ? 'disabled' : 'enabled',
  ]);

  const innerStyle = [
    'width',
    'height',
    'borderRadius',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'opacity',
  ];
  const _style = flattenStyle([
    {
      flexDirection: 'row',
      gap: 0.5 * theme.fontSizeBase,
      width: theme.fontSizeBase,
      height: theme.fontSizeBase,
      borderRadius: 0.5 * theme.fontSizeBase,
      backgroundColor: selected ? theme.styles.radioColor(selected) : theme.bodyBackground,
      borderColor: selected ? theme.styles.radioColor(selected) : theme.grays['300'],
      borderWidth: theme.borderWidth,
      opacity: props.disabled ? 0.65 : 1,
    },
    radioStyle,
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
      <View style={_.pick(_style, ...innerStyle)}>
        {selected && <Svg width='100%' height='100%' viewBox='-4 -4 8 8'>
          <Circle r='2' fill='white' />
        </Svg>}
      </View>
      {_.isFunction(children) ? children({ selected: selected ?? false }) : children}
    </Pressable>
  )
}, {
  displayName: 'Radio'
});

export default Radio;