//
//  types.ts
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

import React from 'react';
import type Quill from 'quill';
import type { Line } from '../format/types';
import type { QuillOptions } from 'quill';
import { OverloadParameters } from '@o2ter/utils-js';

export type TextChangeHandler = Extract<OverloadParameters<Quill['on']>, ['text-change', any]>[1];
export type SelectionChangeHandler = Extract<OverloadParameters<Quill['on']>, ['selection-change', any]>[1];

export type RichTextInputProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: Line[];
  options?: QuillOptions;
  onUploadImage?: (blob: Blob) => PromiseLike<string>;
  onChangeText?: (value: Line[], ...arg: [...Parameters<TextChangeHandler>, quill: Quill]) => void;
  onChangeSelection?: (...arg: [...Parameters<SelectionChangeHandler>, quill: Quill]) => void;
};

export type RichTextInputRef = {
  value?: Line[];
  editor?: Quill;
  container?: HTMLDivElement;
  assets: string[];
  replaceAssets(assets: Record<string, string>): void;
};
