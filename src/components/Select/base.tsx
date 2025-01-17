//
//  base.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { _useComponentStyle, _StyleContext } from '../Style';
import { useFocus } from '../../internals/focus';
import { useTheme } from '../../theme';
import { Popover } from '../Popover';
import { ListProps, SelectOption } from './types';
import { SelectListBody } from './list';
import { useStableCallback } from 'sugax';

type SelectPosition = 'top' | 'bottom';
type SelectAlignment = 'left' | 'right';

export type SelectValue<T, M extends boolean> = M extends true ? T[] : T | undefined;

export type SelectBaseChildrenProps<T> = {
  focused: boolean;
  sections: {
    label: string;
    data: SelectOption<T>[];
  }[];
  onFocus: VoidFunction;
  onBlur: VoidFunction;
  onChange: (selected: SelectOption<T>[]) => void;
};

type SelectBaseProps<T, M extends boolean> = {
  value?: SelectValue<T, M>;
  options: SelectOption<T>[] | {
    label: string;
    options: SelectOption<T>[];
  }[];
  disabled?: boolean;
  multiple?: M;
  dismissOnSelect?: boolean;
  arrow?: boolean;
  shadow?: boolean | number;
  position?: SelectPosition | SelectPosition[];
  alignment?: SelectAlignment | SelectAlignment[];
  onValueChange?: (value: SelectValue<T, M>) => void;
  onChange?: (selected: SelectValue<SelectOption<T>, M>) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
  listProps?: Omit<ListProps<T>, 'renderItem'>;
  children: (props: SelectBaseChildrenProps<T>) => React.ReactNode;
};

export const findItems = <T extends unknown = any>(
  value: T[],
  options: SelectOption<T>[],
) => _.compact(_.map(value, x => _.find(options, o => o.value === x)));

export const SelectBase = <T extends unknown = any, M extends boolean = false>({
  value,
  options,
  disabled = false,
  multiple,
  dismissOnSelect = !multiple,
  arrow,
  shadow,
  position = ['top', 'bottom'],
  alignment = ['left', 'right'],
  onValueChange = () => { },
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  listProps = {},
  children,
}: SelectBaseProps<T, M>) => {

  const theme = useTheme();

  const [_focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);
  const [_hidden, setHidden] = React.useState(true);
  const focused = _focused || !_hidden;

  React.useEffect(() => {
    if (_focused) setHidden(false);
  }, [_focused]);

  const sections = React.useMemo(() => {

    const sections: {
      label: string;
      data: SelectOption<T>[];
    }[] = [];
    let opts: SelectOption<T>[] = [];

    for (const opt of options) {
      if ('options' in opt) {
        if (!_.isEmpty(opts)) {
          sections.push({ label: '', data: opts });
          opts = [];
        }
        if (!_.isEmpty(opt.options)) sections.push({ label: opt.label, data: opt.options });
      } else {
        opts.push(opt);
      }
    }

    if (!_.isEmpty(opts)) sections.push({ label: '', data: opts });
    return sections;

  }, [options]);

  const extraData = React.useMemo(() => [sections, value], [sections, value]);
  const _onChange = useStableCallback((selected: SelectOption<T>[]) => {
    onValueChange(multiple ? _.map(selected, x => x.value) : _.first(selected)?.value as any);
    onChange(multiple ? selected : _.first(selected) as any);
  });

  const _value = _.castArray(value ?? []) as T[];

  return (
    <_StyleContext.Consumer>
      {(_style) => (
        <Popover
          hidden={disabled || _.isEmpty(sections) ? true : !focused}
          position={position}
          alignment={alignment}
          arrow={arrow ?? false}
          shadow={shadow ?? false}
          onTouchOutside={() => setHidden(true)}
          extraData={extraData}
          containerStyle={{
            display: 'flex',
            borderColor: theme.grays['400'],
            borderWidth: theme.borderWidth,
            borderRadius: theme.borderRadiusBase,
            padding: 0,
          }}
          render={(layout) => (
            <_StyleContext.Provider value={_style}>
              <SelectListBody
                value={_value}
                layout={layout}
                theme={theme}
                sections={sections}
                extraData={extraData}
                onSelect={(v) => {
                  const _val = multiple
                    ? _.includes(_value, v.value) ? _.filter(_value, x => x !== v.value) : [..._value, v.value]
                    : [v.value];
                  const selected = findItems(_val, _.flatMap(sections, x => x.data));
                  _onChange(selected);
                  if (dismissOnSelect) setHidden(true);
                }}
                {...listProps}
              />
            </_StyleContext.Provider>
          )}
        >
          {children({
            focused,
            sections,
            onFocus: _onFocus,
            onBlur: _onBlur,
            onChange: _onChange,
          })}
        </Popover>
      )}
    </_StyleContext.Consumer>
  );
};

export default SelectBase;