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

export const fontSizes: Record<string, number | ((base: number) => number)> = {
  '1': base => base * 2.5,
  '2': base => base * 2,
  '3': base => base * 1.75,
  '4': base => base * 1.5,
  '5': base => base * 1.25,
  '6': base => base,
  'normal': base => base,
  'small': base => base * 0.875,
  'large': base => base * 1.25,
};

export const fontWeights: Record<string, FontWeight> = {
  light: '300',
  normal: '400',
  semibold: '600',
  bold: '700',
};

export const displayFontSizes: Record<string, number | ((base: number) => number)> = {
  '1': base => base * 5,
  '2': base => base * 4.5,
  '3': base => base * 4,
  '4': base => base * 3.5,
  '5': base => base * 3,
  '6': base => base * 2.5,
};

export const displayFontWeight: FontWeight = '300';