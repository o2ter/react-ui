//
//  provider.tsx
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
import { useEquivalent } from 'sugax';

type ListTableProviderProps = {
  ListComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  HeaderComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  HeaderColumnComponent?: React.ComponentType<React.PropsWithChildren<{ attr?: any; data: ArrayLike<any>; }>>;
  BodyComponent?: React.ComponentType<React.PropsWithChildren<{ data: ArrayLike<any>; }>>;
  BodyRowComponent?: React.ComponentType<React.PropsWithChildren<{ item: any; index: number; data: ArrayLike<any>; }>>;
  BodyColumnComponent?: React.ComponentType<React.PropsWithChildren<{ item: any; index: number; attr?: any; data: ArrayLike<any>; }>>;
}

export const ListTableContext = React.createContext<Required<ListTableProviderProps>>({
  ListComponent: ({ children }) => <table>{children}</table>,
  HeaderComponent: ({ children }) => <thead><tr>{children}</tr></thead>,
  HeaderColumnComponent: ({ children }) => <th className='text-nowrap'>{children}</th>,
  BodyComponent: ({ children }) => <tbody>{children}</tbody>,
  BodyRowComponent: ({ children }) => <tr>{children}</tr>,
  BodyColumnComponent: ({ children }) => <td>{children}</td>,
});

ListTableContext.displayName = 'List.TableContext';

export const ListTableProvider: React.FC<React.PropsWithChildren<ListTableProviderProps>> = ({
  children,
  ...props
}) => {
  const parent = React.useContext(ListTableContext);
  const value = React.useMemo(() => ({ ...parent, ...props }), [parent, useEquivalent(props)]);
  return <ListTableContext.Provider value={value}>{children}</ListTableContext.Provider>;
}

ListTableProvider.displayName = 'List.TableProvider';
