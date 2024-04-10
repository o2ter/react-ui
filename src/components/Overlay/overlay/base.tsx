//
//  base.tsx
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
import View from '../../View';
import Pressable from '../../Pressable';
import { GestureResponderEvent, View as RNView, Pressable as RNPressable } from 'react-native';
import { useMergeRefs, useStableCallback } from 'sugax';
import { createMemoComponent } from '../../../internals/utils';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import type { useWindowEvent } from '../../../hooks/webHooks';
import { useOverlay } from '../context';

type OverlayProps = React.ComponentProps<typeof View> & {
  render: (layout: LayoutRectangle & { pageX: number; pageY: number; }) => React.ReactElement;
  extraData?: any;
  onTouchOutside?: (event: GestureResponderEvent) => void;
};

type MeasureCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number,
) => void;

type WrapperProps = Omit<React.ComponentProps<typeof View>, 'children'> & {
  element: React.ReactElement<any>;
};

const Wrapper = React.forwardRef(({
  element,
  onLayout,
  ...props
}: WrapperProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {
  const {
    props: {
      onLayout: _onLayout,
      children,
      ..._props
    }
  } = element;
  const layout = useStableCallback((e: LayoutChangeEvent) => {
    if (onLayout) onLayout(e);
    if (_onLayout) _onLayout(e);
  });
  return React.cloneElement(element, {
    ref: forwardRef,
    onLayout: layout,
    ...props,
    ..._props
  }, ..._.castArray(children ?? []));
})

export const createOverlay = (
  _measureInWindow: (view: RNView, callback: MeasureCallback) => void,
  _useWindowEvent?: typeof useWindowEvent
) => createMemoComponent((
  {
    render,
    extraData,
    onLayout,
    onTouchOutside,
    children,
    ...props
  }: OverlayProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {

  const viewRef = React.useRef<React.ComponentRef<typeof View>>();
  const ref = useMergeRefs(viewRef, forwardRef);

  const [layout, setLayout] = React.useState<LayoutRectangle & { pageX: number; pageY: number; }>();
  const overlay = React.useMemo(() => layout && render(layout), [layout, extraData]);

  const _onTouchOutside = useStableCallback(onTouchOutside ?? (() => { }));
  useOverlay(overlay, _onTouchOutside);

  const calculate = () => {
    if (viewRef.current) _measureInWindow(viewRef.current, (x, y, width, height, pageX, pageY) => setLayout({ x, y, width, height, pageX, pageY }));
  }

  if (_useWindowEvent) _useWindowEvent('scroll', () => { calculate(); }, true);
  const _onLayout = useStableCallback((e: LayoutChangeEvent) => {
    calculate();
    if (onLayout) onLayout(e);
  });

  const [child, ...rest] = React.Children.toArray(children);
  if (
    React.isValidElement(child) &&
    _.isEmpty(rest) &&
    _.indexOf([
      View,
      Pressable,
      RNView,
      RNPressable,
    ], child.type as any) !== -1) {
    return (
      <Wrapper
        ref={ref}
        element={child}
        onLayout={_onLayout}
        {...props}
      />
    );
  }

  return (
    <View
      ref={ref}
      onLayout={_onLayout}
      {...props}
    >{children}</View>
  );
}, {
  displayName: 'Overlay',
});
