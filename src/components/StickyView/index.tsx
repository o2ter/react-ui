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
import { View, ViewProps, StyleProp, ViewStyle, LayoutRectangle } from 'react-native';
import { useScrollView, useScrollLayout } from '../ScrollView';
import { Modify } from '../../internals/types';
import { useMergeRefs, useStableCallback } from 'sugax';
import { createMemoComponent } from '../../internals/utils';

type StickyViewProps = Modify<ViewProps, {
  stickyContainerStyle?: StyleProp<ViewStyle>;
  stickyView: (x: { factor: number, offset: number }) => React.ReactNode;
}>

type Layout = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

const StickyContainer: React.FC<{
  layout: Layout;
  scrollViewLayout: ReturnType<typeof useScrollLayout>;
  style?: StyleProp<ViewStyle>;
  renderItem: (x: { factor: number, offset: number }) => React.ReactNode;
}> = ({
  layout,
  scrollViewLayout,
  style,
  renderItem,
}) => {

  const left = layout.left ?? 0;
  const top = layout.top ?? 0;
  const width = layout.width ?? 0;
  const height = layout.height ?? 0;

  const displayment = {
    left: left + (scrollViewLayout.contentOffset?.x ?? 0),
    top: top + (scrollViewLayout.contentOffset?.y ?? 0),
    width: Math.min(width, scrollViewLayout.layoutMeasurement?.width ?? 0),
    height: Math.min(height, scrollViewLayout.layoutMeasurement?.height ?? 0),
  }

  const maxX = width - displayment.width;
  const maxY = height - displayment.height;

  const offset = scrollViewLayout.horizontal === true ? displayment.left : displayment.top;
  const factor = Math.max(0, Math.min(1, scrollViewLayout.horizontal === true ? displayment.left / maxX : displayment.top / maxY));

  displayment.left = Math.max(0, Math.min(maxX, displayment.left));
  displayment.top = Math.max(0, Math.min(maxY, displayment.top));

  const _renderItem = useStableCallback(renderItem);

  return <View style={[{ position: 'absolute' }, displayment, style]}>
    {_renderItem({ factor, offset })}
  </View>;
}

StickyContainer.displayName = 'StickyContainer';

export const StickyView = createMemoComponent(({
  onLayout,
  stickyContainerStyle,
  stickyView,
  children,
  ...props
}: StickyViewProps, forwardRef: React.ForwardedRef<View>) => {

  const containerRef = React.useRef<View>();
  const ref = useMergeRefs(containerRef, forwardRef);
  const [layout, setLayout] = React.useState<Layout>({});

  const scrollViewRef = useScrollView();
  const scrollViewLayout = useScrollLayout();

  function _setLayout({ width, height }: LayoutRectangle) {

    if (_.isNil(scrollViewRef.current)) return;
    if (_.isNil(containerRef.current)) return;

    containerRef.current.measureLayout(scrollViewRef.current as any, (left, top) => {
      const offset_x = scrollViewLayout.contentOffset?.x ?? 0;
      const offset_y = scrollViewLayout.contentOffset?.y ?? 0;
      setLayout({ left: -left - offset_x, top: -top - offset_y, width, height });
    }, () => {});
  }

  return <View
    ref={ref}
    onLayout={(event) => {
      _setLayout(event.nativeEvent.layout);
      if (_.isFunction(onLayout)) onLayout(event);
    }} {...props}>
    {_.isFunction(stickyView) && <StickyContainer
      layout={layout}
      scrollViewLayout={scrollViewLayout}
      style={stickyContainerStyle}
      renderItem={stickyView} />}
    {children}
  </View>;
}, {
  displayName: 'StickyView',
});

export default StickyView;