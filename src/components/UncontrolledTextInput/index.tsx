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
import { TextInputProps as RNTextInputProps } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames } from '../Style/types';
import TextInput from '../TextInput';

type TextInputProps = RNTextInputProps & {
  classes?: ClassNames;
};

export const UncontrolledTextInput = createMemoComponent(({
  classes,
  value,
  style,
  onChangeText,
  ...props
}: TextInputProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof TextInput>>) => {

  const [text, setText] = React.useState<string | null>(null);

  function submit() {
    onChangeText?.(text ?? '');
    setText(null);
  }

  return (
    <TextInput
      ref={forwardRef}
      value={text ?? value ?? ''}
      classes={classes}
      style={style}
      onFocus={() => setText(value ?? '')}
      onChangeText={setText}
      onBlur={() => submit()}
      onSubmitEditing={() => submit()}
      {...props} />
  );
}, {
  displayName: 'UncontrolledTextInput',
});

export default UncontrolledTextInput;