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
import React, { ComponentRef } from 'react';
import { Pressable, Text, TextProps } from 'react-native';
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';

import { MaterialCommunityIcons as Icon } from '../../Icons';

type FormCheckboxProps = Modify<TextProps, {
  name: string | string[];
  value?: string
}>

export default React.forwardRef<ComponentRef<typeof Pressable>, FormCheckboxProps>(({
  name,
  value,
  style,
  onPress,
  children,
  ...props
}, forwardRef) => {

  const { value: state, onChange } = useField(name);
  const theme = useTheme();

  const selected = !_.isNil(value) && _.isArray(state) ? state.includes(value) : !!state;
  const iconName = value ? 'checkbox-marked' : 'checkbox-blank-outline';

  return (
    <Pressable ref={forwardRef} onPress={onPress ?? (() => onChange((state: any) => {
      if (_.isArray(state)) {
        return state.includes(value) ? state.filter(x => x !== value) : [...state, value];
      }
      return !value;
    }))}>
      <Text style={[
        { fontSize: theme.fontSizeBase },
        theme.styles.formCheckboxStyle,
        style,
      ]}>
        <Icon name={iconName} color={theme.styles.formCheckboxColor(selected)} {...props} />
      </Text>
    </Pressable>
  )
});
