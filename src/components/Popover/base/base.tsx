//
//  base.tsx
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
import View from '../../View';
import { MeasureInWindowOnSuccessCallback, View as RNView } from 'react-native';
import { useMergeRefs, useStableCallback } from 'sugax';
import { createMemoComponent } from '../../../internals/utils';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import type { useWindowEvent } from '../../../hooks/webHooks';
import { useSetNode } from '../context';

type PopoverBaseProps = React.ComponentProps<typeof View> & {
  render: (layout: LayoutRectangle) => React.ReactNode;
  extraData?: any;
};

export const createPopoverBase = (
  _measureInWindow: (view: RNView, callback: MeasureInWindowOnSuccessCallback) => void,
  _useWindowEvent?: typeof useWindowEvent
) => createMemoComponent((
  {
    render,
    extraData,
    onLayout,
    children,
    ...props
  }: PopoverBaseProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {

  const viewRef = React.useRef<React.ComponentRef<typeof View>>();
  const ref = useMergeRefs(viewRef, forwardRef);

  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const popover = React.useMemo(() => layout && render(layout), [layout, extraData]);

  useSetNode(popover);

  const calculate = () => {
    if (viewRef.current) _measureInWindow(viewRef.current, (x, y, width, height) => setLayout({ x, y, width, height }));
  }

  if (_useWindowEvent) _useWindowEvent('scroll', () => { calculate(); }, true);
  const _onLayout = useStableCallback((e: LayoutChangeEvent) => {
    calculate();
    if (onLayout) onLayout(e);
  });

  return (
    <View
      ref={ref}
      onLayout={_onLayout}
      {...props}
    >{children}</View>
  );
});
