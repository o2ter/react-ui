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
import { Form } from '../../Form';
import { useAsyncResource } from 'sugax';

type ListState = ReturnType<typeof useAsyncResource<any[]>>;

const ListContext = React.createContext<ListState>({
  loading: false,
  resource: undefined,
  error: undefined,
  refresh: async () => { },
});

const ListContent: React.FC<{
  resource: () => PromiseLike<any[]>;
  debounce?: _.ThrottleSettings & { wait?: number };
  children: React.ReactNode | ((state: ListState) => React.ReactNode);
}> = ({
  resource: query,
  debounce,
  children
}) => {

  const {
    loading,
    resource,
    error,
    refresh,
  } = useAsyncResource(query, debounce);

  const state = React.useMemo(() => ({ loading, resource, error, refresh }), [loading, resource, error, refresh]);

  return (
    <ListContext.Provider value={state}>
      {_.isFunction(children) ? children(state) : children}
    </ListContext.Provider>
  );
}

export const useList = () => React.useContext(ListContext);

export const List: React.FC<{
  resource: (state: Record<string, any>) => PromiseLike<any[]>;
  debounce?: _.ThrottleSettings & { wait?: number };
  children: React.ReactNode | ((state: ListState) => React.ReactNode);
}> = ({ resource, ...props }) => <Form>{state => <ListContent resource={() => resource(state.values)} {...props} />}</Form>;

export default List;