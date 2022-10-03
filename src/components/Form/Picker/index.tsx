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
import React, { ComponentPropsWithRef, ComponentRef } from 'react';
import { Platform } from 'react-native';
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Picker } from '../../Picker';
import { Modify } from '../../../internals/types';

type FormPickerProps = Modify<ComponentPropsWithRef<typeof Picker>, {
  name: string | string[];
}>

export default React.forwardRef<ComponentRef<typeof Picker>, FormPickerProps>(({
  name,
  style,
  children,
  ...props
}, forwardRef) => {

  const { value, error, onChange } = useField(name);
  const theme = useTheme();

  return (
    <Picker
      ref={forwardRef}
      value={value}
      onValueChange={onChange}
      style={[
        {
          fontSize: theme.fontSizeBase,
          backgroundColor: theme.colors.light,
          borderColor: theme.colors.light,
          borderWidth: theme.borderWidth,
          borderRadius: theme.borderRadius,
          margin: theme.spacer * 0.25,
        },
        Platform.select({
          ios: { padding: 4 },
          default: {}
        }),
        theme.styles.formPickerStyle,
        _.isEmpty(error) ? {} : { borderColor: theme.colors.danger },
        _.isEmpty(error) ? {} : theme.styles.formPickerErrorStyle,
        style,
      ]}
      {...props} />
  )
});
