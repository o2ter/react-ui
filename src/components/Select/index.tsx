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
import { Platform, StyleProp, TextStyle } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames, _useComponentStyle, _StyleContext } from '../Style';
import { Pressable } from '../Pressable';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import Text from '../Text';
import { Popover } from '../Popover';
import { useDefaultInputStyle } from '../TextInput/style';
import { ListProps, SelectOption, SelectState } from './types';
import { SelectListBody } from './list';
import { useMergeRefs, useStableCallback } from 'sugax';
import { MaterialIcons as Icon } from '../Icons';
import View from '../View';
import List from '../List';

type SelectPosition = 'top' | 'bottom';

type SelectProps<T> = {
  classes?: ClassNames;
  value?: T[];
  options: SelectOption<T>[] | {
    label: string;
    options: SelectOption<T>[];
  }[];
  disabled?: boolean;
  multiple?: boolean;
  arrow?: boolean;
  shadow?: boolean | number;
  variant?: 'outline' | 'underlined' | 'unstyled';
  position?: SelectPosition | SelectPosition[];
  style?: StyleProp<TextStyle> | ((state: SelectState<T>) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: SelectState<T>) => React.ReactNode);
  append?: React.ReactNode | ((state: SelectState<T>) => React.ReactNode);
  onValueChange?: (value: T[]) => void;
  onChange?: (selected: SelectOption<T>[]) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
  render?: (state: SelectState<T>) => React.ReactNode;
  listProps?: Omit<ListProps<T>, 'renderItem'>;
};

type SelectBodyProps<T> = {
  value?: SelectOption<T>[];
  multiple?: boolean;
  onRemove: (item: SelectOption<T>) => void
};

const SelectBody = <T = any>({
  value,
  multiple,
  onRemove,
}: SelectBodyProps<T>) => {
  const theme = useTheme();
  if (multiple && !_.isEmpty(value)) {
    return (
      <View style={{
        flexDirection: 'row',
        maxWidth: '100%',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <List
          data={value ?? []}
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
                <Icon color={theme.grays['400']} size={16} name='close' />
              </Pressable>
            </View>
          )}
        >
        </List>
      </View>
    );
  }
  return (
    <Text>{_.first(value)?.label || ' '}</Text>
  );
}

const findItems = <T = any>(
  value: T[],
  options: SelectOption<T>[],
) => _.compact(_.map(value, x => _.find(options, o => o.value === x)));

export const Select = createMemoComponent(<T = any>(
  {
    classes,
    value,
    options,
    disabled = false,
    multiple,
    arrow,
    shadow,
    style,
    variant,
    position = 'bottom',
    onValueChange = () => { },
    onChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    prepend,
    append,
    render,
    listProps = {},
  }: SelectProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const pressableRef = React.useRef<React.ComponentRef<typeof Pressable>>();
  const ref = useMergeRefs(pressableRef, forwardRef);

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textStyle = _useComponentStyle('text');
  const selectStyle = _useComponentStyle('select', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const focusRing = useFocusRing(focused);

  const state = { focused, disabled, value: value ?? [] };

  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    if (focused && !disabled) setHidden(false);
  }, [focused, disabled]);

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
    onValueChange(_.map(selected, x => x.value));
    onChange(selected);
  });

  return (
    <_StyleContext.Consumer>
      {(_style) => (
        <Popover
          hidden={hidden && !_.isEmpty(sections)}
          position={position}
          arrow={arrow ?? false}
          shadow={shadow ?? false}
          onTouchOutside={(e) => {
            if (pressableRef.current === e.target as any) return;
            setHidden(true);
          }}
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
                value={value}
                layout={layout}
                theme={theme}
                sections={sections}
                extraData={extraData}
                onSelect={(v) => {
                  const _value = multiple
                    ? _.includes(value, v.value) ? _.filter(value, x => x !== v.value) : [...value ?? [], v.value]
                    : [v.value];
                  const selected = findItems(_value, _.flatMap(sections, x => x.data));
                  _onChange(selected);
                }}
                {...listProps}
              />
            </_StyleContext.Provider>
          )}
        >
          <Pressable
            ref={ref}
            style={[
              defaultStyle,
              {
                flexDirection: 'row',
                gap: theme.spacer * 0.375,
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
            onFocus={_onFocus}
            onBlur={_onBlur}
          >
            {_.isFunction(prepend) ? prepend(state) : prepend}
            {_.isFunction(render) ? render(state) : (
              <SelectBody
                multiple={multiple}
                value={findItems(value ?? [], _.flatMap(sections, x => x.data))}
                onRemove={(v) => { 
                  const _value = _.filter(value, x => x !== v.value);
                  const selected = findItems(_value, _.flatMap(sections, x => x.data));
                  _onChange(selected);
                }}
              />
            )}
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