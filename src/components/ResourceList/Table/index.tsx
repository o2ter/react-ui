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
import { useStableRef } from 'sugax';

type ListTableProps<T, A> = {
  filter?: (resource: any, state: ReturnType<typeof useList>) => any;
  attributes: A[];
  keyExtractor?: (item: T, index: number) => string;
  renderItem: (info: { item: T, index: number, attr: A }) => React.ReactNode;
  ListComponent?: React.ComponentType<React.PropsWithChildren>;
  HeaderComponent?: React.ComponentType<React.PropsWithChildren>;
  HeaderColumnComponent?: React.ComponentType<React.PropsWithChildren>;
  BodyComponent?: React.ComponentType<React.PropsWithChildren>;
  BodyRowComponent?: React.ComponentType<React.PropsWithChildren>;
  BodyColumnComponent?: React.ComponentType<React.PropsWithChildren>;
}

export const ListTable = <Item = any, Attr extends string | { label: string } = any>({
  filter,
  attributes,
  keyExtractor = (item: any) => {
    if (_.isString(item.key)) return item.key;
    if (_.isString(item.id)) return item.id;
  },
  renderItem,
  ListComponent = ({ children }) => <table>{children}</table>,
  HeaderComponent = ({ children }) => <thead><tr>{children}</tr></thead>,
  HeaderColumnComponent = ({ children }) => <th>{children}</th>,
  BodyComponent = ({ children }) => <tbody>{children}</tbody>,
  BodyRowComponent = ({ children }) => <tr>{children}</tr>,
  BodyColumnComponent = ({ children }) => <td>{children}</td>,
}: ListTableProps<Item, Attr>) => {

  const state = useList();
  const tableId = React.useId();

  const attrs = _.map(attributes, attr => ({
    label: _.isString(attr) ? attr : attr.label,
    attr,
  }));

  const stableRef = useStableRef({ renderItem });

  const {
    renderItem: _renderItem,
    ListComponent: _ListComponent,
    HeaderComponent: _HeaderComponent,
    HeaderColumnComponent: _HeaderColumnComponent,
    BodyComponent: _BodyComponent,
    BodyRowComponent: _BodyRowComponent,
    BodyColumnComponent: _BodyColumnComponent,
  } = React.useMemo(() => ({
    renderItem: (x => stableRef.current.renderItem(x)) as typeof renderItem,
    ListComponent,
    HeaderComponent,
    HeaderColumnComponent,
    BodyComponent,
    BodyRowComponent,
    BodyColumnComponent,
  }), []);

  const _resource = React.useMemo(() => {
    const _resource = _.isFunction(filter) ? filter(state.resource, state) : state.resource;
    return _.isArrayLike(_resource) ? _resource : _.castArray(_resource ?? []);
  }, [state]);

  return (
    <_ListComponent>
      <_HeaderComponent>
        <_HeaderColumnComponent>#</_HeaderColumnComponent>
        {_.map(attrs, ({ label }) => <_HeaderColumnComponent key={`${tableId}_th_${label}`}>{label}</_HeaderColumnComponent>)}
      </_HeaderComponent>
      <_BodyComponent>
        {_.map(_resource as ArrayLike<any>, (item, i) => {
          const id = keyExtractor(item, i) ?? `${tableId}_${i}`;
          return (
            <_BodyRowComponent key={id}>
              <_BodyColumnComponent>{i + 1}</_BodyColumnComponent>
              {_.map(attrs, ({ label, attr }) => <_BodyColumnComponent key={`${id}_${label}`}>
                {_renderItem({ item, index: i, attr })}
              </_BodyColumnComponent>)}
            </_BodyRowComponent>
          )
        })}
      </_BodyComponent>
    </_ListComponent>
  );
}

export default ListTable;
