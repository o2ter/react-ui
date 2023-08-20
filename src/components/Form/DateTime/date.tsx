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
import { useField } from '../Form';
import { useTheme } from '../../../theme';
import { Modify } from '../../../internals/types';
import { DatePicker } from '../../DateTime';
import { createComponent } from '../../../internals/utils';

type FormDateProps = Modify<React.ComponentPropsWithoutRef<typeof DatePicker>, {
  name: string | string[];
}>;

export const FormDate = createComponent(({
  name,
  min,
  max,
  multiple,
  style,
  disabled = false,
  selectable = () => true,
  children,
  ...props
}: FormDateProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof DatePicker>>) => {

  const { value, error, touched, setTouched, onChange } = useField(name);
  const theme = useTheme();

  const _onChange = React.useCallback((value: any) => { onChange(multiple ? value : _.first(value)); setTouched(); }, []);

  return (
    <DatePicker
      ref={forwardRef}
      value={value}
      min={min}
      max={max}
      multiple={multiple}
      onChange={_onChange}
      selectable={selectable}
      disabled={disabled}
      style={[
        theme.styles.formDateStyle,
        !touched || _.isEmpty(error) ? {} : { borderColor: theme.themeColors.danger },
        !touched || _.isEmpty(error) ? {} : theme.styles.formDateErrorStyle,
        style
      ]}
      {...props} />
  )
}, {
  displayName: 'Form.Date'
});

export default FormDate;