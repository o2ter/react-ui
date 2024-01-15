//
//  bodyCell.tsx
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
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { DataSheetCell } from './cell';
import { StyleProp } from 'react-native';
import { createComponent } from '../../../internals/utils';

type BodyCellProps = React.PropsWithChildren<{
  row: number;
  col: number;
  rowNumbers?: boolean;
  style?: StyleProp<React.CSSProperties>;
  selectedStyle?: StyleProp<React.CSSProperties>;
  highlightColor: string;
  allowEditForCell?: boolean | ((row: number, col: number) => boolean);
}>

export const BodyCell = /*#__PURE__*/ createComponent(({
  row,
  col,
  rowNumbers,
  style,
  selectedStyle,
  highlightColor,
  allowEditForCell,
  children,
}: BodyCellProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof DataSheetCell>>) => {

  const { state, selectionDeps, setState, isRowSelected, isCellSelected, isCellEditing } = useDataSheetState();

  const _style = React.useMemo(() => flattenCSSStyle([{
    padding: 0,
    position: 'relative',
    borderTop: 0,
    borderLeft: rowNumbers === true || col != 0 ? 0 : 1,
    borderBottom: 1,
    borderRight: 1,
    borderStyle: 'solid',
    borderColor: '#DDD',
    borderRightStyle: isRowSelected(row) || isCellSelected(row, col + 1) ? 'double' : 'solid',
    borderRightColor: isRowSelected(row) || isCellSelected(row, col + 1) ? '#2185D0' : '#DDD',
    borderBottomStyle: isRowSelected(row + 1) || isCellSelected(row + 1, col) ? 'double' : 'solid',
    borderBottomColor: isRowSelected(row + 1) || isCellSelected(row + 1, col) ? '#2185D0' : '#DDD',
    backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
  }, state.editing ? {} : { cursor: 'cell' }, style]), [state.editing, ...selectionDeps, row, rowNumbers, style]);

  const _selectedStyle = React.useMemo(() => flattenCSSStyle([{
    padding: 0,
    position: 'relative',
    borderTop: 0,
    borderLeft: rowNumbers === true || col != 0 ? 0 : 1,
    borderBottom: 1,
    borderRight: 1,
    borderStyle: 'double',
    borderColor: '#2185D0',
    backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
  }, state.editing ? {} : { cursor: 'cell' }, selectedStyle]), [state.editing, row, rowNumbers, selectedStyle]);

  const allowEdit = _.isFunction(allowEditForCell) ? allowEditForCell(row, col) : !!allowEditForCell;
  const doubleClick = React.useCallback(() => setState({ editing: { row, col } }), []);

  return (
    <DataSheetCell
      ref={forwardRef}
      isEditing={isCellEditing(row, col)}
      selected={isRowSelected(row) || isCellSelected(row, col)}
      highlightColor={highlightColor}
      data-row={row}
      data-col={col}
      style={_style}
      onDoubleClick={allowEdit ? doubleClick : undefined}
      selectedStyle={_selectedStyle}
    >
      {children}
    </DataSheetCell>
  );
});
