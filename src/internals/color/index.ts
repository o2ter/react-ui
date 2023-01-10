//
//  index.tsx
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

import _ from 'lodash';
import normalizeColor from 'normalize-css-color';

function _component_hex(c: number) {
  const hex = _.clamp(_.round(c), 0, 255).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

export interface ColorType {
  r: number;
  g: number;
  b: number;
}

export class Color implements ColorType {

  r: number;
  g: number;
  b: number;

  constructor(color: string | ColorType) {

    if (_.isString(color)) {
      const colorInt = normalizeColor(color);
      color = normalizeColor.rgba(colorInt) as ColorType;
    }

    const { r, g, b } = color ?? {};

    if (!_.isFinite(r) || !_.isFinite(g) || !_.isFinite(b))
      throw new Error('Unknown color object.');

    this.r = r;
    this.g = g;
    this.b = b;
  }

  get hex() {
    return "#" + _component_hex(this.r) + _component_hex(this.g) + _component_hex(this.b);
  }

  combine(other: number | ColorType, operand: (arg0: number, arg1: number) => number) {

    if (_.isNumber(other) && _.isFinite(other)) {

      return new Color({
        r: operand(this.r, other),
        g: operand(this.g, other),
        b: operand(this.b, other),
      });
    }

    other = other as ColorType;

    return new Color({
      r: operand(this.r, other.r),
      g: operand(this.g, other.g),
      b: operand(this.b, other.b),
    });
  }

  add(other: number | ColorType) {
    return this.combine(other, (a, b) => a + b);
  }

  subtract(other: number | ColorType) {
    return this.combine(other, (a, b) => a - b);
  }

  multiply(other: number | ColorType) {
    return this.combine(other, (a, b) => a * b);
  }

  divide(other: number | ColorType) {
    return this.combine(other, (a, b) => a / b);
  }
}

export const _hex = (color: string | ColorType) => new Color(color).hex
