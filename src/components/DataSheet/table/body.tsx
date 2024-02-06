//
//  index.tsx
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
import View from '../../View';
import List from '../../List';
import Text from '../../Text';
import { DataSheetProps } from '../types';
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { useDataSheetRef } from '../provider/ref';
import { RowNumberCell } from './rowNumberCell';
import { BodyCell } from './bodyCell';

type TableCellItemProps<T> = {
  item?: T;
  rowIdx: number;
  columnIdx: number;
  isEditing: boolean;
  renderItem: (x: Omit<TableCellItemProps<T>, 'renderItem'>) => React.ReactElement | undefined;
}

const TableCellItem = <T extends unknown>({
  renderItem,
  ...props
}: TableCellItemProps<T>) => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      padding: props.isEditing === true ? 0 : 4,
    }}>
    {renderItem(props)}
  </View>
);

export const DataSheetBody = <T extends object>({
  data,
  columns,
  rowNumbers,
  renderItem,
  allowSelection,
  allowEditForCell,
  stickyRowNumbers,
  rowContainerStyle,
  itemContainerStyle,
  selectedItemContainerStyle,
  contentContainerStyle,
  showEmptyLastRow,
  highlightColor = 'rgba(33, 133, 208, 0.15)',
}: DataSheetProps<T>) => {

  const { state, setState, isCellEditing } = useDataSheetState();
  const { editing: editingRef } = useDataSheetRef();

  const handleMouseDown = (e: React.MouseEvent) => {

    const element = e.target as HTMLElement;
    const cell = element.closest('td');
    if (_.isNil(cell)) return;

    const row = cell.dataset.row ?? '';
    const col = cell.dataset.col ?? '';

    if (_.isEmpty(col)) {
      setState(state => ({
        ..._.omit(state, '_selectStart', '_selectEnd'),
        _selectRows: { start: Number(row), end: Number(row) },
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      }))
    } else {
      setState(state => ({
        ..._.omit(state, '_selectRows'),
        _selectStart: { row: Number(row), col: Number(col) },
        _selectEnd: { row: Number(row), col: Number(col) },
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      }));
    }
  }

  const handleMouseOver = (e: React.MouseEvent) => {

    const element = e.target as HTMLElement;
    const cell = element.closest('td');
    if (_.isNil(cell)) return;

    const row = cell.dataset.row ?? '';
    const col = cell.dataset.col ?? '';

    if (_.isEmpty(col)) {
      if (state._selectRows) {
        setState(state => ({
          ..._.omit(state, '_selectStart', '_selectEnd'),
          ...{ _selectRows: { start: state._selectRows!.start, end: Number(row) } },
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
        }));
      }
    } else {
      if (state._selectStart) {
        setState(state => ({
          ..._.omit(state, '_selectRows'),
          ...{ _selectEnd: { row: Number(row), col: Number(col) } },
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
        }));
      }
    }
  }

  return (
    <>
      {_.isArray(data) && (
        <tbody
          style={flattenCSSStyle([{ backgroundColor: 'white' }, contentContainerStyle])}
          onMouseDown={allowSelection && !state.editing ? handleMouseDown : undefined}
          onMouseOver={allowSelection && !state.editing ? handleMouseOver : undefined}
        >
          <List
            data={data}
            extraData={state}
            renderItem={({ item: items, index: row }) => (
              <tr style={flattenCSSStyle(rowContainerStyle)}>
                {rowNumbers === true && (
                  <RowNumberCell
                    row={row}
                    style={itemContainerStyle}
                    selectedStyle={selectedItemContainerStyle}
                    highlightColor={highlightColor}
                    stickyRowNumbers={stickyRowNumbers}
                  >
                    <Text classes='font-monospace'>{row + 1}</Text>
                  </RowNumberCell>
                )}
                <List
                  data={_.map(columns, col => items[_.isString(col) ? col : col.key])}
                  extraData={state}
                  renderItem={({ item, index: col }) => (
                    <BodyCell
                      ref={isCellEditing(row, col) ? editingRef : undefined}
                      row={row}
                      col={col}
                      style={itemContainerStyle}
                      selectedStyle={selectedItemContainerStyle}
                      highlightColor={highlightColor}
                      allowEditForCell={allowEditForCell}
                    >
                      <Text classes='font-monospace'>{' '}</Text>
                      <TableCellItem
                        item={item}
                        rowIdx={row}
                        columnIdx={col}
                        isEditing={isCellEditing(row, col)}
                        renderItem={renderItem}
                      />
                    </BodyCell>
                  )}
                />
              </tr>
            )}
          />
          {showEmptyLastRow === true && (
            <tr style={flattenCSSStyle(rowContainerStyle)}>
              {rowNumbers === true && (
                <RowNumberCell
                  row={data.length}
                  style={itemContainerStyle}
                  selectedStyle={selectedItemContainerStyle}
                  highlightColor={highlightColor}
                  stickyRowNumbers={stickyRowNumbers}
                />
              )}
              <List
                data={columns}
                extraData={state}
                renderItem={({ index: col }) => (
                  <BodyCell
                    ref={isCellEditing(data.length, col) ? editingRef : undefined}
                    row={data.length}
                    col={col}
                    style={itemContainerStyle}
                    selectedStyle={selectedItemContainerStyle}
                    highlightColor={highlightColor}
                    allowEditForCell={allowEditForCell}
                  >
                    <Text classes='font-monospace'>{' '}</Text>
                    {isCellEditing(data.length, col) && (
                      <TableCellItem
                        rowIdx={data.length}
                        columnIdx={col}
                        isEditing={true}
                        renderItem={renderItem}
                      />
                    )}
                  </BodyCell>
                )}
              />
            </tr>
          )}
        </tbody>
      )}
    </>
  );
};
