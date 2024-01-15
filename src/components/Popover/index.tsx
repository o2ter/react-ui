//
//  index.tsx
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
import { useStableCallback } from 'sugax';
import { createMemoComponent } from '../../internals/utils';
import { Pressable, LayoutRectangle } from 'react-native';
import { PopoverProps } from './types';
import { PopoverBody } from './body';
import { Overlay } from '../Overlay';

export const Popover = /*#__PURE__*/ createMemoComponent((
  {
    position = 'auto',
    alignment = 'auto',
    hidden,
    arrow,
    shadow,
    render,
    extraData,
    containerStyle,
    onLayout,
    children,
    ...props
  }: PopoverProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Overlay>>
) => {

  const id = React.useId();

  const [press, setPress] = React.useState(false);

  const _extraData = [hidden ?? !press, position, containerStyle, extraData];
  const _render = useStableCallback((layout: LayoutRectangle) => (
    <PopoverBody
      key={id}
      layout={layout}
      hidden={hidden ?? !press}
      arrow={arrow ?? true}
      shadow={shadow ?? true}
      position={position}
      alignment={alignment}
      style={containerStyle}
    >{render(layout)}</PopoverBody>
  ));

  return (
    <Overlay
      ref={forwardRef}
      render={_render}
      extraData={React.useMemo(() => _extraData, _extraData)}
      {...props}
    >{_.isNil(hidden) ? (
      <Pressable onPress={() => setPress(v => !v)}>{children}</Pressable>
    ) : children}</Overlay>
  );
}, {
  displayName: 'Popover',
});
