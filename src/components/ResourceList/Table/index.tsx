//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2023 O2ter Limited. All rights reserved.
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
import { useStableCallback, useStableRef } from 'sugax';
import { ListTableContext } from './provider';

type ListTableProps<T, A> = {
  filter?: (resource: any, state: ReturnType<typeof useList>) => any;
  attributes: A[];
  hideRowIndex?: boolean;
  keyExtractor?: (item: T, index: number, data: ArrayLike<any>) => string;
  renderItem: (info: { item: T, index: number, data: ArrayLike<any>, attr: A }) => React.ReactNode;
  ListComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  HeaderComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  HeaderColumnComponent?: React.ComponentType<React.PropsWithChildren<{ attr?: A; data: ArrayLike<any>; }>>;
  BodyComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  BodyRowComponent?: React.ComponentType<React.PropsWithChildren<{ item: T; index: number; data: ArrayLike<any>; }>>;
  BodyColumnComponent?: React.ComponentType<React.PropsWithChildren<{ item: T; index: number; attr?: A; data: ArrayLike<any>; }>>;
}

export const ListTable = <Item = any, Attr extends string | { label: string } = any>({
  filter,
  attributes,
  hideRowIndex,
  keyExtractor = (item: any) => {
    if (_.isString(item.key)) return item.key;
    if (_.isString(item.id)) return item.id;
  },
  renderItem,
  ListComponent,
  HeaderComponent,
  HeaderColumnComponent,
  BodyComponent,
  BodyRowComponent,
  BodyColumnComponent,
}: ListTableProps<Item, Attr>) => {

  const state = useList();
  const tableId = React.useId();

  const attrs = _.map(attributes, attr => ({
    label: _.isString(attr) ? attr : attr.label,
    attr,
  }));

  const _renderItem = useStableCallback(renderItem);
  
  const components = React.useContext(ListTableContext);

  const {
    ListComponent: _ListComponent,
    HeaderComponent: _HeaderComponent,
    HeaderColumnComponent: _HeaderColumnComponent,
    BodyComponent: _BodyComponent,
    BodyRowComponent: _BodyRowComponent,
    BodyColumnComponent: _BodyColumnComponent,
  } = React.useMemo(() => ({
    ListComponent: ListComponent ?? components.ListComponent,
    HeaderComponent: HeaderComponent ?? components.HeaderComponent,
    HeaderColumnComponent: HeaderColumnComponent ?? components.HeaderColumnComponent,
    BodyComponent: BodyComponent ?? components.BodyComponent,
    BodyRowComponent: BodyRowComponent ?? components.BodyRowComponent,
    BodyColumnComponent: BodyColumnComponent ?? components.BodyColumnComponent,
  }), [components]);

  const _resource = React.useMemo(() => {
    const _resource = _.isFunction(filter) ? filter(state.resource, state) : state.resource;
    return _.isArrayLike(_resource) ? _resource as ArrayLike<any> : _.castArray(_resource ?? []);
  }, [state]);

  return (
    <_ListComponent data={_resource}>
      <_HeaderComponent data={_resource}>
        {!hideRowIndex && <_HeaderColumnComponent data={_resource}>#</_HeaderColumnComponent>}
        {_.map(attrs, ({ label, attr }) => <_HeaderColumnComponent key={`${tableId}_th_${label}`} attr={attr} data={_resource}>{label}</_HeaderColumnComponent>)}
      </_HeaderComponent>
      <_BodyComponent data={_resource}>
        {_.map(_resource, (item, i, data) => {
          const id = keyExtractor(item, i, data) ?? `${tableId}_${i}`;
          return (
            <_BodyRowComponent key={id} item={item} index={i} data={_resource}>
              {!hideRowIndex && <_BodyColumnComponent item={item} index={i} data={_resource}>{i + 1}</_BodyColumnComponent>}
              {_.map(attrs, ({ label, attr }) => <_BodyColumnComponent key={`${id}_${label}`} item={item} index={i} attr={attr} data={_resource}>
                {_renderItem({ item, index: i, data, attr })}
              </_BodyColumnComponent>)}
            </_BodyRowComponent>
          )
        })}
      </_BodyComponent>
    </_ListComponent>
  );
}

export default ListTable;
