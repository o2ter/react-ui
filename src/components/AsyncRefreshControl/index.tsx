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
import React from 'react';
import { RefreshControlBase, RefreshControlProps } from 'react-native';
import { Modify } from '../../internals/types';
import { ClassNames, _useComponentStyle } from '../Style';
import { createMemoComponent } from '../../internals/utils';
import { flattenStyle } from '../Style/flatten';

type AsyncRefreshControlProps = Modify<Omit<RefreshControlProps, 'refreshing'>, {
  classes?: ClassNames;
  onRefresh: () => PromiseLike<void>;
}>

async function _onRefresh(
  onRefresh: () => PromiseLike<void>,
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>
) {
  setRefreshing(true);
  try { await onRefresh() } catch (e) { console.error(e) }
  setRefreshing(false);
}

export const AsyncRefreshControl = (
  RefreshControl: typeof RefreshControlBase
) => createMemoComponent((
  {
    classes,
    style,
    onRefresh,
    ...props
  }: AsyncRefreshControlProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RefreshControlBase>>
) => {

  const [refreshing, setRefreshing] = React.useState(false);
  const defaultStyle = _useComponentStyle('refreshControl', classes, refreshing && 'active');

  return <RefreshControl
    ref={forwardRef}
    refreshing={refreshing}
    style={flattenStyle([defaultStyle, style])}
    onRefresh={() => { if (_.isFunction(onRefresh)) _onRefresh(onRefresh, setRefreshing) }}
    {...props} />;
}, {
  displayName: 'AsyncRefreshControl',
});

export default AsyncRefreshControl;