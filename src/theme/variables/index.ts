//
//  default.ts
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
import * as color_defaults from './colors';
import * as theme_color_defaults from './themeColors';
import * as root_defaults from './root';
import * as font_defaults from './font';
import * as border_defaults from './border';
import * as spacer_defaults from './spacer';
import * as breakpoint_defaults from './breakpoints';
import * as zindex_defaults from './zindex';
import * as animation_defaults from './animation';

export type ThemeColors = keyof typeof theme_color_defaults;

export const defaultVariables = {

  colors: color_defaults as Record<keyof typeof color_defaults, string> & Record<string, string>,
  themeColors: theme_color_defaults as Record<keyof typeof theme_color_defaults, string> & Record<string, string>,

  grays: {
    '100': '#f8f9fa',
    '200': '#e9ecef',
    '300': '#dee2e6',
    '400': '#ced4da',
    '500': '#adb5bd',
    '600': '#6c757d',
    '700': '#495057',
    '800': '#343a40',
    '900': '#212529',
  },

  colorWeights: {
    '100': -0.8,
    '200': -0.6,
    '300': -0.4,
    '400': -0.2,
    '500': 0,
    '600': 0.2,
    '700': 0.4,
    '800': 0.6,
    '900': 0.8,
  },

  root: root_defaults,

  minContrastRatio: 4.5,
  colorContrastDark: 'black',
  colorContrastLight: 'white',

  breakpoints: breakpoint_defaults as Record<string, number>,
  zIndex: zindex_defaults as Record<keyof typeof zindex_defaults, number> & Record<string, number>,

  ...font_defaults,
  ...border_defaults,
  ...spacer_defaults,
  ...animation_defaults,
}

export type ThemeVariables = typeof defaultVariables;
