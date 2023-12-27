//
//  list.tsx
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
import { LayoutRectangle, Pressable } from 'react-native';
import { useWindowDimensions } from 'react-native';
import Text from '../Text';
import SectionList from '../SectionList';
import { ListProps, SelectOption } from './types';

type SelectListBodyProps<T> = {
  value?: T[];
  layout: LayoutRectangle;
  sections: { label: string; data: SelectOption<T>[]; }[];
  extraData: any;
  listProps?: Omit<ListProps<T>, 'renderItem'>;
  onSelect: (option: SelectOption<T>) => void
};

export const SelectListBody = ({
  value,
  layout,
  sections,
  extraData,
  listProps,
  onSelect,
}: SelectListBodyProps<any>) => {

  const windowDimensions = useWindowDimensions();

  return (
    <SectionList
      sections={sections}
      extraData={extraData}
      style={{
        minWidth: layout.width,
        maxHeight: 0.5 * windowDimensions.height,
      }}
      renderSectionHeader={sections.length === 1 && !_.isEmpty(sections[0].label) ? (
        ({ section }) => <Text>{section.label}</Text>
      ) : undefined}
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item)}>
          <Text>{item.label}</Text>
        </Pressable>
      )}
      {...listProps}
    />
  );
};
