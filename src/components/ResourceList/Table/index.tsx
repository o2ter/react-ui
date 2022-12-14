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

const defaultListComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <table>{children}</table>;
const defaultHeaderComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <thead><tr>{children}</tr></thead>;
const defaultHeaderColumnComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <th>{children}</th>;
const defaultBodyComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <tbody>{children}</tbody>;
const defaultBodyRowComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <tr>{children}</tr>;
const defaultBodyColumnComponent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => <td>{children}</td>;

type ListAttributeType = string | { label: string };

export const ListTable: React.FC<{
  attributes: ListAttributeType[];
  keyExtractor?: (item: any, index: number) => string;
  renderItem: (info: { item: any, index: number, attr: ListAttributeType }) => React.ReactNode;
  ListComponent?: React.ComponentType<any>;
  HeaderComponent?: React.ComponentType<any>;
  HeaderColumnComponent?: React.ComponentType<any>;
  BodyComponent?: React.ComponentType<any>;
  BodyRowComponent?: React.ComponentType<any>;
  BodyColumnComponent?: React.ComponentType<any>;
}> = ({
  attributes,
  keyExtractor = (item) => {
    if (_.isString(item.key)) return item.key;
    if (_.isString(item.id)) return item.id;
  },
  renderItem,
  ListComponent = defaultListComponent,
  HeaderComponent = defaultHeaderComponent,
  HeaderColumnComponent = defaultHeaderColumnComponent,
  BodyComponent = defaultBodyComponent,
  BodyRowComponent = defaultBodyRowComponent,
  BodyColumnComponent = defaultBodyColumnComponent,
}) => {

  const { resource } = useList();
  const tableId = React.useId();

  const attrs = _.map(attributes, attr => ({
    label: _.isString(attr) ? attr : attr.label,
    attr,
  }));

  return (
    <ListComponent>
      <HeaderComponent>
        <HeaderColumnComponent>#</HeaderColumnComponent>
        {_.map(attrs, ({ label }) => <HeaderColumnComponent key={`${tableId}_th_${label}`}>{label}</HeaderColumnComponent>)}
      </HeaderComponent>
      <BodyComponent>
        {_.map(resource, (item, i) => {
          const id = keyExtractor(item, i) ?? `${tableId}_${i}`;
          return (
            <BodyRowComponent key={id}>
              <BodyColumnComponent>{i + 1}</BodyColumnComponent>
              {_.map(attrs, ({ label, attr }) => <BodyColumnComponent key={`${id}_${label}`}>{renderItem({ item, index: i, attr })}</BodyColumnComponent>)}
            </BodyRowComponent>
          )
        })}
      </BodyComponent>
    </ListComponent>
  );
}

export default ListTable;
