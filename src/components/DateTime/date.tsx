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
import { ClassNames, useComponentStyle } from '../Style';
import { useFocus, useFocusRing } from '../../internals/focus';

type DatePickerBaseProps = Pick<React.ComponentPropsWithoutRef<typeof Calendar>, 'value' | 'min' | 'max' | 'multiple' | 'selectable' | 'onChange'>;
type DatePickerProps = Modify<Modify<React.ComponentPropsWithoutRef<typeof PickerBase>, DatePickerBaseProps>, {
  children?: React.ReactNode | ((state: {
    value?: CalendarValue | CalendarValue[];
    focused: boolean;
  }) => React.ReactNode);
}>;

export const DatePicker = createMemoComponent((
  {
    classes,
    value,
    min,
    max,
    multiple,
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    selectable = () => true,
    style,
    children,
    ...props
  }: DatePickerProps & { classes?: ClassNames; },
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof PickerBase>>
) => {

  const theme = useTheme();
  const defaultStyle = useDefaultInputStyle(theme);

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const datePickerStyle = useComponentStyle('datePicker', classes, [
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

  return (
    <PickerBase
      ref={forwardRef}
      disabled={disabled}
      style={[
        defaultStyle,
        focusRing,
        datePickerStyle,
        style
      ]}
      onFocus={_onFocus}
      onBlur={_onBlur}
      picker={<_Calendar />}
      {...props}
    >
      {_.isFunction(children) ? children({ focused, value }) : children ?? date.map(x => x.toString()).join(', ')}
    </PickerBase>
  )
}, {
  displayName: 'DatePicker',
});

export default DatePicker;