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
import { useAsyncResource, useMergeRefs } from 'sugax';

type ListState = ReturnType<typeof useAsyncResource<ArrayLike<any>>>;

const ListContext = React.createContext<ListState>({
  count: 0,
  loading: false,
  resource: undefined,
  error: undefined,
  refresh: async () => { },
});

type ListContentProps = {
  resource: () => PromiseLike<ArrayLike<any>>;
  debounce?: _.ThrottleSettings & { wait?: number };
  children: React.ReactNode | ((state: ListState) => React.ReactNode);
};

const ListContent = React.forwardRef<ListState, ListContentProps>(({
  resource: query,
  debounce,
  children
}, forwardRef) => {

  const {
    count,
    loading,
    resource,
    error,
    refresh,
  } = useAsyncResource(query, debounce);

  const state = React.useMemo(() => ({ count, loading, resource, error, refresh }), [count, loading, resource, error, refresh]);

  React.useImperativeHandle(forwardRef, () => state, [state]);

  return (
    <ListContext.Provider value={state}>
      {_.isFunction(children) ? children(state) : children}
    </ListContext.Provider>
  );
});

export const useList = () => React.useContext(ListContext);

type ListProps = {
  autoRefresh?: boolean;
  resource: (state: Record<string, any>) => PromiseLike<ArrayLike<any>>;
  debounce?: _.ThrottleSettings & { wait?: number };
  children: React.ReactNode | ((state: ListState) => React.ReactNode);
};

export const List = React.forwardRef<ListState, ListProps>(({
  autoRefresh,
  resource,
  ...props
}, forwardRef) => {

  const listRef = React.useRef<ListState>();
  const ref = useMergeRefs(listRef, forwardRef);

  const onChangeValues = React.useCallback(() => {
    if (autoRefresh) listRef.current?.refresh();
  }, [autoRefresh]);

  return (
    <Form onChangeValues={onChangeValues}>
      {state => <ListContent ref={ref} resource={() => resource(state.values)} {...props} />}
    </Form>
  );
});

export default List;
