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
import React from 'react';

import { defaultVariables, ThemeVariables } from './variables';
import { defaultStyle, ThemeStyles, ThemeStylesProvider, _colorContrast } from './styles';
import { useWindowDimensions, ScaledSize } from 'react-native';

export {
  ThemeVariables,
  ThemeStyles,
  ThemeStylesProvider,
};

type ThemeProviderProps = {
  variables?: Partial<ThemeVariables>;
  styles?: ThemeStylesProvider;
}

const ThemeContext = React.createContext<ThemeProviderProps>({
  variables: defaultVariables,
  styles: defaultStyle,
});

export const ThemeProvider = ({
  variables,
  styles,
  children
}: React.PropsWithChildren<ThemeProviderProps>) => {

  const value = React.useMemo(() => ({ variables, styles }), [variables, styles]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const _mediaSelect = (theme: ThemeVariables, windowDimensions: ScaledSize) => <T extends any>(
  breakpoint: string,
  selector: { up: T, down: T }
) => {
  return windowDimensions.width < theme.breakpoints[breakpoint] ? selector.down : selector.up;
}

export function useTheme() {

  const { variables, styles } = React.useContext(ThemeContext);
  const windowDimensions = useWindowDimensions();

  return React.useMemo(() => {

    let computed_style: ThemeStyles;

    const computed = _.assign({
      get colorContrast() { return _colorContrast(computed) },
      get mediaSelect() { return _mediaSelect(computed, windowDimensions) },
      get styles() {
        if (_.isNil(computed_style)) computed_style = _.assign({}, defaultStyle(computed), styles?.(computed));
        return computed_style;
      },
    }, defaultVariables, variables);

    return computed;

  }, [variables, styles, windowDimensions]);
}
