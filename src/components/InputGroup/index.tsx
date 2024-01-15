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
import { createMemoComponent } from '../../internals/utils';
import View from '../View';
import Text from '../Text';
import { useTheme } from '../../theme';
import Button from '../Button';
import { DatePicker } from '../DateTime';
import TextInput from '../TextInput';
import Picker from '../Picker';
import Select from '../Select';
import { Form } from '../Form';
import { StyleProp, ViewStyle } from 'react-native';

type InputGroupItemProps = React.PropsWithChildren<{
  index: number;
  length: number;
}>;

const InputTypes = [
  Button,
  DatePicker,
  TextInput,
  Picker,
  Select,
  Form.Button,
  Form.Date,
  Form.Picker,
  Form.Select,
  Form.TextField,
];

const InputGroupItem = ({
  index,
  length,
  children: child
}: InputGroupItemProps) => {

  const theme = useTheme();

  const _inputStyle: ViewStyle = {
    display: 'flex',
    borderColor: theme.grays['400'],
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadiusBase,
    paddingVertical: theme.spacer * 0.375,
    paddingHorizontal: theme.spacer * 0.75,
  };
  const _style: StyleProp<ViewStyle> = [
    index > 0 && {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      marginLeft: -theme.borderWidth,
    },
    index + 1 < length && {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  ];

  if (React.isValidElement(child)) {

    const { type, props: { style, children, ...props } } = child;

    if (_.indexOf(InputTypes, type as any) !== -1) {
      return React.cloneElement(child, {
        style: [
          ..._style,
          style
        ],
        ...props
      }, ..._.castArray(children ?? []));
    }

    if (_.indexOf([View, Text], type as any) !== -1) {
      return React.cloneElement(child, {
        style: [
          _inputStyle,
          ..._style,
          style
        ],
        ...props
      }, ..._.castArray(children ?? []));
    }
  }

  return (
    <View
      style={[
        _inputStyle,
        ..._style,
      ]}
    >{child}</View>
  );
}

type InputGroupProps = React.ComponentPropsWithoutRef<typeof View>;

const flapMapChildren = (
  children: React.ReactNode
): React.ReactNode[] => _.flatten(React.Children.map(children, c => (
  React.isValidElement(c) && c.type === React.Fragment ?
    flapMapChildren(c.props.children) : c
)));

export const InputGroup = /*#__PURE__*/ createMemoComponent((
  {
    style,
    children,
    ...props
  }: InputGroupProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {
  const length = React.Children.count(children);
  return (
    <View
      ref={forwardRef}
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
        },
        style
      ]}
      {...props}
    >
      {React.Children.map(flapMapChildren(children), (child, i) => (
        <InputGroupItem index={i} length={length}>{child}</InputGroupItem>
      ))}
    </View>
  );
}, {
  displayName: 'InputGroup',
});

export default InputGroup;