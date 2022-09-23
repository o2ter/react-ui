
import _ from 'lodash';
import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../../../hooks/useTheme';
import { DateTime as dt } from 'luxon';
import uuid from 'react-native-uuid';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const style = StyleSheet.create({
  weekContainer: {
    width: '100%',
    aspectRatio: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekdayContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekdays: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledWeekdays: {
    color: '#adb5bd',
  },
})

const CalendarBody = ({
  selected,
  month,
  year,
  min,
  max,
  onSelect,
}) => {

  const id = React.useMemo(() => uuid.v4(), []);

  const theme = useTheme();

  const monthObj = dt.fromObject({ year, month, day: 1 });
  const daysInMonth = monthObj.daysInMonth;
  const weekdayStart = monthObj.weekday % 7;

  const _selected = selected?.year === year && selected?.month === month;

  function selectable(date) {
    if (min && lessThan(date, min)) return false;
    if (max && lessThan(max, date)) return false;
    return true;
  }

  const rows = [];
  let current_row = [];
  for (const day of _.range(1, daysInMonth + 1)) {
    if (day == 1 && weekdayStart > 0) {
      current_row.push(<View key={`${id}-padding-start`} style={{ flex: weekdayStart }} />);
    }
    if (!_.isEmpty(current_row) && (day + weekdayStart - 1) % 7 == 0) {
      rows.push(<View key={`${id}-row-${rows.length}`} style={style.weekContainer}>{current_row}</View>);
      current_row = [];
    }
    current_row.push(
      <Pressable
      key={`${id}-day-${day}`}
      style={style.weekdayContainer}
      onPress={() => { if (selectable(dateToString(year, month, day))) onSelect({ year, month, day }) }}>
        {_selected && selected?.day === day && (
          <Svg viewBox='0 0 100 100' style={StyleSheet.absoluteFill}>
            <Circle cx={50} cy={50} r={40} fill={theme.primary} />
          </Svg>
        )}
        <Text style={[
          style.weekdays,
          selectable(dateToString(year, month, day)) ? {} : style.disabledWeekdays,
          _selected && selected?.day === day ? { color: theme.colorContrast(theme.primary) } : {},
        ]}>{day}</Text>
      </Pressable>
    );
  }
  if ((daysInMonth + weekdayStart) % 7 != 0) {
    current_row.push(<View key={`${id}-padding-end`} style={{ flex: 7 - (daysInMonth + weekdayStart) % 7 }} />);
  }
  rows.push(<View key={`${id}-row-${rows.length}`} style={style.weekContainer}>{current_row}</View>);

  return rows;
};

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

const CalendarBase = ({
  value,
  min,
  max,
  onChange
}) => {

  const [current, setCurrent] = React.useState(() => {
    const now = dt.now();
    return { month: value?.month ?? now.month, year: value?.year ?? now.year }
  });

  const [yearText, setYearText] = React.useState(null);

  function submit() {

    try {

      const year = parseInt(yearText);
      if (year >= 1970 && year < 9999) setCurrent(current => ({ ...current, year }));

    } catch {}

    setYearText(null);
  }

  return (
    <View style={{
      width: '80%',
      maxWidth: 350,
      backgroundColor: 'white',
    }}>
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <RNPickerSelect
          value={month_name[current.month - 1]}
          items={month_name.map(x => ({ label: _.upperFirst(x), value: x }))}
          placeholder={{}}
          onValueChange={(_value, index) => setCurrent(current => ({ ...current, month: index + 1 }))}
          style={{
            inputIOS: { fontSize: 24 },
            inputAndroid: { fontSize: 24 },
          }} />
          <TextInput
          selectTextOnFocus
          keyboardType='number-pad'
          value={yearText ?? `${current.year}`}
          onFocus={() => setYearText(`${current.year}`)}
          onChangeText={setYearText}
          onBlur={() => submit()}
          onSubmitEditing={() => submit()}
          style={{ paddingLeft: 8, fontSize: 16 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => {
            if (current.month === 1) {
              setCurrent(current => ({ year: current.year - 1, month: 12 }));
            } else {
              setCurrent(current => ({ ...current, month: current.month - 1 }));
            }
          }}><Icon name='chevron-left' size={24} /></Pressable>
          <Pressable onPress={() => {
            if (current.month === 12) {
              setCurrent(current => ({ year: current.year + 1, month: 1 }));
            } else {
              setCurrent(current => ({ ...current, month: current.month + 1 }));
            }
          }}><Icon name='chevron-right' size={24} /></Pressable>
        </View>
      </View>
      <View style={style.weekContainer}>
        <Text style={style.weekdays}>SU</Text>
        <Text style={style.weekdays}>MO</Text>
        <Text style={style.weekdays}>TU</Text>
        <Text style={style.weekdays}>WE</Text>
        <Text style={style.weekdays}>TH</Text>
        <Text style={style.weekdays}>FR</Text>
        <Text style={style.weekdays}>SA</Text>
      </View>
      <CalendarBody selected={value} min={min} max={max} onSelect={({ year, month, day }) => {
        onChange(dateToString(year, month, day));
      }} {...current} />
    </View>
  )
};

export const Calendar = _.assign(CalendarBase, { Date: _Date });
