//
//  headerCell.tsx
//
//  The MIT License
//  Copyright (c) 2015 - 2022 Susan Cheng. All rights reserved.
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
import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { flattenCSSStyle } from '../styles';
import { createComponent } from '../../../internals/utils';

type DataSheetHeaderCellProps = React.ComponentPropsWithoutRef<'th'> & {
  label?: React.ReactNode;
  borderSize?: number;
  columnWidth?: number;
  columnMinWidth?: number;
  onColumnWidthChange?: (width: number) => void;
};

export const DataSheetHeaderCell = createComponent(({
  label,
  style,
  borderSize = 1,
  columnWidth,
  columnMinWidth,
  onColumnWidthChange,
  ...props
}: DataSheetHeaderCellProps, forwardRef: React.ForwardedRef<React.ComponentRef<'th'>>) => {

  const _columnWidth = columnWidth ?? 0;
  const _columnMinWidth = columnMinWidth ?? 0;

  const borderRef = React.useRef<React.ComponentRef<typeof View>>(null);

  return (
    <th
      ref={forwardRef}
      style={flattenCSSStyle([{ width: Math.max(_columnWidth, _columnMinWidth) }, style])}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        {_.isString(label) ? (
          <Text style={[{ flex: 1, padding: 4 }]}>{label}</Text>
        ) : label}
        <View ref={borderRef}
          onStartShouldSetResponder={(e) => e.target === borderRef.current as any}
          onMoveShouldSetResponder={(e) => e.target === borderRef.current as any}
          onStartShouldSetResponderCapture={() => false}
          onMoveShouldSetResponderCapture={() => false}
          onResponderTerminationRequest={() => false}
          onResponderMove={_.isFunction(onColumnWidthChange) ? (e) => onColumnWidthChange(_columnWidth + e.nativeEvent.locationX - borderSize * 0.5) : undefined}
          onResponderRelease={_.isFunction(onColumnWidthChange) ? (e) => onColumnWidthChange(_columnWidth + e.nativeEvent.locationX - borderSize * 0.5) : undefined}
          style={{ width: borderSize, cursor: 'col-resize' } as StyleProp<ViewStyle>} />
      </View>
    </th>
  );
}, {
  displayName: 'DataSheetHeaderCell',
});
