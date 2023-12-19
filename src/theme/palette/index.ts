//
//  styles.ts
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
import { ThemeVariables } from '../variables';
import { ColorType, colorContrast, shiftColor, shadeColor, tintColor, transparent, mixColor } from '../../color';
import { _hex } from '../../internals/color';

const memoize = <T extends (...args: any) => any>(func: T): T => _.memoize(func);

export const _colorContrast = (theme: ThemeVariables) => (background: string | ColorType) => colorContrast(
  background,
  theme.colorContrastDark,
  theme.colorContrastLight,
  theme.minContrastRatio
);

export const defaultPalette = (
  theme: ThemeVariables & {
    colorContrast: ReturnType<typeof _colorContrast>;
    pickColor: (c: string) => string;
  }
) => ({

  buttonColors: memoize((color: string) => {
    const _color = theme.colorContrast(color);
    return {
      solid: {
        color: _color,
        backgroundColor: color,
        borderColor: color,
      },
      subtle: {
        color: _color,
        backgroundColor: mixColor(color, _color, 0.4),
        borderColor: mixColor(color, _color, 0.4),
      },
      outline: {
        color: color,
        backgroundColor: transparent(color, 0),
        borderColor: color,
      },
      link: {
        color: color,
      },
      ghost: {
        color: color,
        backgroundColor: transparent(color, 0),
      },
      unstyled: {
        color: color,
      },
    };
  }),

  buttonFocusedColors: memoize((color: string) => {
    const _color = theme.colorContrast(color);
    const _color2 = _color === _hex(theme.colorContrastLight) ? shadeColor(color, 0.2) : tintColor(color, 0.2);
    return {
      solid: {
        color: _color,
        backgroundColor: _color2,
        borderColor: _color2,
      },
      subtle: {
        color: _color,
        backgroundColor: mixColor(color, _color, 0.6),
        borderColor: mixColor(color, _color, 0.6),
      },
      outline: {
        color: _color,
        backgroundColor: color,
        borderColor: color,
      },
      link: {
        color: color,
      },
      ghost: {
        color: color,
        backgroundColor: transparent(color, 0.5),
      },
      unstyled: {
        color: color,
      },
    };
  }),

  alertColors: memoize((color: string) => ({
    color: theme.pickColor(color),
    borderColor: theme.pickColor(color),
    messageColor: shiftColor(theme.pickColor(color), theme.colorWeights[800]),
    backgroundColor: shiftColor(theme.pickColor(color), theme.colorWeights[100]),
  })),

});

export interface ThemePalette extends ReturnType<typeof defaultPalette> {}
export type ThemePaletteProvider = (...theme: Parameters<typeof defaultPalette>) => Partial<ThemePalette>;
