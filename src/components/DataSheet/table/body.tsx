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
import { DataSheetProps } from '../types';
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { DataSheetCell } from './cell';
import { useDataSheetRef } from '../provider/ref';
import View from '../../View';
import List from '../../List';
import Text from '../../Text';

type TableCellItemProps<T> = {
  item?: T;
  rowIdx: number;
  columnIdx: number;
  isEditing: boolean;
  renderItem: (x: Omit<TableCellItemProps<T>, 'renderItem'>) => React.ReactElement | undefined;
}

const TableCellItem = <T extends any>({
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

  const { state, setState, isRowSelected, isCellSelected, isCellEditing } = useDataSheetState();
  const { editing: editingRef } = useDataSheetRef();

  const _allowEditForCell = (row: number, col: number) => _.isFunction(allowEditForCell) ? allowEditForCell(row, col) : !!allowEditForCell;

  const stickyRowNumberStyle: React.CSSProperties = stickyRowNumbers ? {
    position: 'sticky',
    tableLayout: 'fixed',
    left: 0,
    zIndex: 1,
  } : {};

  return (
    <>
      {_.isArray(data) && (
        <tbody style={flattenCSSStyle([{ backgroundColor: 'white' }, contentContainerStyle])}>

          <List
            data={data}
            extraData={state}
            renderItem={({ item: items, index: row }) => (
              <tr style={flattenCSSStyle(rowContainerStyle)}>

                {rowNumbers === true && (
                  <DataSheetCell
                    selected={isRowSelected(row)}
                    highlightColor={highlightColor}
                    onMouseDown={(e) => {
                      if (allowSelection) setState(state => ({
                        ..._.omit(state, 'editing'),
                        _selectRows: { start: row, end: row },
                        shiftKey: e.shiftKey,
                        metaKey: e.metaKey,
                      }))
                    }}
                    onMouseOver={(e) => {
                      if (allowSelection) setState(state => ({
                        ..._.omit(state, 'editing'),
                        ...state._selectRows ? { _selectRows: { start: state._selectRows.start, end: row } } : {},
                        shiftKey: e.shiftKey,
                        metaKey: e.metaKey,
                      }))
                    }}
                    style={flattenCSSStyle([{
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
                    }, stickyRowNumberStyle, itemContainerStyle])}
                    selectedStyle={flattenCSSStyle([{
                      padding: 4,
                      overflow: 'hidden',
                      borderTop: 0,
                      borderLeft: 1,
                      borderBottom: 1,
                      borderRight: 1,
                      borderStyle: 'double',
                      borderColor: '#2185D0',
                      backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
                    }, stickyRowNumberStyle, selectedItemContainerStyle])}>
                    <Text classes='font-monospace'>{row + 1}</Text>
                  </DataSheetCell>
                )}

                <List
                  data={_.map(columns, col => items[col])}
                  extraData={state}
                  renderItem={({ item, index: col }) => (
                    <DataSheetCell
                      ref={isCellEditing(row, col) ? editingRef : undefined}
                      isEditing={isCellEditing(row, col)}
                      selected={isRowSelected(row) || isCellSelected(row, col)}
                      highlightColor={highlightColor}
                      onMouseDown={(e) => {
                        if (allowSelection) setState(state => ({
                          ..._.omit(state, 'editing'),
                          _selectStart: { row, col },
                          _selectEnd: { row, col },
                          shiftKey: e.shiftKey,
                          metaKey: e.metaKey,
                        }))
                      }}
                      onMouseOver={(e) => {
                        if (allowSelection) setState(state => ({
                          ..._.omit(state, 'editing'),
                          ...state._selectStart ? { _selectEnd: { row, col } } : {},
                          shiftKey: e.shiftKey,
                          metaKey: e.metaKey,
                        }))
                      }}
                      onDoubleClick={() => { if (_allowEditForCell(row, col)) setState({ editing: { row, col } }) }}
                      style={flattenCSSStyle([{
                        padding: 0,
                        position: 'relative',
                        cursor: 'cell',
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
                      }, itemContainerStyle])}
                      selectedStyle={flattenCSSStyle([{
                        padding: 0,
                        position: 'relative',
                        cursor: 'cell',
                        borderTop: 0,
                        borderLeft: rowNumbers === true || col != 0 ? 0 : 1,
                        borderBottom: 1,
                        borderRight: 1,
                        borderStyle: 'double',
                        borderColor: '#2185D0',
                        backgroundColor: row % 2 == 0 ? 'white' : '#F6F8FF',
                      }, selectedItemContainerStyle])}>
                      <Text classes='font-monospace'>{' '}</Text>
                      <TableCellItem
                        item={item}
                        rowIdx={row}
                        columnIdx={col}
                        isEditing={isCellEditing(row, col)}
                        renderItem={renderItem}
                      />
                    </DataSheetCell>
                  )}
                />

              </tr>
            )}
          />

          {showEmptyLastRow === true && (
            <tr style={flattenCSSStyle(rowContainerStyle)}>

              {rowNumbers === true && (
                <DataSheetCell
                  selected={isRowSelected(data.length)}
                  highlightColor={highlightColor}
                  style={flattenCSSStyle([{
                    padding: 4,
                    overflow: 'hidden',
                    borderTop: 0,
                    borderLeft: 1,
                    borderBottom: 1,
                    borderRight: 1,
                    borderStyle: 'solid',
                    borderColor: '#DDD',
                    backgroundColor: data.length % 2 == 0 ? 'white' : '#F6F8FF',
                  }, stickyRowNumberStyle, itemContainerStyle])}
                  selectedStyle={flattenCSSStyle([{
                    padding: 4,
                    overflow: 'hidden',
                    borderTop: 0,
                    borderLeft: 1,
                    borderBottom: 1,
                    borderRight: 1,
                    borderStyle: 'double',
                    borderColor: '#2185D0',
                    backgroundColor: data.length % 2 == 0 ? 'white' : '#F6F8FF',
                  }, stickyRowNumberStyle, selectedItemContainerStyle])} />
              )}

              <List
                data={columns}
                extraData={state}
                renderItem={({ index: col }) => (
                  <DataSheetCell
                    ref={isCellEditing(data.length, col) ? editingRef : undefined}
                    isEditing={isCellEditing(data.length, col)}
                    selected={isRowSelected(data.length)}
                    highlightColor={highlightColor}
                    onDoubleClick={() => { if (_allowEditForCell(data.length, col)) setState({ editing: { row: data.length, col } }) }}
                    style={flattenCSSStyle([{
                      padding: 0,
                      position: 'relative',
                      cursor: 'cell',
                      borderTop: 0,
                      borderLeft: rowNumbers === true || col != 0 ? 0 : 1,
                      borderBottom: 1,
                      borderRight: 1,
                      borderStyle: 'solid',
                      borderColor: '#DDD',
                      backgroundColor: data.length % 2 == 0 ? 'white' : '#F6F8FF',
                    }, itemContainerStyle])}
                    selectedStyle={flattenCSSStyle([{
                      padding: 0,
                      position: 'relative',
                      cursor: 'cell',
                      borderTop: 0,
                      borderLeft: rowNumbers === true || col != 0 ? 0 : 1,
                      borderBottom: 1,
                      borderRight: 1,
                      borderStyle: 'double',
                      borderColor: '#2185D0',
                      backgroundColor: data.length % 2 == 0 ? 'white' : '#F6F8FF',
                    }, selectedItemContainerStyle])}>
                    <Text classes='font-monospace'>{' '}</Text>
                    {isCellEditing(data.length, col) && (
                      <TableCellItem
                        rowIdx={data.length}
                        columnIdx={col}
                        isEditing={true}
                        renderItem={renderItem}
                      />
                    )}
                  </DataSheetCell>
                )}
              />

            </tr>
          )}

        </tbody>
      )}
    </>
  );
};
