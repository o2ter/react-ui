//
//  border.ts
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

export const borderWidth: number | ((rem: number) => number) = 1;
export const borderWidths: Record<string, number | ((base: number) => number)> = {
  '1': base => base,
  '2': base => base * 2,
  '3': base => base * 3,
  '4': base => base * 4,
  '5': base => base * 5,
};

export const borderRadiusBase: number | ((rem: number) => number) = rem => rem * 0.375;
export const borderRadius: Record<string, number | ((base: number) => number)> = {
  '1': base => base * 2 / 3,
  '2': base => base * 4 / 3,
  '3': base => base * 8 / 3,
  '4': base => base * 16 / 3,
  '5': base => base * 32 / 3,
};
