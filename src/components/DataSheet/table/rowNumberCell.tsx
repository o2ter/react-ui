//
//  rowNumberCell.tsx
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

import React from 'react';
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { DataSheetCell } from './cell';
import { StyleProp } from 'react-native';
import { createComponent } from '../../../internals/utils';

const stickyRowNumberStyle: React.CSSProperties = {
  position: 'sticky',
  tableLayout: 'fixed',
  left: 0,
  zIndex: 1,
};

type RowNumberCellProps = React.PropsWithChildren<{
  row: number;
  stickyRowNumbers?: boolean;
  style?: StyleProp<React.CSSProperties>;
  selectedStyle?: StyleProp<React.CSSProperties>;
  highlightColor: string;
}>

export const RowNumberCell = React.memo(createComponent(({
  row,
  stickyRowNumbers,
  style,
  selectedStyle,
  highlightColor,
  children,
}: RowNumberCellProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof DataSheetCell>>) => {

  const { state, isRowSelected, isCellSelected } = useDataSheetState();

  const _style = React.useMemo(() => flattenCSSStyle([{
    padding: 4,
    overflow: 'hidden',
    borderTop: 0,
    borderLeft: 1,
    borderBottom: 1,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DDD',
    borderRightStyle: isRowSelected(row) || isCellSelected(row, 0) ? 'double' : 'solid',
    borderRightColor: isRowSelected(row) || isCellSelected(row, 0) ? '#2185D0' : '#DDD',
    borderBottomStyle: isRowSelected(row + 1) ? 'double' : 'solid',
    borderBottomColor: isRowSelected(row + 1) ? '#2185D0' : '#DDD',
    backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
  }, stickyRowNumbers ? stickyRowNumberStyle : {}, style]), [state, row, stickyRowNumbers, style]);

  const _selectedStyle = React.useMemo(() => flattenCSSStyle([{
    padding: 4,
    overflow: 'hidden',
    borderTop: 0,
    borderLeft: 1,
    borderBottom: 1,
    borderRight: 1,
    borderStyle: 'double',
    borderColor: '#2185D0',
    backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
  }, stickyRowNumbers ? stickyRowNumberStyle : {}, selectedStyle]), [state, row, stickyRowNumbers, selectedStyle]);

  return (
    <DataSheetCell
      ref={forwardRef}
      selected={isRowSelected(row)}
      highlightColor={highlightColor}
      data-row={row}
      style={_style}
      selectedStyle={_selectedStyle}
    >
      {children}
    </DataSheetCell>
  );
}));
