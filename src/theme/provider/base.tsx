//
//  base.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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
import { defaultVariables, ThemeVariables } from '../variables';
import { defaultPalette, ThemePalette, ThemePaletteProvider, _colorContrast } from '../palette';
import { useEquivalent } from 'sugax';
import { PrevState } from '../../internals/types';

export type ThemeProviderProps = {
  variables?: PrevState<Partial<ThemeVariables>>;
  palette?: ThemePaletteProvider;
}

const decodeVariables = (variables: typeof defaultVariables) => {

  const {
    root,
    fontSizes: _fontSizes,
    headerFontSizes: _headerFontSizes,
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
    headerFontSizes: _.mapValues(_headerFontSizes, v => _.isFunction(v) ? v(root.fontSize) : v),
    displayFontSizes: _.mapValues(_displayFontSizes, v => _.isFunction(v) ? v(root.fontSize) : v),
    spacers: _.mapValues(_spacers, v => _.isFunction(v) ? v(spacer) : v),
    borderWidths: _.mapValues(_borderWidths, v => _.isFunction(v) ? v(borderWidth) : v),
    borderRadius: _.mapValues(_borderRadius, v => _.isFunction(v) ? v(borderRadiusBase) : v),
  };
};

const contextValues = (values: {
  variables: typeof defaultVariables;
  palette: typeof defaultPalette;
}) => ({
  ...values,
  decoded: decodeVariables(values.variables),
});

export const ThemeBaseContext = React.createContext(contextValues({
  variables: defaultVariables,
  palette: defaultPalette,
}));

ThemeBaseContext.displayName = 'ThemeBaseContext';

export const ThemeBaseProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({
  variables,
  palette,
  children
}) => {

  const parent = React.useContext(ThemeBaseContext);
  const _variables = useEquivalent(_.isFunction(variables) ? variables(parent.variables) : variables);
  const values: React.ContextType<typeof ThemeBaseContext> = React.useMemo(() => contextValues({
    variables: _.assign({}, parent.variables, _variables, {
      root: _.assign({}, parent.variables.root, _variables?.root),
      grays: _.assign({}, parent.variables.grays, _variables?.grays),
      colorWeights: _.assign({}, parent.variables.colorWeights, _variables?.colorWeights),
      themeColors: _.assign({}, parent.variables.themeColors, _variables?.themeColors),
      zIndex: _.assign({}, parent.variables.zIndex, _variables?.zIndex),
    }),
    palette: (theme) => {
      const parent_style = parent.palette(theme);
      const current_style = palette?.(theme) ?? {};
      return _.mapValues(parent_style, (v, k) => current_style[k as keyof ThemePalette] ?? v) as ThemePalette;
    },
  }), [parent, _variables, palette]);

  return (
    <ThemeBaseContext.Provider value={values}>
      {children}
    </ThemeBaseContext.Provider>
  );
};

ThemeBaseProvider.displayName = 'ThemeBaseProvider';
