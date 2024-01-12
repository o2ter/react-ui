//
//  index.tsx
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
import { StyleSheet } from 'react-native';
import { useEquivalent } from 'sugax';
import { flattenStyle } from './flatten';
import { ComponentStyles, _StyleProp, ClassNames, Selectors } from './types';

export const _StyleContext = React.createContext<{
  components: ComponentStyles;
  classes: Record<string, _StyleProp>;
}>({ components: {}, classes: {} });

type WithCallback<T extends object> = { [K in keyof T]: T[K] | ((prev: T[K]) => T[K]); };
const mergeStyle = <T extends Record<string, _StyleProp>>(
  parent: T,
  style: WithCallback<T>,
) => ({
  ..._.mapValues(parent, v => flattenStyle(v)),
  ..._.mapValues(style, (v, k) => flattenStyle([parent[k], _.isFunction(v) ? v(parent[k] as T[keyof T]) : v])),
});

type StyleProviderProps = React.PropsWithChildren<{
  components?: WithCallback<ComponentStyles>;
  classes?: WithCallback<Record<string, _StyleProp>>;
}>;

export const StyleProvider: React.FC<StyleProviderProps> = ({
  children,
  components,
  classes,
}) => {
  const parent = React.useContext(_StyleContext);
  const _components = useEquivalent(components);
  const _classes = useEquivalent(classes);
  const value = React.useMemo(() => ({
    components: _components ? StyleSheet.create(mergeStyle(parent.components, _components)) as ComponentStyles : parent.components,
    classes: _classes ? StyleSheet.create(mergeStyle(parent.classes, _classes)) : parent.classes,
  }), [parent, _components, _classes]);
  return (
    <_StyleContext.Provider value={value}>{children}</_StyleContext.Provider>
  );
}

StyleProvider.displayName = 'StyleProvider';

export const _CSSNameContext = React.createContext<string[]>([]);

type _CSSNameProviderProps = React.PropsWithChildren<{
  classes: string[];
}>;

export const _CSSNameProvider: React.FC<_CSSNameProviderProps> = ({
  children,
  classes,
}) => (
  <_CSSNameContext.Provider value={classes}>{children}</_CSSNameContext.Provider>
);

_CSSNameProvider.displayName = '_CSSNameProvider';
