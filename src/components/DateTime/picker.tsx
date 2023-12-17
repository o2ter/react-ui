//
//  picker.tsx
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
import { Pressable, Platform } from 'react-native';
import { Modify } from '../../internals/types';
import { useModal } from '../Modal';
import { useTheme } from '../../theme';
import View from '../View';
import Text from '../Text';

type PickerBaseProps = Modify<React.ComponentPropsWithoutRef<typeof Text> & Pick<React.ComponentPropsWithoutRef<typeof Pressable>, 'onFocus' | 'onBlur'>, {
  picker?: any;
  disabled?: boolean;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}>

export const PickerBase = React.forwardRef<React.ComponentRef<typeof Pressable>, PickerBaseProps>(({
  style,
  picker,
  disabled,
  onFocus,
  onBlur,
  prepend,
  append,
  children,
  ...props
}, forwardRef) => {

  const showModal = useModal();
  const theme = useTheme();

  return (
    <Pressable
      ref={forwardRef}
      onPress={() => { if (!disabled) showModal(picker) }}
      style={Platform.select({
        web: { outline: 0 } as any,
        default: {},
      })}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {_.isString(children) ? (
        <View style={[{
          flexDirection: 'row',
          gap: theme.spacer * 0.375,
        }, style]}>
          {prepend}
          <Text style={{ flex: 1 }} {...props}>{_.isEmpty(children) ? ' ' : children}</Text>
          {append}
        </View>
      ) : children}
    </Pressable>
  )
});
