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
import { ColorType, colorContrast, shiftColor, shadeColor, tintColor } from '../../color';
import { _hex } from '../../internals/color';

const memoize = <T extends (...args: any) => any>(func: T): T => _.memoize(func);

export const _colorContrast = (theme: ThemeVariables) => (background: string | ColorType) => colorContrast(
  background,
  theme.colorContrastDark,
  theme.colorContrastLight,
  theme.minContrastRatio
);

export const defaultPalette = (
  theme: ThemeVariables & { colorContrast: ReturnType<typeof _colorContrast> }
) => ({

  buttonColors: memoize((color: string) => ({
    color: theme.colorContrast(color),
    backgroundColor: color,
    borderColor: color,
  })),

  buttonFocusedColors: memoize((color: string) => {
    const _color = theme.colorContrast(color);
    const _color2 = _color === _hex(theme.colorContrastLight) ? shadeColor(color, 0.2) : tintColor(color, 0.2);
    return ({
      color: _color,
      backgroundColor: _color2,
      borderColor: _color2,
    });
  }),

  toastColors: memoize((color: string) => ({
    color: theme.themeColors[color] ?? theme.colors[color] ?? color,
    borderColor: theme.themeColors[color] ?? theme.colors[color] ?? color,
    messageColor: shiftColor(theme.themeColors[color] ?? theme.colors[color] ?? color, theme.colorWeights[800]),
    backgroundColor: shiftColor(theme.themeColors[color] ?? theme.colors[color] ?? color, theme.colorWeights[100]),
  })),

});

export interface ThemePalette extends ReturnType<typeof defaultPalette> {}
export type ThemePaletteProvider = (...theme: Parameters<typeof defaultPalette>) => Partial<ThemePalette>;
