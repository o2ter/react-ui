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
import { flattenStyle } from './flatten';
import { ComponentStyles, _StyleProp, ClassNames, Selectors } from './types';
import { _CSSNameContext, _StyleContext } from './provider';

export * from './provider';

const flattenClassNames = (
  classNames?: ClassNames,
  selectors?: Selectors,
) => {
  const flatted = _.compact(_.compact(_.flattenDeep([classNames])).join(' ').split(/\s/));
  const _classNames = _.sortedUniq(flatted.sort());
  const _selectors = _.sortedUniq(_.compact(_.flattenDeep([selectors])).sort());
  return [..._classNames, ..._.flatMap(_classNames, c => _.map(_selectors, s => `${c}:${s}`))];
}

export const _useCSSComponentStyle = (
  component: keyof ComponentStyles,
  classNames?: ClassNames,
  selectors?: Selectors,
) => {
  const cssNames = React.useContext(_CSSNameContext);
  const { components, classes } = React.useContext(_StyleContext);
  const sel = _.sortedUniq(_.compact(_.flattenDeep([selectors])).sort());
  const names = flattenClassNames(classNames, sel);
  return React.useMemo(() => [
    components[component],
    ...sel.map(s => components[`${component}:${s}` as keyof ComponentStyles]),
    ..._.compact(_.map(classes,
      (v, k) => _.includes(names, k) ?
        _.includes(cssNames, k) ? { $$css: true, [k]: k } as _StyleProp : v
        : undefined
    )),
  ], [components, classes, component, names.join(' ')]);
}

export const _useComponentStyle = (
  component: keyof ComponentStyles,
  classNames?: ClassNames,
  selectors?: Selectors,
) => {
  const { components, classes } = React.useContext(_StyleContext);
  const sel = _.sortedUniq(_.compact(_.flattenDeep([selectors])).sort());
  const names = flattenClassNames(classNames, sel);
  return React.useMemo(() => flattenStyle([
    components[component],
    ...sel.map(s => components[`${component}:${s}` as keyof ComponentStyles]),
    ..._.values(_.pickBy(classes, (v, k) => _.includes(names, k))),
  ]), [components, classes, component, names.join(' ')]);
}

export const useStyle = (
  classNames?: ClassNames,
  selectors?: Selectors,
) => {
  const { classes } = React.useContext(_StyleContext);
  const names = flattenClassNames(classNames, selectors);
  return React.useMemo(() =>
    flattenStyle(_.values(_.pickBy(classes, (v, k) => _.includes(names, k))))
    , [classes, names.join(' ')]);
}

export const useAllStyle = () => React.useContext(_StyleContext);
