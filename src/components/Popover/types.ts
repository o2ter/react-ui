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

import React from 'react';
import View from '../View';
import { GestureResponderEvent, LayoutRectangle, StyleProp, ViewStyle } from 'react-native';

type _PopoverPosition = 'top' | 'left' | 'right' | 'bottom';
type _PopoverAlignment = 'top' | 'left' | 'right' | 'bottom';
export type PopoverPosition = 'auto' | _PopoverPosition | _PopoverPosition[];
export type PopoverAlignment = 'auto' | _PopoverAlignment | _PopoverAlignment[];

export type PopoverProps = React.ComponentProps<typeof View> & {
  position?: PopoverPosition;
  alignment?: PopoverAlignment;
  hidden?: boolean;
  arrow?: boolean;
  shadow?: boolean | number;
  render: (layout: LayoutRectangle & { pageX: number; pageY: number; }) => React.ReactNode;
  onTouchOutside?: (event: GestureResponderEvent) => void;
  extraData?: any;
  containerStyle?: StyleProp<ViewStyle>;
};
