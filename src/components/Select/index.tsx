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
import { Platform, StyleProp, TextStyle } from 'react-native';
import { createComponent, createMemoComponent } from '../../internals/utils';
import { _useComponentStyle, _StyleContext } from '../Style';
import { ClassNames } from '../Style/types';
import { Pressable } from '../Pressable';
import { useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import { useDefaultInputStyle } from '../TextInput/style';
import { SelectOption, SelectState } from './types';
import { MaterialIcons as Icon } from '../Icons';
import { MaterialInputLabel } from '../MaterialInputLabel';
import View from '../View';
import Text from '../Text';
import List from '../List';
import SelectBase, { findItems, SelectBaseChildrenProps, SelectValue } from './base';
import { Modify } from '../../internals/types';

export { SelectBase };

type SelectProps<T, M extends boolean> = Omit<React.ComponentPropsWithoutRef<typeof SelectBase<T, M>>, 'children'> & {
  classes?: ClassNames;
  label?: string;
  labelStyle?: StyleProp<TextStyle> | ((state: SelectState<SelectValue<T, M>>) => StyleProp<TextStyle>);
  variant?: 'outline' | 'underlined' | 'unstyled' | 'material';
  style?: StyleProp<TextStyle> | ((state: SelectState<SelectValue<T, M>>) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: SelectState<SelectValue<T, M>>) => React.ReactNode);
  append?: React.ReactNode | ((state: SelectState<SelectValue<T, M>>) => React.ReactNode);
  render?: (state: SelectState<SelectValue<T, M>>) => React.ReactNode;
};

type SelectBodyProps<T> = {
  value: SelectOption<T>[];
  multiple?: boolean;
  onRemove: (item: SelectOption<T>) => void
};

const SelectBody = <T extends unknown = any>({
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
          data={value}
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
        />
      </View>
    );
  }
  return (
    <Text>{_.first(value)?.label || ' '}</Text>
  );
};

export const Select = createMemoComponent(<T extends unknown = any, M extends boolean = false>(
  props: SelectProps<T, M>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {
  const {
    classes,
    value,
    style,
    label,
    labelStyle,
    variant,
    disabled,
    multiple,
    prepend,
    append,
    render,
  } = props;
  return (
    <SelectBase {...props}>
      {({ focused, sections, onFocus, onBlur, onChange }) => {

        const theme = useTheme();
        const defaultStyle = useDefaultInputStyle(theme, variant);

        const textStyle = _useComponentStyle('text');
        const selectStyle = _useComponentStyle('select', classes, [
          focused && 'focus',
          disabled ? 'disabled' : 'enabled',
        ]);

        const focusRing = useFocusRing(focused);

        const state = {
          focused,
          disabled,
          value: multiple ? value ?? [] : value,
        } as SelectState<SelectValue<T, M>>;

        const _value = _.castArray(value ?? []) as T[];

        const content = (
          <>
            {_.isFunction(render) ? render(state) : (
              <SelectBody
                multiple={multiple}
                value={findItems(_value, _.flatMap(sections, x => x.data))}
                onRemove={(v) => {
                  const _val = _.filter(_value, x => x !== v.value);
                  const selected = findItems(_val, _.flatMap(sections, x => x.data));
                  onChange(selected);
                }}
              />
            )}
          </>
        );

        return (
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
            onFocus={onFocus}
            onBlur={onBlur}
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
        );
      }}
    </SelectBase>
  )
}, {
  displayName: 'Select',
});

export default Select;