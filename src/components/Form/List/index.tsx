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
import React, { ComponentPropsWithRef } from 'react';
import { useStableRef } from 'sugax';
import { useField } from '../Form';
import List from '../../List';
import { Modify } from '../../../internals/types';

const FormListContext = React.createContext<{
  onCreate: () => void;
  onRemove: (index: number) => void;
}>({
  onCreate: () => { },
  onRemove: () => { },
});

export const useFormList = () => React.useContext(FormListContext);

type FormListProps = Modify<_.Omit<ComponentPropsWithRef<typeof List<any>>, 'data'>, {
  name: string | string[];
  onCreate?: () => any;
}>

export const FormList = React.forwardRef<ReturnType<typeof useFormList>, FormListProps>(({
  name,
  onCreate,
  ...props
}, forwardRef) => {

  const { value, onChange } = useField(name);
  const data = React.useMemo(() => _.castArray(value ?? []), [value]);

  const stableRef = useStableRef({ onCreate });

  const actions = React.useMemo(() => ({
    onCreate: () => {
      const { onCreate } = stableRef.current;
      if (_.isFunction(onCreate)) onChange((x: any) => [..._.castArray(x ?? []), onCreate()]);
    },
    onRemove: (index: number) => {
      onChange((x: any) => _.castArray(x ?? []).filter((v, i) => i !== index))
    },
  }), []);

  React.useImperativeHandle(forwardRef, () => actions, [actions]);

  return (
    <FormListContext.Provider value={actions}>
      <List data={data} {...props} />
    </FormListContext.Provider>
  );
});

export default FormList;