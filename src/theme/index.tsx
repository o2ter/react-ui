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
import { defaultStyle, ThemeStyles, ThemeStylesProvider, _colorContrast } from './styles';
import { useWindowDimensions, ScaledSize } from 'react-native';
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

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({
  variables,
  styles,
  children
}) => {

  const parent = React.useContext(ThemeContext);
  const _variables = useEquivalent(_.isFunction(variables) ? variables(parent.variables) : variables);
  const value: React.ContextType<typeof ThemeContext> = React.useMemo(() => ({
    variables: _.assign({}, parent.variables, _variables, {
      root: _.assign({}, parent.variables.root, _variables?.root),
      grays: _.assign({}, parent.variables.grays, _variables?.grays),
      colorWeights: _.assign({}, parent.variables.colorWeights, _variables?.colorWeights),
      themeColors: _.assign({}, parent.variables.themeColors, _variables?.themeColors),
      zIndex: _.assign({}, parent.variables.zIndex, _variables?.zIndex),
    }),
    styles: (theme) => {
      const parent_style = parent.styles(theme);
      const current_style = styles?.(theme) ?? {};
      return _.mapValues(parent_style, (v, k) => current_style[k as keyof ThemeStyles] ?? v) as ThemeStyles;
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

const decodeVariables = (variables: typeof defaultVariables) => {

  const {
    root,
    fontSizes: _fontSizes,
    displayFontSizes: _displayFontSizes,
    spacer: _spacer,
    spacers: _spacers,
    borderWidth: _borderWidth,
    borderWidths: _borderWidths,
    borderRadiusBase: _borderRadiusBase,
    borderRadius: _borderRadius,
    ...remains
  } = variables;

  const spacer = _.isFunction(_spacer) ? _spacer(root.fontSize) : _spacer;
  const borderWidth = _.isFunction(_borderWidth) ? _borderWidth(root.fontSize) : _borderWidth;
  const borderRadiusBase = _.isFunction(_borderRadiusBase) ? _borderRadiusBase(root.fontSize) : _borderRadiusBase;

  return {
    ...remains,
    root,
    spacer,
    borderWidth,
    borderRadiusBase,
    fontSizes: _.mapValues(_fontSizes, v => _.isFunction(v) ? v(root.fontSize) : v),
    displayFontSizes: _.mapValues(_displayFontSizes, v => _.isFunction(v) ? v(root.fontSize) : v),
    spacers: _.mapValues(_spacers, v => _.isFunction(v) ? v(spacer) : v),
    borderWidths: _.mapValues(_borderWidths, v => _.isFunction(v) ? v(borderWidth) : v),
    borderRadius: _.mapValues(_borderRadius, v => _.isFunction(v) ? v(borderRadiusBase) : v),
  };
}

export const useThemeVariables = () => {
  const { variables } = React.useContext(ThemeContext);
  return React.useMemo(() => decodeVariables(variables), [variables]);
}

export const useTheme = () => {

  const { variables, styles } = React.useContext(ThemeContext);
  const windowDimensions = useWindowDimensions();

  return React.useMemo(() => {

    let computed_style: ThemeStyles;

    const computed = _.assign({
      get colorContrast() { return _colorContrast(computed) },
      get mediaSelect() { return _mediaSelect(computed, windowDimensions) },
      get styles() {
        if (_.isNil(computed_style)) computed_style = styles(computed);
        return computed_style;
      },
    }, decodeVariables(variables));

    return computed;

  }, [variables, styles, windowDimensions]);
}
