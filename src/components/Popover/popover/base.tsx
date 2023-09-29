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
import React, { useCallback } from 'react';
import { MeasureInWindowOnSuccessCallback, View as RNView, Platform } from 'react-native';
import { useMergeRefs, useStableCallback } from 'sugax';
import type { useWindowEvent } from '../../../hooks/webHooks';
import { createMemoComponent } from '../../../internals/utils';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { useSetNode } from '../context';
import { useTheme } from '../../../theme';
import View from '../../View';

type PopoverProps = React.ComponentProps<typeof View> & {
  hidden: boolean;
  popover: React.ReactNode | ((layout: LayoutRectangle) => React.ReactNode);
  extraData?: any;
};

export const PopoverBase = (
  _measureInWindow: (view: RNView, callback: MeasureInWindowOnSuccessCallback) => void,
  _useWindowEvent?: typeof useWindowEvent
) => createMemoComponent((
  {
    hidden,
    popover,
    extraData,
    onLayout,
    children,
    ...props
  }: PopoverProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {

  const id = React.useId();
  const theme = useTheme();

  const viewRef = React.useRef<React.ComponentRef<typeof View>>();
  const ref = useMergeRefs(viewRef, forwardRef);

  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const _popover = useStableCallback((layout: LayoutRectangle) => _.isFunction(popover) ? popover(layout) : popover);

  useSetNode(React.useMemo(() => layout && !hidden && (
    <RNView
      key={id}
      pointerEvents='box-none'
      style={[
        {
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: layout.height,
          zIndex: theme.zIndex.popover,
        },
        Platform.select({
          web: { position: 'fixed' } as any,
          default: { position: 'absolute' },
        }),
      ]}
    >{_popover(layout)}</RNView>
  ), [layout, extraData]));

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
