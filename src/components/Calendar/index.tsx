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
import { View, ViewProps, Text, Pressable, Platform } from 'react-native';
import { Picker } from '../Picker';
import { useTheme } from '../../theme';
import { DateTime } from 'luxon';
import { Modify } from '../../internals/types';
import { UncontrolledTextInput } from '../UncontrolledTextInput';

import { _Date, dateToString } from './date';
import { calendarStyle } from './style';
import { CalendarBody } from './body';

import { MaterialIcons as Icon } from '../Icons';

import Localization from '../../locales';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';

const month_name = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export type CalendarValue = string | Date | DateTime;

type CalendarProps = Modify<ViewProps, {
  value?: CalendarValue | CalendarValue[];
  min?: CalendarValue;
  max?: CalendarValue;
  multiple?: boolean;
  selectable?: (date: string) => boolean;
  onChange?: (date: string[]) => void;
}>

const CalendarBase = createMemoComponent(({
  value,
  min,
  max,
  multiple,
  style,
  selectable = () => true,
  onChange
}: CalendarProps, forwardRef: React.ForwardedRef<View>) => {

  const theme = useTheme();
  const calendarWeekContainerStyle = _useComponentStyle('calendarWeekContainer');
  const calendarWeekdayStyle = _useComponentStyle('calendarWeekday');

  const locale = Localization.useLocalize();

  const _value = _.sortBy(_.castArray(value ?? []).map(x => new _Date(x)), 'year', 'month', 'day');

  const [current, setCurrent] = React.useState(() => {
    const now = DateTime.now();
    const first = _.first(_value);
    return { month: first?.month ?? now.month, year: first?.year ?? now.year }
  });

  const _selectable = React.useCallback((date: string) => {
    if (!_.isNil(min) && _Date.lessThan(date, min)) return false;
    if (!_.isNil(max) && _Date.lessThan(max, date)) return false;
    return selectable(date);
  }, [selectable, min, max]);

  return (
    <View ref={forwardRef} style={style}>
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Picker
            value={month_name[current.month - 1]}
            items={month_name.map(x => ({ label: locale.string(`calendar.months.${x}`), value: x }))}
            onValueChange={(_value, index) => setCurrent(current => ({ ...current, month: index + 1 }))}
            style={{ fontSize: theme.root.fontSize * 1.5 }} />
          <UncontrolledTextInput
            selectTextOnFocus
            keyboardType='number-pad'
            value={`${current.year}`}
            onChangeText={(text) => {
              try {
                const year = parseInt(text, 10);
                if (year >= 1970 && year < 9999) setCurrent(current => ({ ...current, year }));
              } catch { }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              padding: 0,
              paddingLeft: 8,
              borderWidth: 0,
              borderRadius: 0,
              fontSize: theme.root.fontSize * 1.5,
            }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            {...Platform.select({
              web: { tabIndex: -1 },
              default: {},
            })}
            onPress={() => {
              if (current.month === 1) {
                setCurrent(current => ({ year: current.year - 1, month: 12 }));
              } else {
                setCurrent(current => ({ ...current, month: current.month - 1 }));
              }
            }}
          ><Icon name='chevron-left' size={theme.root.fontSize * 1.5} /></Pressable>
          <Pressable
            {...Platform.select({
              web: { tabIndex: -1 },
              default: {},
            })}
            onPress={() => {
              if (current.month === 12) {
                setCurrent(current => ({ year: current.year + 1, month: 1 }));
              } else {
                setCurrent(current => ({ ...current, month: current.month + 1 }));
              }
            }}
          ><Icon name='chevron-right' size={theme.root.fontSize * 1.5} /></Pressable>
        </View>
      </View>
      <View style={[calendarStyle.weekContainer, calendarWeekContainerStyle]}>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.sunday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.monday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.tuesday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.wednesday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.thursday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.friday')}</Text>
        <Text style={textStyleNormalize([calendarStyle.weekdays, calendarWeekdayStyle])}>{locale.string('calendar.weekdays.saturday')}</Text>
      </View>
      <CalendarBody selected={_value} selectable={_selectable} onSelect={({ year, month, day }) => {
        if (!_.isFunction(onChange)) return;
        const values = _.map(_value, x => dateToString(x.year, x.month, x.day));
        const date = dateToString(year, month, day);
        if (multiple) {
          onChange(_.includes(values, date) ? values.filter(x => x !== date) : [...values, date].sort());
        } else {
          onChange(_.includes(values, date) ? [] : [date]);
        }
      }} {...current} />
    </View>
  )
}, {
  displayName: 'Calendar',
});

export const Calendar = _.assign(CalendarBase, { Date: _Date });

export default Calendar;
