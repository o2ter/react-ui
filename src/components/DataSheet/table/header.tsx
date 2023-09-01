//
//  header.tsx
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
import { DataSheetProps } from '../types';
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { DataSheetHeaderCell } from './headerCell';
import List from '../../List';

export const DataSheetHeader = <T extends object>({
  stickyHeader,
  stickyRowNumbers,
  headerContainerStyle,
  rowNumbers,
  columns,
  columnWidth,
  columnMinWidth,
  headerItemContainerStyle,
  onColumnWidthChange
}: DataSheetProps<T>) => {

  const { state, isRowSelected, isCellSelected } = useDataSheetState();

  const stickyHeaderStyle: React.CSSProperties = stickyHeader ? {
    position: 'sticky',
    tableLayout: 'fixed',
    top: 0,
    zIndex: 1,
  } : {};

  const stickyRowNumberStyle: React.CSSProperties = stickyRowNumbers ? {
    position: 'sticky',
    tableLayout: 'fixed',
    left: 0,
    zIndex: 2,
  } : {};

  return (
    <thead style={flattenCSSStyle([stickyHeaderStyle, headerContainerStyle])}>
      <tr style={{ backgroundColor: '#F6F8FF' }}>
        {rowNumbers && (
          <th style={flattenCSSStyle([{
            border: 1,
            borderStyle: 'solid',
            borderColor: '#DDD',
            backgroundColor: '#F6F8FF',
            borderBottomStyle: isRowSelected(0) ? 'double' : 'solid',
            borderBottomColor: isRowSelected(0) ? '#2185D0' : '#DDD',
          }, stickyRowNumberStyle])} />
        )}
        <List
          data={columns}
          extraData={state}
          renderItem={({ item, index: col }) => (
            <DataSheetHeaderCell
              label={_.isString(item) ? item : item.label}
              columnWidth={_.isArray(columnWidth) ? columnWidth[col] : undefined}
              columnMinWidth={columnMinWidth}
              onColumnWidthChange={_.isFunction(onColumnWidthChange) ? (width) => onColumnWidthChange(col, width) : undefined}
              style={flattenCSSStyle([{
                position: 'relative',
                border: 1,
                borderLeft: 0,
                borderStyle: 'solid',
                borderColor: '#DDD',
                borderBottomStyle: isRowSelected(0) || isCellSelected(0, col) ? 'double' : 'solid',
                borderBottomColor: isRowSelected(0) || isCellSelected(0, col) ? '#2185D0' : '#DDD',
              }, headerItemContainerStyle])} />
          )}
        />
      </tr>
    </thead>
  );
};
