//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2022 O2ter Limited. All rights reserved.
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
import { useList } from '../List';

export const ListTable: React.FC<{
  attributes: (string | { label: string })[];
  keyExtractor?: (item: any, index: number) => string;
  renderItem: (item: any, attr: string | { label: string }) => React.ReactNode;
}> = ({
  attributes,
  keyExtractor = (item) => item.key ?? item.id,
  renderItem,
}) => {

  const { resource } = useList();
  const tableId = React.useId();

  const attrs = _.map(attributes, attr => ({
    label: _.isString(attr) ? attr : attr.label,
    attr,
  }));

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          {_.map(attrs, ({ label }) => <th key={`${tableId}_th_${label}`}>{label}</th>)}
        </tr>
      </thead>
      <tbody>
        {_.map(resource, (item, i) => {
          const id = keyExtractor(item, i) ?? `${tableId}_${i}`;
          return (
            <tr key={id}>
              <td>{i + 1}</td>
              {_.map(attrs, ({ label, attr }) => <td key={`${id}_${label}`}>{renderItem(item, attr)}</td>)}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default ListTable;
