//
//  styles.ts
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
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ThemeVariables } from '../variables';
import { ColorType, colorContrast, shiftColor, shadeColor, tintColor } from '../../color';
import { _hex } from '../../internals/color';

const memoize = <T extends (...args: any) => any>(func: T): T => _.memoize(func);

export const _colorContrast = (theme: ThemeVariables) => (background: string | ColorType) => colorContrast(
  background,
  theme.colorContrastDark,
  theme.colorContrastLight,
  theme.minContrastRatio
);

export const _simpleStyles = {

  viewStyle: {} as StyleProp<ViewStyle>,
  textStyle: {} as StyleProp<TextStyle>,

  textInputStyle: {} as StyleProp<TextStyle>,
  datePickerStyle: {} as StyleProp<TextStyle>,

  safeAreaViewStyle: {} as StyleProp<ViewStyle>,

  scrollableStyle: {} as StyleProp<ViewStyle>,
  scrollableContentContainerStyle: {} as StyleProp<ViewStyle>,

  flatlistColumnWrapperStyle: {} as StyleProp<ViewStyle>,

  refreshControlStyle: {} as StyleProp<ViewStyle>,

  activityIndicator: {} as StyleProp<ViewStyle>,
  activityIndicatorBackdrop: {} as StyleProp<ViewStyle>,

  buttonStyle: {} as StyleProp<TextStyle>,
  modalBackdrop: {} as StyleProp<ViewStyle>,

  pickerStyle: {} as StyleProp<TextStyle>,

  calendarWeekContainerStyle: {} as StyleProp<ViewStyle>,
  calendarWeekdayContainerStyle: {} as StyleProp<ViewStyle>,
  calendarWeekdayStyle: {} as StyleProp<TextStyle>,

  toastStyle: {} as StyleProp<ViewStyle>,
  toastTextStyle: {} as StyleProp<TextStyle>,

  formErrorMessageStyle: {} as StyleProp<TextStyle>,

  formCheckboxStyle: {} as StyleProp<TextStyle>,
  formCheckboxTextStyle: {} as StyleProp<TextStyle>,

  formRadioStyle: {} as StyleProp<TextStyle>,
  formRadioTextStyle: {} as StyleProp<TextStyle>,

  formPickerStyle: {} as StyleProp<TextStyle>,
  formPickerErrorStyle: {} as StyleProp<TextStyle>,

  formPlainSegmentedControlStyle: {} as StyleProp<ViewStyle>,
  formPlainSegmentedControlErrorStyle: {} as StyleProp<ViewStyle>,

  formSegmentedControlStyle: {} as StyleProp<ViewStyle>,
  formSegmentedControlErrorStyle: {} as StyleProp<ViewStyle>,

  formTextFieldStyle: {} as StyleProp<TextStyle>,
  formTextFieldErrorStyle: {} as StyleProp<TextStyle>,

  formDateStyle: {} as StyleProp<TextStyle>,
  formDateErrorStyle: {} as StyleProp<TextStyle>,

};

export const defaultStyle = (
  theme: ThemeVariables & { colorContrast: ReturnType<typeof _colorContrast> }
) => ({

  ..._simpleStyles,

  buttonColors: memoize((color: string) => ({
    color: theme.colorContrast(color),
    backgroundColor: color,
    borderColor: color,
  })),

  buttonFocusedColors: memoize((color: string) => {
    const _color = theme.colorContrast(color);
    const _color2 = _color === _hex(theme.colorContrastLight) ? shadeColor(color, 0.2) : tintColor(color, 0.2);
    return ({
      color: _color,
      backgroundColor: _color2,
      borderColor: _color2,
    });
  }),

  toastColors: memoize((color: string) => ({
    color: theme.themeColors[color] ?? theme.colors[color] ?? color,
    borderColor: theme.themeColors[color] ?? theme.colors[color] ?? color,
    messageColor: shiftColor(theme.themeColors[color] ?? theme.colors[color] ?? color, theme.colorWeights[800]),
    backgroundColor: shiftColor(theme.themeColors[color] ?? theme.colors[color] ?? color, theme.colorWeights[100]),
  })),

  formCheckboxColor: (value: boolean) => value ? theme.themeColors.primary : theme.grays['600'],

  formRadioColor: (value: boolean) => value ? theme.themeColors.primary : theme.grays['600'],

})

export type ThemeStyles = ReturnType<typeof defaultStyle>;
export type ThemeStylesProvider = (...theme: Parameters<typeof defaultStyle>) => Partial<ThemeStyles>;
