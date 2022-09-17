//
//  default.ts
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

import * as color_defaults from './colors';
import * as font_defaults from './font';
import * as border_defaults from './border';

export const defaultTheme = {

  colors: color_defaults as { [key: string]: string },
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

  minContrastRatio: 4.5,
  colorContrastDark: 'black',
  colorContrastLight: 'white',

  spacer: 16,

  ...font_defaults,
  ...border_defaults,
}

export type ThemeType = Partial<typeof defaultTheme>;
