//
//  table.tsx
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
import { DataSheetProps, selectionKeys } from '../types';
import { useDataSheetState } from '../provider/state';
import { flattenCSSStyle } from '../styles';
import { DataSheetHeader } from '../table/header';
import { DataSheetBody } from './body';
import { useDataSheetRef } from '../provider/ref';
import { createComponent } from '../../../internals/utils';
import { useDocumentEvent } from '../../../hooks/webHooks';
import { defaultEncoders } from '../encoders';

const isChildNode = (parent?: Node | null, node?: Node | EventTarget | null) => {
  if (!parent) return false;
  while (node !== document) {
    if (node === parent) {
      return true;
    }
    const parentNode = node && 'parentNode' in node ? node.parentNode : null;
    if (!parentNode) return false;
    node = parentNode;
  }
  return false;
}

const createHandle = ({ state, clearSelection, endEditing }: ReturnType<typeof useDataSheetState>) => ({
  get editing() { return !_.isNil(state.editing) },
  get selectedRows() { return _.isEmpty(state.selectedCells) ? state.selectedRows ?? [] : [] },
  get selectedCells() { return state.selectedCells; },
  clearSelection,
  endEditing,
});

export const DataSheetTable = createComponent(<T extends object>(
  props: DataSheetProps<T>,
  forwardRef: React.ForwardedRef<ReturnType<typeof createHandle>>,
) => {

  const handle = useDataSheetState();
  const { table: tableRef, editing: editingRef } = useDataSheetRef();

  React.useImperativeHandle(forwardRef, () => createHandle(handle), [handle]);

  useDocumentEvent('mousedown', (e) => {
    if (!_.isNil(editingRef?.current) && !_.isNil(handle.state.editing)) {
      if (!isChildNode(editingRef?.current, e.target)) {
        if (_.isFunction(props.onEndEditing)) props.onEndEditing(handle.state.editing.row, handle.state.editing.col);
        handle.endEditing();
      }
    }
    if (!_.isEmpty(handle.state.selectingRows) || !_.isEmpty(handle.state.selectingCells)) {
      if (!isChildNode(tableRef?.current, e.target)) {
        handle.setState(state => _.omit(state, ...selectionKeys, 'editing'));
      }
    }
  });
  useDocumentEvent('mouseup', (e) => {
    if (!_.isEmpty(handle.state.selectingRows)) {
      handle.setState(state => ({
        ..._.omit(state, ...selectionKeys, 'editing'),
        selectedRows: handle.state.selectingRows,
      }));
    } else if (!_.isEmpty(handle.state._selectingCells)) {
      handle.setState(state => ({
        ..._.omit(state, ...selectionKeys, 'editing'),
        selectedCells: handle.state._selectingCells,
      }));
    }
  });

  const encodeClipboard = (e: ClipboardEvent | KeyboardEvent, data: T[keyof T][][]) => {
    const encoders = {
      ...defaultEncoders,
      ...props.encoders ?? {},
    };
    if ('clipboardData' in e && e.clipboardData) {
      for (const [format, encoder] of _.toPairs(encoders)) {
        e.clipboardData.setData(format, encoder(data));
      }
    } else {
      navigator.clipboard.write([
        new ClipboardItem(_.mapValues(encoders, encoder => encoder(data)))
      ]);
    }
  }

  const handleCopy = (e: ClipboardEvent | KeyboardEvent) => {
    if (!props.allowSelection) return;
    const selectedRows = handle.state.selectedRows?.sort().filter(x => x < props.data.length) ?? [];
    if (!_.isEmpty(selectedRows)) {
      e.preventDefault();
      if (_.isFunction(props.onCopyRows)) {
        const _data = _.map(selectedRows, row => _.pick(props.data[row], props.columns));
        props.onCopyRows(selectedRows, _data);
      } else {
        const _data = _.map(selectedRows, row => _.map(props.columns, col => props.data[row][col]));
        encodeClipboard(e, _data);
      }
    }
    if (!_.isEmpty(handle.state.selectedCells)) {
      e.preventDefault();
      const selectedCells = handle.state.selectedCells;
      const _rows = _.range(selectedCells.start.row, selectedCells.end.row + 1);
      const _cols = _.range(selectedCells.start.col, selectedCells.end.col + 1);
      if (_.isFunction(props.onCopyCells)) {
        const _data = _.map(_rows, row => _.pick(props.data[row], _.map(_cols, col => props.columns[col])));
        props.onCopyCells(selectedCells, _data);
      } else {
        const _data = _.map(_rows, row => _.map(_cols, col => props.data[row][props.columns[col]]));
        encodeClipboard(e, _data);
      }
    }
  }

  const handlePaste = (e: ClipboardEvent | KeyboardEvent) => {
    if (!props.allowSelection) return;
    const selectedRows = handle.state.selectedRows?.sort() ?? [];
    const clipboard = 'clipboardData' in e && e.clipboardData && !_.isEmpty(e.clipboardData.types) ? e.clipboardData : navigator.clipboard;
    if (!_.isEmpty(selectedRows)) {
      e.preventDefault();
      if (_.isFunction(props.onPasteRows)) props.onPasteRows(selectedRows, clipboard);
    }
    if (!_.isEmpty(handle.state.selectedCells)) {
      e.preventDefault();
      if (_.isFunction(props.onPasteCells)) props.onPasteCells(handle.state.selectedCells, clipboard);
    }
  }

  const handleDelete = (e: KeyboardEvent) => {
    const selectedRows = handle.state.selectedRows?.sort().filter(x => x < props.data.length) ?? [];
    if (!_.isEmpty(selectedRows)) {
      e.preventDefault();
      if (_.isFunction(props.onDeleteRows)) props.onDeleteRows(selectedRows);
    }
    if (!_.isEmpty(handle.state.selectedCells)) {
      e.preventDefault();
      if (_.isFunction(props.onDeleteCells)) props.onDeleteCells(handle.state.selectedCells);
    }
  }

  useDocumentEvent('keydown', (e) => {
    if (!props.allowSelection) return;
    if (e.ctrlKey) {
      if (e.code === 'KeyC') {
        handleCopy(e);
      } else if (e.code === 'KeyV') {
        handlePaste(e);
      }
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      handleDelete(e);
    }
  });
  useDocumentEvent('copy', handleCopy);
  useDocumentEvent('paste', handlePaste);

  return (
    <table
      ref={tableRef}
      style={flattenCSSStyle([{
        borderCollapse: 'separate',
        borderSpacing: 0,
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }, props.style])}
    >
      <DataSheetHeader {...props} />
      <DataSheetBody {...props} />
    </table>
  );
}, {
  displayName: 'DataSheetTable',
});
