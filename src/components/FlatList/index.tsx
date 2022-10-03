//
//  index.js
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
import React, { ComponentRef, ComponentPropsWithoutRef } from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  RefreshControl as RNRefreshControl,
} from 'react-native';
import { KeyboardAwareScrollable } from '../KeyboardAwareScrollable';
import { AsyncRefreshControl } from '../AsyncRefreshControl';
import { Modify } from '../../internals/types';
import { useTheme } from '../../theme';

const FlatListBase = KeyboardAwareScrollable(RNFlatList);
const RefreshControl = AsyncRefreshControl(RNRefreshControl);

type FlatListProps<ItemT = any> = Modify<Omit<RNFlatListProps<ItemT>, 'data' | 'renderItem'>, {
  onRefresh?: () => Promise<void>;
  refreshControlProps: Omit<ComponentPropsWithoutRef<typeof RefreshControl>, 'onRefresh'>;
}>

export const FlatList = React.forwardRef<ComponentRef<typeof FlatListBase>, FlatListProps>(({
  onRefresh,
  style,
  contentContainerStyle,
  columnWrapperStyle,
  refreshControlProps,
  children,
  ...props
}, forwardRef) => {

  const theme = useTheme();

  return (
    <FlatListBase
      ref={forwardRef}
      style={[theme.styles.scrollableStyle, style]}
      contentContainerStyle={[theme.styles.scrollableContentContainerStyle, contentContainerStyle]}
      columnWrapperStyle={[theme.styles.flatlistColumnWrapperStyle, columnWrapperStyle]}
      data={_.isNil(children) ? [] : _.castArray(children)}
      renderItem={({ item }: { item: React.ReactNode }) => item}
      refreshControl={_.isFunction(onRefresh) ? <RefreshControl onRefresh={onRefresh} {...refreshControlProps} /> : null}
      {...props} />
  )
});

export default FlatList;