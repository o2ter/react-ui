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

import { Icon } from '../../Icon';
import { createComponent } from '../../../internals/utils';
import { ClassNames, useComponentStyle } from '../../Style';

type FormCheckboxProps = TextProps & {
  name: string | string[];
  value?: string;
  tabIndex?: number;
}

export const FormCheckbox = createComponent(({
  classes,
  name,
  value,
  style,
  onPress,
  children,
  ...props
}: FormCheckboxProps & { classes?: ClassNames }, forwardRef: React.ForwardedRef<React.ComponentRef<typeof Icon>>) => {

  const { value: state, onChange } = useField(name);
  const theme = useTheme();
  const formCheckboxStyle = useComponentStyle('formCheckbox', classes);
  const formCheckboxTextStyle = useComponentStyle('formCheckboxText');

  const selected = _.isNil(value) ? !!state : _.isArray(state) && state.includes(value);
  const iconName = selected ? 'checkbox-marked' : 'checkbox-blank-outline';

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
      onPress={onPress ?? (() => onChange((state: any) => {
        if (_.isNil(value)) return !state;
        return _.isArray(state) && state.includes(value) ? state.filter(x => x !== value) : [..._.castArray(state ?? []), value];
      }))}
      iconStyle={[
        { color: theme.styles.formCheckboxColor(selected) },
        formCheckboxStyle,
      ]}
      style={[
        { fontSize: theme.fontSizeBase },
        formCheckboxTextStyle,
        _.isFunction(style) ? style({ selected }) : style,
      ]}
      {..._props}>{_.isFunction(children) ? children({ selected }) : children}</Icon>
  )
}, {
  displayName: 'Form.Checkbox'
});

export default FormCheckbox;