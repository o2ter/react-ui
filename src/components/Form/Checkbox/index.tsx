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
import { Path, Svg } from 'react-native-svg';
import { Modify } from '../../../internals/types';
import { flattenStyle } from '../../index.web';

type FormCheckboxProps = Modify<React.ComponentPropsWithoutRef<typeof Pressable>, {
  name: string | string[];
  value?: string;
  tabIndex?: number;
  style?: StyleProp<ViewStyle> | ((state: { selected: boolean; }) => StyleProp<ViewStyle>);
  children: React.ReactNode | ((state: { selected: boolean; }) => React.ReactNode);
}>;

export const FormCheckbox = createComponent(({
  classes,
  name,
  value,
  style,
  onPress,
  children,
  ...props
}: FormCheckboxProps & { classes?: ClassNames }, forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>) => {

  const { value: state, onChange } = useField(name);
  const theme = useTheme();
  const formCheckboxStyle = useComponentStyle('formCheckbox', classes);

  const selected = _.isNil(value) ? !!state : _.isArray(state) && state.includes(value);

  const containerStyle = ['flexDirection', 'gap'];
  const _style = flattenStyle([
    {
      flexDirection: 'row',
      gap: 0.5 * theme.fontSizeBase,
      width: theme.fontSizeBase,
      height: theme.fontSizeBase,
      borderRadius: 0.25 * theme.fontSizeBase,
      backgroundColor: selected ? theme.styles.formCheckboxColor(selected) : theme.bodyBackground,
      borderColor: selected ? theme.styles.formCheckboxColor(selected) : theme.grays['300'],
      borderWidth: theme.borderWidth,
      opacity: props.disabled ? 0.65 : 1,
    },
    formCheckboxStyle,
    _.isFunction(style) ? style({ selected }) : style,
  ]);

  return (
    <Pressable
      ref={forwardRef}
      style={_.pick(_style, ...containerStyle)}
      onPress={onPress ?? (() => onChange((state: any) => {
        if (_.isNil(value)) return !state;
        return _.isArray(state) && state.includes(value) ? state.filter(x => x !== value) : [..._.castArray(state ?? []), value];
      }))}
      {...Platform.select({
        web: { tabIndex: props.tabIndex ?? (props.disabled ? -1 : 0) },
        default: {},
      })}
      {...props}
    >
      <View style={_.omit(_style, ...containerStyle)}>
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
      {_.isFunction(children) ? children({ selected }) : children}
    </Pressable >
  )
}, {
  displayName: 'Form.Checkbox'
});

export default FormCheckbox;