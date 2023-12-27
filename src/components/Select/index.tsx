//
//  index.tsx
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
import { Platform, StyleProp, TextStyle } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames, _useComponentStyle } from '../Style';
import { Pressable } from '../Pressable';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useTheme } from '../../theme';
import Text from '../Text';
import { Popover } from '../Popover';
import { useDefaultInputStyle } from '../TextInput/style';
import FlatList from '../FlatList';
import SectionList from '../SectionList';

type SelectState = {
  focused: boolean;
  disabled: boolean;
};

export type SelectOption<T> = {
  label?: string;
  value: T;
  prepend?: React.ReactNode;
};

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
  style?: StyleProp<TextStyle> | ((state: SelectState) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: SelectState) => React.ReactNode);
  append?: React.ReactNode | ((state: SelectState) => React.ReactNode);
  onValueChange?: (selected: SelectOption<T>[]) => void;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
  ListHeaderComponent?:
  | React.ComponentType
  | React.ReactElement
  | null
  | undefined;
  ListFooterComponent?:
  | React.ComponentType
  | React.ReactElement
  | null
  | undefined;
};

const _SelectOption = <T = any>({
  label
}: SelectOption<T>) => {

  return (
    <Text>{label}</Text>
  );
}

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
    onValueChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    prepend,
    append,
    ListHeaderComponent,
    ListFooterComponent,
  }: SelectProps<T>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Pressable>>
) => {

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textStyle = _useComponentStyle('text');
  const selectStyle = _useComponentStyle('select', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const focusRing = useFocusRing(focused);

  const state = { focused, disabled };

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

  return (
    <Popover
      hidden={hidden && !_.isEmpty(sections)}
      position={['top', 'bottom']}
      arrow={arrow ?? false}
      shadow={shadow ?? false}
      onTouchOutside={() => { setHidden(true); }}
      extraData={sections}
      containerStyle={{
        display: 'flex',
        borderColor: theme.grays['400'],
        borderWidth: theme.borderWidth,
        borderRadius: theme.borderRadiusBase,
        padding: 0,
      }}
      render={(layout) => sections.length === 1 && !_.isEmpty(sections[0].label) ? (
        <FlatList
          data={sections[0].data}
          extraData={sections}
          style={{
            minWidth: layout.width,
          }}
          renderItem={({ item }) => (
            <_SelectOption {...item} />
          )}
        />
      ) : (
        <SectionList
          sections={sections}
          extraData={sections}
          style={{
            minWidth: layout.width,
          }}
          renderSectionHeader={({ section }) => (
            <Text>{section.label}</Text>
          )}
          renderItem={({ item }) => (
            <_SelectOption {...item} />
          )}
        />
      )}
    >
      <Pressable
        ref={forwardRef}
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
        <Text style={{ flex: 1 }}>test</Text>
        {_.isFunction(append) ? append(state) : append}
      </Pressable>
    </Popover>
  );
}, {
  displayName: 'Select',
});

export default Select;