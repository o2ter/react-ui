//
//  date.tsx
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
import { useTheme } from '../../theme';
import { Calendar, CalendarValue } from '../Calendar';
import { PickerBase } from './picker';
import { Modify } from '../../internals/types';
import { useDefaultInputStyle } from '../TextInput/style';
import { createMemoComponent } from '../../internals/utils';
import { ClassNames, _useComponentStyle } from '../Style';
import { useFocus, useFocusRing } from '../../internals/focus';
import { StyleProp, TextStyle } from 'react-native';

type DatePickerState = {
  value?: CalendarValue | CalendarValue[];
  focused: boolean;
  disabled: boolean;
};

type DatePickerBaseProps = Pick<React.ComponentPropsWithoutRef<typeof Calendar>, 'value' | 'min' | 'max' | 'multiple' | 'selectable' | 'onChange'>;
type DatePickerProps = Modify<Modify<React.ComponentPropsWithoutRef<typeof PickerBase>, DatePickerBaseProps>, {
  variant?: 'outline' | 'underlined' | 'unstyled';
  style?: StyleProp<TextStyle> | ((state: DatePickerState) => StyleProp<TextStyle>);
  children?: React.ReactNode | ((state: DatePickerState) => React.ReactNode);
  prepend?: React.ReactNode | ((state: DatePickerState) => React.ReactNode);
  append?: React.ReactNode | ((state: DatePickerState) => React.ReactNode);
}>;

export const DatePicker = createMemoComponent((
  {
    classes,
    value,
    min,
    max,
    multiple,
    prepend,
    append,
    style,
    variant,
    disabled = false,
    onChange,
    onFocus,
    onBlur,
    selectable = () => true,
    children,
    ...props
  }: DatePickerProps & { classes?: ClassNames; },
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof PickerBase>>
) => {

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const datePickerStyle = _useComponentStyle('datePicker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  const date = _.castArray(value ?? []).map(x => new Calendar.Date(x));

  const _Calendar = React.useCallback(() => {
    const [_value, setValue] = React.useState(value);
    React.useEffect(() => { if (_value !== value) onChange?.(_value as any); }, [_value]);
    return (
      <Calendar
        value={_value}
        min={min}
        max={max}
        multiple={multiple}
        onChange={setValue}
        selectable={selectable}
        style={{
          width: '80%',
          maxWidth: 350,
          backgroundColor: 'white',
        }}
      />
    );
  }, [value]);

  const focusRing = useFocusRing(focused);

  const state = { focused, disabled, value };

  return (
    <PickerBase
      ref={forwardRef}
      disabled={disabled}
      style={[
        defaultStyle,
        focusRing,
        datePickerStyle,
        _.isFunction(style) ? style(state) : style,
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      picker={<_Calendar />}
      prepend={_.isFunction(prepend) ? prepend(state) : prepend}
      append={_.isFunction(append) ? append(state) : append}
      {...props}
    >
      {_.isFunction(children) ? children(state) : children ?? date.map(x => x.toString()).join(', ')}
    </PickerBase>
  )
}, {
  displayName: 'DatePicker',
});

export default DatePicker;