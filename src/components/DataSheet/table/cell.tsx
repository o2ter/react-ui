//
//  cell.tsx
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
import { useMergeRefs } from 'sugax';
import { flattenCSSStyle } from '../styles';
import { createComponent } from '../../../internals/utils';
import { useElementLayout } from '../../../hooks/webHooks';

type DataSheetCellProps = React.ComponentPropsWithoutRef<'td'> & {
  selectedStyle?: React.CSSProperties;
  selected?: boolean;
  highlightColor: string;
  isEditing?: boolean;
};
export const DataSheetCell = createComponent(({
  style,
  selectedStyle,
  selected,
  highlightColor,
  isEditing,
  children,
  ...props
}: DataSheetCellProps, forwardRef: React.ForwardedRef<React.ComponentRef<'td'>>) => {

  const cellRef = React.useRef<React.ComponentRef<'td'>>(null);
  const ref = useMergeRefs(cellRef, forwardRef);
  const [cellHeight, setCellHeight] = React.useState(0);

  useElementLayout(cellRef, (e) => setCellHeight(e.nativeEvent?.layout?.height ?? 0));

  const _style = flattenCSSStyle([{
    zIndex: isEditing === true ? 1 : 0,
    boxShadow: selected ? `inset 0 -${cellHeight}px 0 ${highlightColor}` : undefined,
  }, selected ? selectedStyle : style]);

  return <td ref={ref} style={_style} {...props}>{children}</td>;
}, {
  displayName: 'DataSheetCell',
});
