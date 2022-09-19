//
//  index.ts
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

import _ from 'lodash';
import { ColorType, Color, _hex } from '../internals/color';

export { ColorType };

export function mixColor(
  color1: string | ColorType,
  color2: string | ColorType,
  weight: number
) {
  const c1 = new Color(color1);
  const c2 = new Color(color2);
  const result = c2.add(c1.subtract(c2).multiply(weight));
  return result.hex;
}

export function tintColor(
  color: string | ColorType,
  weight: number
) {
  return mixColor('#ffffff', color, weight);
}

export function shadeColor(
  color: string | ColorType,
  weight: number
) {
  return mixColor('#000000', color, weight);
}

export function shiftColor(
  color: string | ColorType,
  weight: number
) {
  return weight > 0 ? shadeColor(color, weight) : tintColor(color, -weight);
}

export function luminance(color: string | ColorType) {
  const c = new Color(color);
  const { r, g, b } = c.divide(255);
  const _r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const _g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const _b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * _r + 0.7152 * _g + 0.0722 * _b;
}

export function contrastRatio(
  background: string | ColorType,
  foreground: string | ColorType
) {
  const l1 = luminance(background);
  const l2 = luminance(foreground);
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

export function colorContrast(
  background: string | ColorType,
  colorContrastDark: string | ColorType,
  colorContrastLight: string | ColorType,
  minContrastRatio: number
) {

  let maxRatio = 0;
  let maxRatioColor;

  const foregrounds = [colorContrastLight, colorContrastDark, '#ffffff', '#000000'];
  for (const color of foregrounds) {
    const _contrastRatio = contrastRatio(background, color);
    if (_contrastRatio > minContrastRatio) {
      return _hex(color);
    } else if (_contrastRatio > maxRatio) {
      maxRatio = _contrastRatio;
      maxRatioColor = color;
    }
  }
  
  return _hex(maxRatioColor ?? background);
}

export function transparent(
  color: string | ColorType,
  opacity: number
) {
  const { r, g, b } = new Color(color);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
