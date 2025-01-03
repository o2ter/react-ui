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
import { DataSheetProps } from './types';
import { DataSheetStateProvider } from './provider/state';
import { DataSheetTable } from './table/table';
import { DataSheetRefProvider } from './provider/ref';
import { createMemoComponent } from '../../internals/utils';

export const DataSheet = createMemoComponent(<T extends object>({
  columnMinWidth = 64,
  rowNumbers = true,
  startRowNumber = 1,
  stickyHeader = true,
  stickyRowNumbers = true,
  allowSelection = true,
  allowEditForCell = true,
  ...props
}: DataSheetProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof DataSheetTable>>,
) => {

  return (
    <DataSheetRefProvider>
      <DataSheetStateProvider>
        <DataSheetTable
          ref={forwardRef}
          columnMinWidth={columnMinWidth}
          rowNumbers={rowNumbers}
          startRowNumber={startRowNumber}
          stickyHeader={stickyHeader}
          stickyRowNumbers={stickyRowNumbers}
          allowSelection={allowSelection}
          allowEditForCell={allowEditForCell}
          {...props}
        />
      </DataSheetStateProvider>
    </DataSheetRefProvider>
  );
}, {
  displayName: 'DataSheet',
});

export default DataSheet;