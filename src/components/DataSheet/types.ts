//
//  types.ts
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
import { StyleProp, TextStyle } from 'react-native';

export type Position = { row: number; col: number; };
export type Range<T> = { start: T; end: T; };

export type DataSheetState = {
  _selectStart?: Position;
  _selectEnd?: Position;
  _selectRows?: Range<number>;
  selectedCells?: Range<Position>;
  selectedRows?: number[];
  shiftKey?: boolean;
  metaKey?: boolean;
  editing?: Position;
};

export const selectionKeys = ['_selectStart', '_selectEnd', '_selectRows', 'selectedCells', 'selectedRows'];

export type TableCellItemProps<T> = {
  item?: T;
  rowIdx: number;
  columnIdx: number;
  isEditing: boolean;
  renderItem: (x: Omit<TableCellItemProps<T>, 'renderItem'>) => React.ReactElement | undefined;
}

type DataSheetStyleProps = {
  style?: React.CSSProperties;
  headerTextStyle?: StyleProp<TextStyle>;
  headerContainerStyle?: React.CSSProperties;
  headerItemContainerStyle?: React.CSSProperties;
  rowContainerStyle?: React.CSSProperties;
  itemContainerStyle?: React.CSSProperties;
  selectedItemContainerStyle?: React.CSSProperties;
  contentContainerStyle?: React.CSSProperties;
};

export type DataSheetProps<T extends object> = DataSheetStyleProps & {
  data: T[];
  columns: (keyof T)[];
  encoders?: Record<string, (data: T[keyof T][][]) => string | Blob | PromiseLike<string | Blob>>;
  allowSelection?: boolean;
  allowEditForCell?: boolean | ((row: number, col: number) => boolean);
  columnWidth: number[];
  columnMinWidth?: number;
  rowNumbers?: boolean;
  stickyHeader?: boolean;
  stickyRowNumbers?: boolean;
  showEmptyLastRow?: boolean;
  highlightColor?: string;
  renderItem: (x: Omit<TableCellItemProps<T[keyof T]>, 'renderItem'>) => React.ReactElement | undefined;
  onColumnWidthChange?: (col: number, width: number) => void;
  onSelectionChanged?: () => void;
  onDeleteRows?: (rows: number[]) => void;
  onDeleteCells?: (cells: Range<Position>) => void;
  onCopyRows?: (rows: number[], data: Pick<T, keyof T>[]) => void;
  onCopyCells?: (cells: Range<Position>, data: Pick<T, keyof T>[]) => void;
  onPasteRows?: (rows: number[], clipboard: DataTransfer | Clipboard) => void;
  onPasteCells?: (cells: Range<Position>, clipboard: DataTransfer | Clipboard) => void;
  onEndEditing?: (row: number, col: number) => void;
};
