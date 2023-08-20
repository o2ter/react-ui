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
import { TextProps, Platform } from 'react-native';
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';

import { Icon } from '../../Icon';
import { createComponent } from '../../../internals/utils';

type FormRadioProps = TextProps & {
  name: string | string[];
  value: any;
  tabIndex?: number;
}

export const FormRadio = createComponent(({
  name,
  value,
  style,
  onPress,
  children,
  ...props
}: FormRadioProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof Icon>>) => {

  const { value: _value, onChange } = useField(name);
  const theme = useTheme();

  const selected = value === _value;
  const iconName = selected ? 'radiobox-marked' : 'radiobox-blank';

  const _props = Platform.select({
    web: {
      ...props,
      tabIndex: props.tabIndex ?? (props.disabled ? -1 : 0),
    },
    default: props,
  });
  
  return (
    <Icon
      ref={forwardRef}
      icon='MaterialCommunityIcons'
      name={iconName}
      onPress={onPress ?? (() => onChange(value))}
      iconStyle={[
        { color: theme.styles.formRadioColor(selected) },
        theme.styles.formRadioStyle,
      ]}
      style={[
        { fontSize: theme.fontSizeBase },
        theme.styles.formRadioTextStyle,
        _.isFunction(style) ? style({ selected }) : style,
      ]}
      {..._props}>{_.isFunction(children) ? children({ selected }) : children}</Icon>
  )
}, {
  displayName: 'Form.Radio'
});

export default FormRadio;