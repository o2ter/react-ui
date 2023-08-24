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
import { useField } from '../Form';
import { useTheme } from '../../../theme';

import { createComponent } from '../../../internals/utils';
import { ClassNames, useComponentStyle } from '../../Style';
import View from '../../View';
import { Circle, Svg } from 'react-native-svg';
import { Modify } from '../../../internals/types';

type FormRadioProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  name: string | string[];
  value: any;
  tabIndex?: number;
  style?: StyleProp<ViewStyle> | ((state: { selected: boolean; }) => StyleProp<ViewStyle>);
  children: React.ReactNode | ((state: { selected: boolean; }) => React.ReactNode);
}>;

export const FormRadio = createComponent(({
  classes,
  name,
  value,
  style,
  onPress,
  children,
  ...props
}: FormRadioProps & { classes?: ClassNames }, forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>) => {

  const { value: _value, onChange } = useField(name);
  const theme = useTheme();
  const formRadioStyle = useComponentStyle('formRadio', classes);

  const selected = value === _value;

  return (
    <Pressable
      ref={forwardRef}
      style={{
        flexDirection: 'row',
        gap: 0.5 * theme.fontSizeBase,
      }}
      onPress={onPress ?? (() => onChange(value))}
      {...Platform.select({
        web: { tabIndex: props.tabIndex ?? (props.disabled ? -1 : 0) },
        default: {},
      })}
      {...props}
    >
      <View style={[
        {
          width: theme.fontSizeBase,
          height: theme.fontSizeBase,
          borderRadius: 0.5 * theme.fontSizeBase,
          backgroundColor: selected ? theme.styles.formRadioColor(selected) : theme.bodyBackground,
          borderColor: selected ? theme.styles.formRadioColor(selected) : theme.grays['300'],
          borderWidth: theme.borderWidth,
          opacity: props.disabled ? 0.65 : 1,
        },
        formRadioStyle,
        _.isFunction(style) ? style({ selected }) : style,
      ]}>
        {selected && <Svg width='100%' height='100%' viewBox='-4 -4 8 8'>
          <Circle r='2' fill='white' />
        </Svg>}
      </View>
      {_.isFunction(children) ? children({ selected }) : children}
    </Pressable >
  )
}, {
  displayName: 'Form.Radio'
});

export default FormRadio;