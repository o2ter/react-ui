//
//  types.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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
import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type _ComponentStyles = {

  view?: StyleProp<ViewStyle>;
  text?: StyleProp<TextStyle>;
  image?: StyleProp<ImageStyle>;

  textInput?: StyleProp<TextStyle>;
  datePicker?: StyleProp<TextStyle>;

  safeAreaView?: StyleProp<ViewStyle>;

  scrollable?: StyleProp<ViewStyle>;
  scrollableContentContainer?: StyleProp<ViewStyle>;

  flatlistColumnWrapper?: StyleProp<ViewStyle>;

  refreshControl?: StyleProp<ViewStyle>;

  activityIndicator?: StyleProp<ViewStyle>;
  activityIndicatorBackdrop?: StyleProp<ViewStyle>;

  button?: StyleProp<TextStyle>;

  offcanvasBackdrop?: StyleProp<ViewStyle>;
  offcanvasContainer?: StyleProp<ViewStyle>;
  offcanvasLeftContainer?: StyleProp<ViewStyle>;
  offcanvasRightContainer?: StyleProp<ViewStyle>;
  offcanvasTopContainer?: StyleProp<ViewStyle>;
  offcanvasBottomContainer?: StyleProp<ViewStyle>;

  modalBackdrop?: StyleProp<ViewStyle>;
  modalContainer?: StyleProp<ViewStyle>;

  picker?: StyleProp<TextStyle>;
  select?: StyleProp<TextStyle>;
  selectItem?: StyleProp<TextStyle>;

  checkbox?: StyleProp<TextStyle>;
  radio?: StyleProp<TextStyle>;
  switch?: StyleProp<TextStyle>;

  calendarWeekContainer?: StyleProp<ViewStyle>;
  calendarWeekdayContainer?: StyleProp<ViewStyle>;
  calendarWeekday?: StyleProp<TextStyle>;

  alert?: StyleProp<ViewStyle>;
  alertText?: StyleProp<TextStyle>;

  popover?: StyleProp<ViewStyle>;
  tooltip?: StyleProp<ViewStyle>;

  formErrorMessage?: StyleProp<TextStyle>;

  formCheckbox?: StyleProp<TextStyle>;
  formRadio?: StyleProp<TextStyle>;
  formSwitch?: StyleProp<TextStyle>;
  formPicker?: StyleProp<TextStyle>;
  formSelect?: StyleProp<TextStyle>;
  formPlainSegmentedControl?: StyleProp<ViewStyle>;
  formSegmentedControl?: StyleProp<ViewStyle>;
  formTextField?: StyleProp<TextStyle>;
  formDate?: StyleProp<TextStyle>;

};

type _Selector = 'active' | 'hover' | 'focus' | 'checked' | 'invalid' | 'valid' | 'disabled' | 'enabled';

export type ClassNames = string | _.Falsey | ClassNames[];
export type Selectors = _Selector | _.Falsey | Selectors[];

export type ComponentStyles = {
  [K in keyof _ComponentStyles]: _ComponentStyles[K];
} &
  {
    [K in keyof _ComponentStyles as `${K}:${_Selector}`]: _ComponentStyles[K];
  };

export type _StyleProp = StyleProp<ViewStyle | TextStyle | ImageStyle>;
