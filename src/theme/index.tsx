//
//  index.ts
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
import React from 'react';
import { defaultVariables, ThemeVariables } from './variables';
import { defaultStyle, _simpleStyles, ThemeStyles, ThemeStylesProvider, _colorContrast } from './styles';
import { useWindowDimensions, ScaledSize, StyleSheet } from 'react-native';
import { useEquivalent } from 'sugax';
import { PrevState } from '../internals/types';

export {
  ThemeVariables,
  ThemeStyles,
  ThemeStylesProvider,
};

type ThemeProviderProps = {
  variables?: PrevState<Partial<ThemeVariables>>;
  styles?: ThemeStylesProvider;
}

const ThemeContext = React.createContext({
  variables: defaultVariables,
  styles: defaultStyle,
});

ThemeContext.displayName = 'ThemeContext';

type _simpleStylesKeys = keyof typeof _simpleStyles;

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({
  variables,
  styles,
  children
}) => {

  const parent = React.useContext(ThemeContext);
  const _variables = useEquivalent(_.isFunction(variables) ? variables(parent.variables) : variables);
  const value: React.ContextType<typeof ThemeContext> = React.useMemo(() => ({
    variables: _.assign({}, parent.variables, _variables, {
      colors: _.assign({}, parent.variables.colors, _variables?.colors),
      themeColors: _.assign({}, parent.variables.themeColors, _variables?.themeColors),
    }),
    styles: (theme) => {
      const parent_style = parent.styles(theme);
      const current_style = styles?.(theme) ?? {};
      return {
        ...parent_style,
        ...current_style,
        ..._.mapValues(_simpleStyles, (_v, k) => StyleSheet.flatten([
          parent_style[k as _simpleStylesKeys],
          current_style[k as _simpleStylesKeys],
        ].filter(Boolean))),
      };
    },
  }), [parent, _variables, styles]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.displayName = 'ThemeProvider';

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
        if (_.isNil(computed_style)) {
          const _computed_style = styles(computed);
          const _picked = _.pick(_computed_style, _.keys(_simpleStyles) as _simpleStylesKeys[]);
          computed_style = { ..._computed_style, ...StyleSheet.create(_.mapValues(_picked, x => StyleSheet.flatten(x))) };
        }
        return computed_style;
      },
    }, variables);

    return computed;

  }, [variables, styles, windowDimensions]);
}
