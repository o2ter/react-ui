//
//  font.ts
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

export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export const fontSizeBase: number = 16;

export const fontSizes: Record<string, number> = {
  '1': fontSizeBase * 2.5,
  '2': fontSizeBase * 2,
  '3': fontSizeBase * 1.75,
  '4': fontSizeBase * 1.5,
  '5': fontSizeBase * 1.25,
  '6': fontSizeBase,
  'normal': fontSizeBase,
  'small': fontSizeBase * 0.875,
  'large': fontSizeBase * 1.25,
};

export const fontWeightBase: FontWeight = '400';
export const fontWeights: Record<string, FontWeight> = {
  light: '300',
  normal: '400',
  semibold: '600',
  bold: '700',
};

export const displayFontSizes: Record<string, number> = {
  '1': fontSizeBase * 5,
  '2': fontSizeBase * 4.5,
  '3': fontSizeBase * 4,
  '4': fontSizeBase * 3.5,
  '5': fontSizeBase * 3,
  '6': fontSizeBase * 2.5,
};

export const displayFontWeightBase: FontWeight = '300';