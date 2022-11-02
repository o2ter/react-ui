//
//  index.tsx
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
import { useMergeRefs } from 'sugax';
import { View, ViewProps, ViewStyle, StyleSheet, useWindowDimensions, LayoutRectangle, ScaledSize } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modify } from '../../internals/types';
import { useTheme } from '../../theme';
export { SafeAreaProvider, useSafeAreaInsets, useSafeAreaFrame, withSafeAreaInsets } from 'react-native-safe-area-context';

const TOP = 0b1000,
  RIGHT = 0b0100,
  BOTTOM = 0b0010,
  LEFT = 0b0001,
  ALL = 0b1111;

const edgeBitmaskMap = {
  top: TOP,
  right: RIGHT,
  bottom: BOTTOM,
  left: LEFT,
};

type InsetEdge = keyof typeof edgeBitmaskMap;

const calculateInsets = (
  { x, y, width, height }: LayoutRectangle,
  { width: window_width, height: window_height }: ScaledSize
) => ({
  top: y,
  left: x,
  right: Math.max(0, window_width - x - width),
  bottom: Math.max(0, window_height - y - height),
});

type SafeAreaViewProps = Modify<ViewProps, {
  edges: InsetEdge[]
}>

export const SafeAreaView = React.forwardRef<View, SafeAreaViewProps>(({
  style,
  edges,
  children,
  onLayout,
  ...props
}, forwardRef) => {

  const viewRef = React.useRef<View>();
  const ref = useMergeRefs(viewRef, forwardRef);
  const theme = useTheme();

  const insets = useSafeAreaInsets();
  const windowDimensions = useWindowDimensions();

  const [clientRect, setClientRect] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
  const clientInsets = calculateInsets(clientRect, windowDimensions);

  const edgeBitmask = _.isNil(edges) ? ALL : edges.reduce((accum, edge) => accum | edgeBitmaskMap[edge], 0);
  const insetTop = edgeBitmask & TOP ? Math.max(0, insets.top - clientInsets.top) : 0;
  const insetLeft = edgeBitmask & LEFT ? Math.max(0, insets.left - clientInsets.left) : 0;
  const insetRight = edgeBitmask & RIGHT ? Math.max(0, insets.right - clientInsets.right) : 0;
  const insetBottom = edgeBitmask & BOTTOM ? Math.max(0, insets.bottom - clientInsets.bottom) : 0;

  const {
    padding = 0,
    paddingVertical = padding,
    paddingHorizontal = padding,
    paddingTop = paddingVertical,
    paddingRight = paddingHorizontal,
    paddingBottom = paddingVertical,
    paddingLeft = paddingHorizontal,
    ..._style
  }: ViewStyle = StyleSheet.flatten([theme.styles.safeAreaViewStyle, style]) ?? {};

  return <View
    ref={ref}
    onLayout={(event) => {
      viewRef.current?.measureInWindow((x, y, width, height) => setClientRect({ x, y, width, height }));
      if (_.isFunction(onLayout)) onLayout(event);
    }}
    style={[{
      paddingTop: _.isNumber(paddingTop) ? paddingTop + insetTop : paddingTop,
      paddingLeft: _.isNumber(paddingLeft) ? paddingLeft + insetLeft : paddingLeft,
      paddingRight: _.isNumber(paddingRight) ? paddingRight + insetRight : paddingRight,
      paddingBottom: _.isNumber(paddingBottom) ? paddingBottom + insetBottom : paddingBottom,
    }, _style]} {...props}>{children}</View>;
});
