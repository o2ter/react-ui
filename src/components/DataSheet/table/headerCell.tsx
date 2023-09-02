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

  const _columnWidth = Math.max(0, columnWidth ?? 0);
  const _columnMinWidth = Math.max(0, columnMinWidth ?? 0);

  return (
    <th
      ref={forwardRef}
      style={flattenCSSStyle([{ padding: 0 }, style])}
      {...props}
    >
      <View onLayout={_.isFunction(onColumnWidthChange) ? (e) => {
        if (e.nativeEvent.layout.width !== _columnWidth) onColumnWidthChange(e.nativeEvent.layout.width);
      } : undefined}>
        <div style={{
          width: _columnWidth - 6,
          minWidth: _columnMinWidth - 6,
          resize: 'horizontal',
          overflow: 'hidden',
          paddingRight: 6,
        }}>
          {_.isString(label) ? <Text>{label}</Text> : label}
        </div>
      </View>
    </th>
  );
}, {
  displayName: 'DataSheetHeaderCell',
});
