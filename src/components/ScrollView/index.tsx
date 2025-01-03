//
//  index.tsx
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
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  RefreshControl as RNRefreshControl,
  NativeScrollSize,
  LayoutRectangle,
  NativeScrollEvent,
} from 'react-native';
import { KeyboardAwareScrollable } from './KeyboardAwareScrollable';
import { AsyncRefreshControl } from '../AsyncRefreshControl';
import { Modify } from '../../internals/types';
import { useMergeRefs } from 'sugax';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import { normalizeStyle } from '../Style/flatten';

const ScrollViewBase: typeof RNScrollView = KeyboardAwareScrollable(RNScrollView);
const RefreshControl = AsyncRefreshControl(RNRefreshControl);

type ScrollViewRef = React.ComponentRef<typeof ScrollViewBase>;

const ScrollViewContext = React.createContext<React.MutableRefObject<ScrollViewRef | undefined>>({ current: undefined });
export const useScrollView = () => React.useContext(ScrollViewContext);

const ScrollLayoutContext = React.createContext<Modify<Partial<NativeScrollEvent>, {
  layoutMeasurement?: LayoutRectangle;
  horizontal?: boolean | null;
}>>({});

export const useScrollLayout = () => React.useContext(ScrollLayoutContext);

type ScrollViewProps = Modify<RNScrollViewProps, {
  classes?: ClassNames;
  onRefresh?: () => PromiseLike<void>;
  refreshControlProps?: Omit<React.ComponentPropsWithoutRef<typeof RefreshControl>, 'onRefresh'>;
}>

export const ScrollView = createMemoComponent(({
  classes,
  onRefresh,
  onLayout,
  onContentSizeChange,
  onScroll,
  style,
  contentContainerStyle,
  refreshControlProps = {},
  scrollEventThrottle = 1,
  horizontal = false,
  children,
  ...props
}: ScrollViewProps, forwardRef: React.ForwardedRef<ScrollViewRef>) => {

  const scrollViewRef = React.useRef<ScrollViewRef>();
  const ref = useMergeRefs(scrollViewRef, forwardRef);

  const [layoutMeasurement, setLayout] = React.useState<LayoutRectangle>();
  const [contentSize, setContentSize] = React.useState<NativeScrollSize>();
  const [scroll, setScroll] = React.useState<NativeScrollEvent>();

  const scrollLayout = React.useMemo(() => ({
    ...scroll,
    layoutMeasurement,
    contentSize,
    horizontal,
  }), [layoutMeasurement, contentSize, scroll, horizontal]);

  const scrollableStyle = _useComponentStyle('scrollable', classes);
  const scrollableContentContainerStyle = _useComponentStyle('scrollableContentContainer');

  return <ScrollViewBase
    ref={ref}
    style={normalizeStyle([scrollableStyle, style])}
    contentContainerStyle={normalizeStyle([scrollableContentContainerStyle, contentContainerStyle])}
    onLayout={(event) => {
      setLayout(event.nativeEvent.layout);
      if (_.isFunction(onLayout)) onLayout(event);
    }}
    onContentSizeChange={(width, height) => {
      setContentSize({ width, height });
      if (_.isFunction(onContentSizeChange)) onContentSizeChange(width, height);
    }}
    onScroll={(event) => {
      setScroll(event.nativeEvent);
      if (_.isFunction(onScroll)) onScroll(event);
    }}
    horizontal={horizontal}
    scrollEventThrottle={scrollEventThrottle}
    refreshControl={_.isFunction(onRefresh) ? <RefreshControl onRefresh={onRefresh} {...refreshControlProps} /> : undefined}
    {...props}>
    <ScrollViewContext.Provider value={scrollViewRef}><ScrollLayoutContext.Provider value={scrollLayout}>
      {children}
    </ScrollLayoutContext.Provider></ScrollViewContext.Provider>
  </ScrollViewBase>;
}, {
  displayName: 'ScrollView',
});

export default ScrollView;