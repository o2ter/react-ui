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
import { LayoutRectangle, Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { ListProps, SelectOption } from './types';
import { _useComponentStyle } from '../Style';
import { _useToggleAnim, _AnimatedPressable } from '../_Animated';
import { rgba } from '../../internals/color';
import { useTheme } from '../../theme';
import SectionList from '../SectionList';
import { MaterialIcons as Icon } from '../Icons';
import Text from '../Text';
import View from '../View';

type SelectListBodyProps<T> = Omit<ListProps<T>, 'renderItem'> & {
  value?: T[];
  layout: LayoutRectangle;
  theme: ReturnType<typeof useTheme>;
  onSelect: (option: SelectOption<T>) => void
};

type SelectListListItemProps<T> = SelectOption<any> & {
  selected: boolean;
  theme: ReturnType<typeof useTheme>;
  onPress: () => void;
};

const SelectListListItem = <T = any>({
  classes,
  label,
  selected,
  style,
  theme,
  prepend,
  render,
  onPress,
}: SelectListListItemProps<T>) => {

  const [state, setState] = React.useState({ hovered: false, pressed: false, focused: false });
  const _focused = state.hovered || state.pressed || state.focused;

  const fadeAnim = _useToggleAnim({
    value: _focused,
    timing: {
      duration: theme.buttonDuration,
      easing: theme.buttonEasing,
      useNativeDriver: false,
    },
  });

  const selectStyle = _useComponentStyle('selectItem', classes, [
    selected && 'checked',
    state.hovered && 'hover',
    state.pressed && 'active',
    state.focused && 'focus',
  ]);

  const _state = { ...state, selected };

  return (
    <_AnimatedPressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacer * 0.375,
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [rgba(theme.grays['200'], 0), rgba(theme.grays['200'])],
          }),
          borderRadius: theme.borderRadiusBase,
          paddingHorizontal: 8,
          paddingVertical: 4,
          margin: 2,
        },
        Platform.select({
          web: { outline: 0 } as any,
          default: {},
        }),
        selectStyle,
        _.isFunction(style) ? style(_state) : style,
      ]}
      onPress={onPress}
      onPressIn={() => { setState(state => ({ ...state, pressed: true })); }}
      onPressOut={() => { setState(state => ({ ...state, pressed: false })); }}
      onHoverIn={() => { setState(state => ({ ...state, hovered: true })); }}
      onHoverOut={() => { setState(state => ({ ...state, hovered: false })); }}
      onFocus={() => { setState(state => ({ ...state, focused: true })); }}
      onBlur={() => { setState(state => ({ ...state, focused: false })); }}
    >
      {prepend}
      <View style={{ flex: 1 }}>
        {_.isFunction(render) ? render(_state) : (
          <Text>{label}</Text>
        )}
      </View>
      {selected && <Icon color={theme.themeColors.primary} size={16} name='done' />}
    </_AnimatedPressable>
  );
}

export const SelectListBody = ({
  value,
  layout,
  theme,
  sections = [],
  onSelect,
  ...props
}: SelectListBodyProps<any>) => {

  const isSection = sections.length === 1 && !_.isEmpty(sections[0].label);
  const windowDimensions = useWindowDimensions();

  return (
    <SectionList
      sections={sections}
      style={{
        minWidth: layout.width,
        maxHeight: 0.5 * windowDimensions.height,
      }}
      contentContainerStyle={{
        padding: 4,
      }}
      renderSectionHeader={isSection ? (
        ({ section }) => (
          <Text
            style={{
              color: theme.grays['300'],
              fontSize: theme.fontSizes['small'],
              margin: 4,
            }}
          >{section.label}</Text>
        )
      ) : undefined}
      renderItem={({ item }) => (
        <SelectListListItem
          theme={theme}
          selected={_.some(value, x => item.value === x)}
          onPress={() => onSelect(item)}
          {...item}
        />
      )}
      {...props}
    />
  );
};
