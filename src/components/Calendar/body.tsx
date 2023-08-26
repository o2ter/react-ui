//
//  body.tsx
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
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { useTheme } from '../../theme';
import { DateTime } from 'luxon';

import { _Date, dateToString } from './date';
import { calendarStyle } from './style';
import { useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';

export const CalendarBody: React.FC<{
  selected: _Date[];
  month: number;
  year: number;
  selectable: (date: string) => boolean;
  onSelect: (date: { year: number; month: number; day: number; }) => void;
}> = ({
  selected,
  month,
  year,
  selectable,
  onSelect,
}) => {

    const id = React.useId();

    const theme = useTheme();
    const calendarWeekdayStyle = useComponentStyle('calendarWeekday');
    const calendarWeekContainerStyle = useComponentStyle('calendarWeekContainer');
    const calendarWeekdayContainerStyle = useComponentStyle('calendarWeekdayContainer');
  
    const monthObj = DateTime.fromObject({ year, month, day: 1 } as any);
    const daysInMonth = monthObj.daysInMonth;
    const weekdayStart = monthObj.weekday % 7;

    const _selected = selected.filter(x => x.year === year && x.month === month);

    const rows = [];
    let current_row = [];
    for (const day of _.range(1, daysInMonth + 1)) {
      if (day == 1 && weekdayStart > 0) {
        current_row.push(<View key={`${id}-padding-start`} style={{ flex: weekdayStart }} />);
      }
      if (!_.isEmpty(current_row) && (day + weekdayStart - 1) % 7 == 0) {
        rows.push(<View key={`${id}-row-${rows.length}`} style={[calendarStyle.weekContainer, calendarWeekContainerStyle]}>{current_row}</View>);
        current_row = [];
      }
      const selected = _selected.find(x => x.day === day);
      current_row.push(
        <Pressable
          key={`${id}-day-${day}`}
          style={[calendarStyle.weekdayContainer, calendarWeekdayContainerStyle]}
          onPress={() => { if (selectable(dateToString(year, month, day))) onSelect({ year, month, day }) }}>
          {selected && (
            <Svg viewBox='0 0 100 100' style={[{ zIndex: -1 }, StyleSheet.absoluteFill]}>
              <Circle cx={50} cy={50} r={40} fill={theme.themeColors.primary} />
            </Svg>
          )}
          <Text style={textStyleNormalize([
            calendarStyle.weekdays,
            calendarWeekdayStyle,
            selectable(dateToString(year, month, day)) ? {} : { color: theme.grays['500'] },
            selected ? { color: theme.colorContrast(theme.themeColors.primary) } : {},
          ])}>{day}</Text>
        </Pressable>
      );
    }
    if ((daysInMonth + weekdayStart) % 7 != 0) {
      current_row.push(<View key={`${id}-padding-end`} style={{ flex: 7 - (daysInMonth + weekdayStart) % 7 }} />);
    }
    rows.push(<View key={`${id}-row-${rows.length}`} style={[calendarStyle.weekContainer, calendarWeekContainerStyle]}>{current_row}</View>);

    return <React.Fragment>{rows}</React.Fragment>;
  };
