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
import React from 'react';
import { ScrollView as RNScrollView, RefreshControl as RNRefreshControl } from 'react-native';
import { KeyboardAwareScrollable } from '../KeyboardAwareScrollable';
import { AsyncRefreshControl } from '../AsyncRefreshControl';
import { useMergeRefs } from 'sugax';

const ScrollViewBase = KeyboardAwareScrollable(RNScrollView);
const RefreshControl = AsyncRefreshControl(RNRefreshControl);

const ScrollViewContext = React.createContext({ current: null });
export const useScrollView = () => React.useContext(ScrollViewContext);

const ScrollLayoutContext = React.createContext({ current: null });
export const useScrollLayout = () => React.useContext(ScrollLayoutContext);

export const ScrollView = React.forwardRef(({
  onRefresh,
  onLayout,
  onContentSizeChange,
  onScroll,
  refreshControlProps,
  scrollEventThrottle = 1,
  horizontal = false,
  children,
  ...props
}, forwardRef) => {

  const scrollViewRef = React.useRef();
  const ref = useMergeRefs(scrollViewRef, forwardRef);

  const [layoutMeasurement, setLayout] = React.useState();
  const [contentSize, setContentSize] = React.useState();
  const [scroll, setScroll] = React.useState();

  const scrollLayout = React.useMemo(() => ({ ...scroll, layoutMeasurement, contentSize, horizontal }), [layoutMeasurement, contentSize, scroll, horizontal])

  return <ScrollViewBase
    ref={ref}
    onLayout={(event) => {
      setLayout(event.nativeEvent.layout);
      if (_.isFunction(onLayout)) onLayout(event);
    }}
    onContentSizeChange={(width, height) => {
      setContentSize(width, height);
      if (_.isFunction(onContentSizeChange)) onContentSizeChange(width, height);
    }}
    onScroll={(event) => {
      setScroll(event.nativeEvent);
      if (_.isFunction(onScroll)) onScroll(event);
    }}
    horizontal={horizontal}
    scrollEventThrottle={scrollEventThrottle}
    refreshControl={_.isFunction(onRefresh) ? <RefreshControl onRefresh={onRefresh} {...refreshControlProps} /> : null}
    {...props}>
    <ScrollViewContext.Provider value={scrollViewRef}><ScrollLayoutContext.Provider value={scrollLayout}>
      {children}
    </ScrollLayoutContext.Provider></ScrollViewContext.Provider>
  </ScrollViewBase>;
});

export default ScrollView;