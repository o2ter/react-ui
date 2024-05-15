//
//  types.ts
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
import { View } from '../View';
import { Modify } from '../../internals/types';
import { ViewUpdate } from '@codemirror/view';
import { EditorView } from '@codemirror/view';

export type CodeMirrorProps = Modify<React.ComponentPropsWithoutRef<typeof View>, {
  theme?: Parameters<typeof EditorView.theme>[0],
  darkMode?: boolean,
  initialValue?: string;
  autoFocus?: boolean;
  onChange?: (e: ViewUpdate) => void;
  onChangeValue?: (value: string) => void;
  onFocus?: (e: ViewUpdate) => void;
  onBlur?: (e: ViewUpdate) => void;
  onSelectionChange?: (e: ViewUpdate) => void;
  extensions?: any[];
  editable?: boolean;
  codeFolding?: boolean;
  lineNumbers?: boolean;
  allowMultipleSelections?: boolean;
  tabSize?: number;
  keymaps?: any[];
}>;
