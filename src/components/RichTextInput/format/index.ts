//
//  format.ts
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
import { bbcode2delta } from './bbcode/bbcode2delta';
import { delta2bbcode } from './bbcode/delta2bbcode';
import { Line } from './types';

export const defaultFormat = {
  'raw': {
    encoder: (lines: Line[]) => lines,
    decoder: (lines: Line[]) => lines,
  },
  'bbcode': {
    encoder: delta2bbcode,
    decoder: bbcode2delta,
  },
} as const;

type ToolbarOptions = {
  baseFontSize: number;
  fontSizes: number[];
};

export const defaultFormatOptions = {
  'raw': {
    modules: {
      toolbar: (options: ToolbarOptions) => [
        [{ 'font': [] }],
        [{ 'size': _.map(options.fontSizes, x => x === options.baseFontSize ? false : `${x}px`) }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'strike', 'underline'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      ],
    }
  },
  'bbcode': {
    modules: {
      toolbar: (options: ToolbarOptions) => [
        [{ 'font': [] }],
        [{ 'size': _.map(options.fontSizes, x => x === options.baseFontSize ? false : `${x}px`) }],
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'strike', 'underline'],
        ['link', 'image'],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ],
    }
  },
} as const;
