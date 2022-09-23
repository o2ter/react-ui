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
import React from 'react';
import { View, ViewProps, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { useTheme } from '../../theme';
import { DateTime } from 'luxon';
import { Modify } from '../../internals/types';

import { _Date, dateToString } from './date';
import { calendarStyle } from './style';
import { CalendarBody } from './body';

import { MaterialCommunityIcons as Icon } from '../Icons';

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

type CalendarProps = Modify<ViewProps, {
  value?: string | DateTime;
  min?: string | DateTime;
  max?: string | DateTime;
  selectable: (date: string) => boolean;
  onChange: (date: string) => void;
}>

const CalendarBase = React.forwardRef<View, CalendarProps>(({
  value,
  min,
  max,
  style,
  selectable,
  onChange
}, forwardRef) => {

  const theme = useTheme();
  const _value = React.useMemo(() => _.isNil(value) ? undefined : new _Date(value), [value]);

  const [current, setCurrent] = React.useState(() => {
    const now = DateTime.now();
    return { month: _value?.month ?? now.month, year: _value?.year ?? now.year }
  });

  const [yearText, setYearText] = React.useState<string | null>(null);

  function submit() {

    try {

      const year = parseInt(yearText ?? '');
      if (year >= 1970 && year < 9999) setCurrent(current => ({ ...current, year }));

    } catch {}

    setYearText(null);
  }

  const _selectable = React.useMemo(() => (date: string) => {
    if (!_.isNil(min) && _Date.lessThan(date, min)) return false;
    if (!_.isNil(max) && _Date.lessThan(max, date)) return false;
    return selectable(date);
  }, [selectable, min, max]);

  return (
    <View ref={forwardRef} style={style}>
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <PickerSelect
          value={month_name[current.month - 1]}
          items={month_name.map(x => ({ label: _.upperFirst(x), value: x }))}
          placeholder={{}}
          onValueChange={(_value, index) => setCurrent(current => ({ ...current, month: index + 1 }))}
          style={{
            inputIOS: { fontSize: theme.fontSizeBase * 1.5 },
            inputAndroid: { fontSize: theme.fontSizeBase * 1.5 },
          }} />
          <TextInput
          selectTextOnFocus
          keyboardType='number-pad'
          value={yearText ?? `${current.year}`}
          onFocus={() => setYearText(`${current.year}`)}
          onChangeText={setYearText}
          onBlur={() => submit()}
          onSubmitEditing={() => submit()}
          style={{ paddingLeft: 8, fontSize: theme.fontSizeBase }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => {
            if (current.month === 1) {
              setCurrent(current => ({ year: current.year - 1, month: 12 }));
            } else {
              setCurrent(current => ({ ...current, month: current.month - 1 }));
            }
          }}><Icon name='chevron-left' size={theme.fontSizeBase * 1.5} /></Pressable>
          <Pressable onPress={() => {
            if (current.month === 12) {
              setCurrent(current => ({ year: current.year + 1, month: 1 }));
            } else {
              setCurrent(current => ({ ...current, month: current.month + 1 }));
            }
          }}><Icon name='chevron-right' size={theme.fontSizeBase * 1.5} /></Pressable>
        </View>
      </View>
      <View style={calendarStyle.weekContainer}>
        <Text style={calendarStyle.weekdays}>SU</Text>
        <Text style={calendarStyle.weekdays}>MO</Text>
        <Text style={calendarStyle.weekdays}>TU</Text>
        <Text style={calendarStyle.weekdays}>WE</Text>
        <Text style={calendarStyle.weekdays}>TH</Text>
        <Text style={calendarStyle.weekdays}>FR</Text>
        <Text style={calendarStyle.weekdays}>SA</Text>
      </View>
      <CalendarBody selected={_value} selectable={_selectable} onSelect={({ year, month, day }) => {
        onChange(dateToString(year, month, day));
      }} {...current} />
    </View>
  )
});

export const Calendar = _.assign(CalendarBase, { Date: _Date });

export default Calendar;
