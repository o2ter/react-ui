//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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
import { useStableCallback, useStableRef } from 'sugax';
import { useField } from '../Form/hooks';
import List from '../../List';
import { createMemoComponent } from '../../../internals/utils';

const FormListContext = React.createContext<{
  create: (item: any, index?: number) => void;
  remove: (index: number) => void;
}>({
  create: () => { },
  remove: () => { },
});

FormListContext.displayName = 'Form.ListContext';

export const useFormList = () => React.useContext(FormListContext);

type ListComponentProps = React.PropsWithChildren<{
  data: any[];
  actions: ReturnType<typeof useFormList>;
}>;

type FormListProps = {
  name: string | string[];
  extraData?: any;
  keyExtractor?: (item: any, index: number, data: any[]) => string;
  renderItem: (x: { item: any, index: number, data: any[], actions: ReturnType<typeof useFormList> }) => any;
  validate?: (value: any) => void;
  ListComponent?: React.ComponentType<ListComponentProps>;
}

export const FormList = createMemoComponent(({
  name,
  extraData,
  keyExtractor,
  renderItem,
  validate,
  ListComponent = ({ children }) => <>{children}</>,
}: FormListProps, forwardRef: React.ForwardedRef<ReturnType<typeof useFormList>>) => {

  const { value, onChange, useValidator } = useField(name);
  const data = React.useMemo(() => _.castArray(value ?? []), [value]);

  useValidator(validate);

  const actions = React.useMemo(() => ({
    create: (item: any, index?: number) => {
      onChange((x: any) => {
        const result = [..._.castArray(x ?? [])];
        result.splice(index ?? result.length, 0, item);
        return result;
      });
    },
    remove: (index: number) => {
      onChange((x: any) => _.castArray(x ?? []).filter((v, i) => i !== index));
    },
  }), []);

  const stableRef = useStableRef({ renderItem });

  const _ListComponent = useStableCallback(({
    children,
    ...props
  }: ListComponentProps) => (
    <ListComponent {...props}>{children}</ListComponent>
  ));
  const _renderItem = React.useCallback((x: { item: any, index: number, data: any[] }) => stableRef.current.renderItem({ ...x, actions }), [actions]);

  React.useImperativeHandle(forwardRef, () => actions, [actions]);

  return (
    <FormListContext.Provider value={actions}>
      <_ListComponent data={data} actions={actions}>
        <List data={data} extraData={extraData} keyExtractor={keyExtractor} renderItem={_renderItem} />
      </_ListComponent>
    </FormListContext.Provider>
  );
}, {
  displayName: 'Form.List'
});

export default FormList;