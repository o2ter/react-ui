//
//  state.tsx
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
import { selectionKeys, DataSheetState, Position, Range } from '../types';

const DataSheetStateContext = React.createContext<{
  state: ReturnType<typeof calculate>;
  setState: React.Dispatch<React.SetStateAction<DataSheetState>>;
}>({
  state: {},
  setState: () => { },
});

const createBound = (p1: Position, p2: Position) => ({
  start: {
    row: Math.min(p1.row, p2.row),
    col: Math.min(p1.col, p2.col),
  },
  end: {
    row: Math.max(p1.row, p2.row),
    col: Math.max(p1.col, p2.col),
  },
});

const calculate = (state: DataSheetState) => {

  const _selectedRows = state.selectedRows ?? [];
  const _selectingRows = state._selectRows ? _.range(
    Math.min(state._selectRows.start, state._selectRows.end),
    Math.max(state._selectRows.start, state._selectRows.end) + 1,
  ) : [];

  const selectedCells = state.selectedCells ? createBound(state.selectedCells.start, state.selectedCells.end) : undefined;
  const _selectingCells = state._selectStart && state._selectEnd ? createBound(state._selectStart, state._selectEnd) : undefined;

  const selectingRows = state.shiftKey ? _.union(_selectedRows, _selectingRows) : state.metaKey ? _.xor(_selectedRows, _selectingRows) : _selectingRows;
  const selectingCells = _.compact(
    state.shiftKey || state.metaKey
      ? [selectedCells, _selectingCells]
      : [_selectingCells ?? selectedCells]
  )

  const combined = _.reduce(selectingCells, (a, s) => ({
    start: {
      row: Math.min(a.start.row, s.start.row),
      col: Math.min(a.start.col, s.start.col),
    },
    end: {
      row: Math.max(a.end.row, s.end.row),
      col: Math.max(a.end.col, s.end.col),
    },
  }));

  return {
    ...state,
    ...selectingRows ? { selectingRows } : {},
    ...selectedCells ? { selectedCells } : {},
    ...selectingCells ? { selectingCells } : {},
    ...combined ? { _selectingCells: combined } : {},
  };
};

export const DataSheetStateProvider = ({
  children
}: React.PropsWithChildren<{}>) => {
  const [state, setState] = React.useState<DataSheetState>({});
  const value = React.useMemo(() => ({ state: calculate(state), setState }), [state]);
  return (
    <DataSheetStateContext.Provider value={value}>
      {children}
    </DataSheetStateContext.Provider>
  );
}

export const useDataSheetState = () => {
  const { state, setState } = React.useContext(DataSheetStateContext);
  return React.useMemo(() => ({
    state,
    setState,
    isRowSelected: (row: number) => (
      _.isEmpty(state.selectingRows) ? _.includes(state.selectedRows, row) : _.includes(state.selectingRows, row)
    ),
    isCellSelected: (row: number, col: number) => _.some(state.selectingCells, s => (
      s.start.row <= row && row <= s.end.row &&
      s.start.col <= col && col <= s.end.col
    )),
    isCellEditing: (row: number, col: number) => (
      !_.isNil(state.editing) && row === state.editing.row && col === state.editing.col
    ),
    clearSelection: () => setState(state => _.omit(state, ...selectionKeys)),
    endEditing: () => setState(state => _.omit(state, 'editing')),
  }), [state]);
};
