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
import { useStableCallback } from 'sugax';
import { createMemoComponent } from '../../../internals/utils';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { PopoverProps } from './types';
import { PopoverContext } from '../context';
import View from '../../View';

export const Popover = createMemoComponent((
  {
    popover,
    onLayout,
    children,
    ...props
  }: PopoverProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {

  const id = React.useId();
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const { setNodes } = React.useContext(PopoverContext);

  const _onLayout = useStableCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
    if (onLayout) onLayout(e);
  });

  return (
    <View
      ref={forwardRef}
      onLayout={_onLayout}
      {...props}
    >{children}</View>
  );
});
