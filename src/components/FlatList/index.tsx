//
//  index.js
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
import React, { ComponentRef, ComponentPropsWithoutRef } from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  RefreshControl as RNRefreshControl,
} from 'react-native';
import { AsyncRefreshControl } from '../AsyncRefreshControl';
import { Modify } from '../../internals/types';
import { useTheme } from '../../theme';

const RefreshControl = AsyncRefreshControl(RNRefreshControl);

type FlatListProps<ItemT = any> = Modify<RNFlatListProps<ItemT>, {
  onRefresh?: () => PromiseLike<void>;
  refreshControlProps?: Omit<ComponentPropsWithoutRef<typeof RefreshControl>, 'onRefresh'>;
}>

export const FlatList = React.forwardRef<ComponentRef<typeof RNFlatList>, FlatListProps>(({
  data,
  extraData,
  onRefresh,
  numColumns = 1,
  style,
  contentContainerStyle,
  columnWrapperStyle,
  refreshControlProps = {},
  renderItem,
  children,
  ...props
}, forwardRef) => {

  const theme = useTheme();
  const _renderItem = React.useCallback(renderItem ?? (() => <></>), [data, extraData]);

  return (
    <RNFlatList
      ref={forwardRef}
      data={data}
      extraData={extraData}
      numColumns={numColumns}
      renderItem={_renderItem}
      style={[theme.styles.scrollableStyle, style]}
      contentContainerStyle={[theme.styles.scrollableContentContainerStyle, contentContainerStyle]}
      columnWrapperStyle={numColumns > 1 ? [theme.styles.flatlistColumnWrapperStyle, columnWrapperStyle] : undefined}
      refreshControl={_.isFunction(onRefresh) ? <RefreshControl onRefresh={onRefresh} {...refreshControlProps} /> : undefined}
      {...props} />
  )
});

export default FlatList;