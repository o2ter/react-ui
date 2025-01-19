//
//  index.tsx
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
import { LayoutChangeEvent, Platform, StyleProp, TextStyle } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle, _StyleContext } from '../Style';
import { ClassNames } from '../Style/types';
import { Pressable } from '../Pressable';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import { Popover } from '../Popover';
import { useDefaultInputStyle } from '../TextInput/style';
import { ListProps, SelectOption, SelectState, SelectValue } from './types';
import { SelectListBody } from './list';
import { useAsyncResource, useStableCallback } from 'sugax';
import { MaterialIcons, Feather } from '../Icons';
import { MaterialInputLabel } from '../MaterialInputLabel';
import View from '../View';
import Text from '../Text';
import List from '../List';
import TextInput from '../TextInput';

type SelectPosition = 'top' | 'bottom';
type SelectAlignment = 'left' | 'right';

type _SelectOption<T> = SelectOption<T>[] | {
  label: string;
  options: SelectOption<T>[];
}[];

type SelectOptionProps<T, M extends boolean> = {
  options: _SelectOption<T>;
  fetch?: never;
  debounce?: never;
  searchInputProps?: never;
} | {
  options?: never;
  fetch: (options: {
    search: string;
    value?: SelectValue<T, M>;
    history: SelectOption<T>[];
    abortSignal: AbortSignal;
  }) => PromiseLike<_SelectOption<T>>;
  debounce?: _.DebounceSettings & {
    wait?: number;
  };
  searchInputProps?: React.ComponentPropsWithoutRef<typeof TextInput>;
};

type SelectProps<T, M extends boolean> = SelectOptionProps<T, M> & {
  classes?: ClassNames;
  value?: SelectValue<T, M>;
  disabled?: boolean;
  multiple?: M;
  dismissOnSelect?: boolean;
  arrow?: boolean;
  shadow?: boolean | number;
  label?: string;
  labelStyle?: StyleProp<TextStyle> | ((state: SelectState<T, M>) => StyleProp<TextStyle>);
  variant?: 'outline' | 'underlined' | 'unstyled' | 'material';
  position?: SelectPosition | SelectPosition[];
  alignment?: SelectAlignment | SelectAlignment[];
  style?: StyleProp<TextStyle> | ((state: SelectState<T, M>) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: SelectState<T, M>) => React.ReactNode);
  append?: React.ReactNode | ((state: SelectState<T, M>) => React.ReactNode);
  onValueChange?: (value: SelectValue<T, M>) => void;
  onChange?: (selected: SelectValue<SelectOption<T>, M>) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
  render?: (state: SelectState<T, M>) => React.ReactNode;
  listProps?: Omit<ListProps<T>, 'renderItem'>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

type SelectBodyProps<T> = {
  selected: SelectOption<T>[];
  multiple?: boolean;
  onRemove: (item: SelectOption<T>) => void
};

const SelectBody = <T extends unknown = any>({
  selected,
  multiple,
  onRemove,
}: SelectBodyProps<T>) => {
  const theme = useTheme();
  if (multiple && !_.isEmpty(selected)) {
    return (
      <View style={{
        flexDirection: 'row',
        maxWidth: '100%',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <List
          data={selected}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.grays['200'],
                borderRadius: theme.borderRadiusBase,
                paddingHorizontal: 8,
                gap: theme.spacer * 0.375,
              }}
            >
              <Text>{item.label || ' '}</Text>
              <Pressable onPress={() => onRemove(item)}>
                <MaterialIcons color={theme.grays['400']} size={16} name='close' />
              </Pressable>
            </View>
          )}
        />
      </View>
    );
  }
  return (
    <Text>{_.first(selected)?.label || ' '}</Text>
  );
}

const findItems = <T extends unknown = any>(
  value: T[],
  options: SelectOption<T>[],
) => _.compact(_.map(value, x => _.find(options, o => o.value === x) ?? { value: x }));

export const Select = createMemoComponent(<T extends unknown = any, M extends boolean = false>(
  {
    classes,
    value,
    options: _options,
    fetch,
    debounce,
    disabled = false,
    multiple,
    dismissOnSelect = !multiple,
    arrow,
    shadow,
    style,
    label,
    labelStyle,
    variant,
    position = ['top', 'bottom'],
    alignment = ['left', 'right'],
    onValueChange = () => { },
    onChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    onLayout,
    prepend,
    append,
    render,
    listProps = {},
    searchInputProps = {},
  }: SelectProps<T, M>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const [search, setSearch] = React.useState('');
  const [history, setHistory] = React.useState<SelectOption<T>[]>([]);
  const {
    resource: options = _options ?? []
  } = useAsyncResource<_SelectOption<T>>({
    fetch: async ({ abortSignal }) => fetch ? fetch({ search, history, value, abortSignal }) : _options,
    debounce,
  }, [search]);

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const [_focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);
  const [_hidden, setHidden] = React.useState(true);
  const focused = _focused || !_hidden;

  React.useEffect(() => {
    if (_focused) setHidden(false);
  }, [_focused]);

  const textStyle = _useComponentStyle('text');
  const selectStyle = _useComponentStyle('select', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const focusRing = useFocusRing(focused);

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

  const _value = _.castArray(value ?? []) as T[];
  const state = {
    focused,
    disabled,
    value: multiple ? value ?? [] : value,
    selected: findItems(_value, [...history, ..._.flatMap(sections, x => x.data)]),
  } as SelectState<T, M>;

  const extraData = React.useMemo(() => [sections, value], [sections, value]);
  const _onChange = useStableCallback((selected: SelectOption<T>[]) => {
    if (_.isFunction(fetch)) setHistory(v => _.uniq([...v, ...selected]));
    onValueChange(multiple ? _.map(selected, x => x.value) : _.first(selected)?.value as any);
    onChange(multiple ? selected : _.first(selected) as any);
  });

  const content = (
    <>
      {_.isFunction(render) ? render(state) : (
        <SelectBody
          multiple={multiple}
          selected={state.selected}
          onRemove={(v) => {
            const _val = _.filter(_value, x => x !== v.value);
            const selected = findItems(_val, [...history, ..._.flatMap(sections, x => x.data)]);
            _onChange(selected);
          }}
        />
      )}
    </>
  );

  return (
    <_StyleContext.Consumer>
      {(_style) => (
        <Popover
          hidden={disabled || (!_.isFunction(fetch) && _.isEmpty(sections)) ? true : !focused}
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
                searchComponent={({ onLayout }) => _.isFunction(fetch) && (
                  <TextInput
                    prepend={(
                      <Feather name='search' size={16} />
                    )}
                    {...searchInputProps}
                    onLayout={(e) => onLayout(e.nativeEvent.layout)}
                    value={search}
                    onChangeText={setSearch}
                    style={(state) => [
                      { margin: 8, marginBottom: 0 },
                      _.isFunction(searchInputProps.style) ? searchInputProps.style(state) : searchInputProps.style,
                    ]}
                  />
                )}
                onSelect={(v) => {
                  const _val = multiple
                    ? _.includes(_value, v.value) ? _.filter(_value, x => x !== v.value) : [..._value, v.value]
                    : [v.value];
                  const selected = findItems(_val, [...history, ..._.flatMap(sections, x => x.data)]);
                  _onChange(selected);
                  if (dismissOnSelect) setHidden(true);
                }}
                {...listProps}
              />
            </_StyleContext.Provider>
          )}
        >
          <Pressable
            ref={forwardRef}
            style={[
              defaultStyle,
              {
                flexDirection: 'row',
                gap: theme.spacer * 0.375,
                alignItems: 'center',
              },
              Platform.select({
                web: { outline: 0 } as any,
                default: {},
              }),
              focusRing,
              textStyle,
              selectStyle,
              _.isFunction(style) ? style(state) : style,
            ]}
            disabled={disabled}
            onFocus={_onFocus}
            onBlur={_onBlur}
            onLayout={onLayout}
          >
            {_.isFunction(prepend) ? prepend(state) : prepend}
            {_.includes(['material'], variant) ? (
              <View style={{ flex: 1 }}>
                <MaterialInputLabel
                  label={label ?? ''}
                  style={[
                    _.isFunction(labelStyle) ? labelStyle(state) : labelStyle,
                  ]}
                  focused={focused}
                  active={!_.isEmpty(_value)}
                />
                {content}
              </View>
            ) : content}
            {_.isFunction(append) ? append(state) : append}
          </Pressable>
        </Popover>
      )}
    </_StyleContext.Consumer>
  );
}, {
  displayName: 'Select',
});

export default Select;