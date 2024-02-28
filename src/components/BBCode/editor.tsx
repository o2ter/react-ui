//
//  editor.tsx
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
import { bbcode2delta } from './parser/bbcode2delta';
import { delta2bbcode } from './parser/delta2bbcode';
import { RichTextInput } from '../RichTextInput';
import { createMemoComponent } from '../../internals/utils';

const defaultToolbar = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }],
  [{ 'align': [] }],
  ['bold', 'italic', 'strike', 'underline'],
  ['link', 'image'],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
] as const;

type BBCodeEditorProps = Omit<React.ComponentPropsWithoutRef<typeof RichTextInput>, 'value' | 'onChangeText'> & {
  value?: string;
  onChangeText?: (text: string) => void;
}

export const BBCodeEditor = createMemoComponent((
  {
    value,
    onChangeText,
    options = {},
    ...props
  }: BBCodeEditorProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RichTextInput>>
) => {
  const _value = React.useMemo(() => bbcode2delta(value ?? ''), [value]);
  return (
    <RichTextInput
      ref={forwardRef}
      value={_value}
      onChangeText={(delta) => {
        if (_.isFunction(onChangeText)) onChangeText(delta2bbcode(delta));
      }}
      options={{
        theme: 'snow',
        ...options,
        modules: {
          toolbar: defaultToolbar,
          ...options.modules ?? {},
        },
      }}
      {...props}
    />
  );
}, {
  displayName: 'BBCodeEditor',
})
