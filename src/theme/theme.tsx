//
//  theme.tsx
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
import React from 'react';
import { ThemePalette, _colorContrast } from './palette';
import { ThemeBaseContext, ThemeBaseProvider, ThemeProviderProps } from './provider/base';
import { shiftColor } from '../color';

const computedTheme = (
  base: React.ContextType<typeof ThemeBaseContext>
) => {
  let palette: ThemePalette;
  const computed = _.assign({
    get colorContrast() { return _colorContrast(computed); },
    get palette() {
      if (_.isNil(palette)) palette = base.palette(computed);
      return palette;
    },
    get _colors(): Record<string, string> {
      const colors = {
        ...computed.themeColors,
        ...computed.colors,
      };
      return {
        black: '#000000',
        white: '#ffffff',
        ...colors,
        ..._.fromPairs(_.flatMap(colors, (v, k) => _.map(computed.colorWeights, (s, w) => [`${k}-${w}`, shiftColor(v, s)]))),
        ..._.fromPairs(_.map(computed.grays, (c, w) => [`gray-${w}`, c])),
      };
    },
    get pickColor() {
      return (c: string) => {
        return computed._colors[c] ?? c;
      }
    },
  }, base.decoded);
  return computed;
}

const ThemeContext = React.createContext<ReturnType<typeof computedTheme> | undefined>(undefined);

const _ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const base = React.useContext(ThemeBaseContext);
  const values = React.useMemo(() => computedTheme(base), [base]);
  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({
  variables, palette, children
}) => (
  <ThemeBaseProvider variables={variables} palette={palette}>
    <_ThemeProvider>{children}</_ThemeProvider>
  </ThemeBaseProvider>
);

ThemeProvider.displayName = 'ThemeProvider';

export const useTheme = () => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw Error('No theme values available. Make sure you are rendering `<ThemeProvider>` at the top of your app.');
  return theme;
};
