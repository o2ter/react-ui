//
//  index.server.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { View } from '../View';
import { useMergeRefs } from 'sugax';
import { createMemoComponent } from '../../internals/utils';
import { CodeMirrorProps } from './types';

export const CodeMirror = createMemoComponent((
  {
    theme,
    darkMode = false,
    initialValue,
    autoFocus,
    onChange,
    onChangeValue,
    onFocus,
    onBlur,
    onSelectionChange,
    extensions = [],
    editable = true,
    codeFolding = false,
    lineNumbers = false,
    allowMultipleSelections = true,
    tabSize = 4,
    keymaps = [],
    ...props
  }: CodeMirrorProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {

  const containerRef = React.useRef<React.ComponentRef<typeof View>>();
  const ref = useMergeRefs(containerRef, forwardRef);

  return <View ref={ref} {...props} />;
}, {
  displayName: 'CodeMirror',
});

export default CodeMirror;