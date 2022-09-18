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
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeVariables } from './variables';
import { shiftColor } from '../color';

const createStyle = <T extends ViewStyle | TextStyle | ImageStyle>(style: T) => StyleSheet.create({ style }).style;

const createToastColor = (theme: ThemeVariables, color: string) => ({
  color: theme.colors[color],
  messageColor: shiftColor(theme.colors[color], theme.colorWeights[800]),
  backgroundColor: shiftColor(theme.colors[color], theme.colorWeights[100]),
})

export const defaultStyle = (
  theme: ThemeVariables
) => ({

  buttonStyle: createStyle({

    textAlign: 'center',
    
    paddingHorizontal: 12,
    paddingVertical: 6,

    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,

    fontSize: theme.fontSizeBase,
    fontWeight: theme.fontWeightNormal,
    
  }),

  toastColors: {
    success: createToastColor(theme, 'success'),
    info: createToastColor(theme, 'info'),
    warning: createToastColor(theme, 'warning'),
    error: createToastColor(theme, 'error'),
  },

  toastStyle: createStyle({
    marginTop: 8,
    padding: 16,
    minWidth: 320,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),

  toastTextStyle: createStyle({
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
  }),

})

export type ThemeStyles = ReturnType<typeof defaultStyle>;
