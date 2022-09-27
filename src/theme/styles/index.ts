//
//  styles.ts
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
import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { ThemeVariables } from '../variables';
import { ColorType, colorContrast, shiftColor, shadeColor, tintColor } from '../../color';
import { _hex } from '../../internals/color';

const createViewStyle = (style: ViewStyle) => StyleSheet.create({ style }).style;
const createTextStyle = (style: TextStyle) => StyleSheet.create({ style }).style;
const createNonnullableTextStyle = <T extends TextStyle>(style: T): T & TextStyle => StyleSheet.create({ style }).style;

const createToastColor = (theme: ThemeVariables, color: string) => ({
  color: theme.colors[color] ?? color,
  borderColor: theme.colors[color] ?? color,
  messageColor: shiftColor(theme.colors[color] ?? color, theme.colorWeights[800]),
  backgroundColor: shiftColor(theme.colors[color] ?? color, theme.colorWeights[100]),
});

export const _colorContrast = (theme: ThemeVariables) => (background: string | ColorType) => colorContrast(
  background,
  theme.colorContrastDark,
  theme.colorContrastLight,
  theme.minContrastRatio
)

export const defaultStyle = (
  theme: ThemeVariables & { colorContrast: ReturnType<typeof _colorContrast> }
) => ({

  activityIndicator: createViewStyle({
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  }),

  activityIndicatorBackdrop: createViewStyle({
    padding: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  }),

  buttonColors: _.memoize((color: string) => createNonnullableTextStyle({
    color: theme.colorContrast(color),
    backgroundColor: color,
    borderColor: color,
  })),

  buttonFocusedColors: _.memoize((color: string) => {
    const _color = theme.colorContrast(color);
    const _color2 = _color === _hex(theme.colorContrastLight) ? shadeColor(color, 0.2) : tintColor(color, 0.2);
    return createNonnullableTextStyle({
      color: _color,
      backgroundColor: _color2,
      borderColor: _color2,
    });
  }),

  buttonStyle: createTextStyle({
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    fontSize: theme.fontSizeBase,
    fontWeight: theme.fontWeightNormal,
  }),

  modalBackdrop: createViewStyle({
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  }),

  toastColors: {
    success: createToastColor(theme, 'success'),
    info: createToastColor(theme, 'info'),
    warning: createToastColor(theme, 'warning'),
    error: createToastColor(theme, 'error'),
  },

  toastStyle: createViewStyle({
    marginTop: 8,
    minWidth: 320,
    padding: theme.spacer,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),

  toastTextStyle: createTextStyle({
    flex: 1,
    marginHorizontal: theme.spacer * 0.5,
    fontSize: theme.fontSizeBase,
  }),

  formCheckboxStyle: createTextStyle({
    fontSize: theme.fontSizeBase,
  }),

  formCheckboxColor: (value: boolean) => value ? theme.colors.primary : theme.colors.grays['600'],

  formRadioStyle: createTextStyle({
    fontSize: theme.fontSizeLarge,
  }),

  formRadioColor: (value: boolean) => value ? theme.colors.primary : theme.colors.grays['600'],

  formPickerBackdrop: createViewStyle({
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  }),

  formPickerStyle: createTextStyle({
    fontSize: theme.fontSizeBase,
    backgroundColor: theme.colors.light,
    borderColor: theme.colors.light,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    margin: theme.spacer * 0.25,
    ...Platform.select({
      ios: { padding: 4 },
      default: {}
    }),
  }),

  formPickerErrorStyle: createTextStyle({
    borderColor: theme.colors.danger,
  }),

  formTextFieldStyle: createTextStyle({
    fontSize: theme.fontSizeBase,
    backgroundColor: theme.colors.light,
    borderColor: theme.colors.light,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    margin: theme.spacer * 0.25,
    padding: theme.spacer * 0.25,
  }),

  formTextFieldErrorStyle: createTextStyle({
    borderColor: theme.colors.danger,
  }),

  formDateStyle: createTextStyle({
    fontSize: theme.fontSizeBase,
    backgroundColor: theme.colors.light,
    borderColor: theme.colors.light,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    margin: theme.spacer * 0.25,
    padding: theme.spacer * 0.25,
  }),

  formDateErrorStyle: createTextStyle({
    borderColor: theme.colors.danger,
  }),

})

export type ThemeStyles = ReturnType<typeof defaultStyle>;
