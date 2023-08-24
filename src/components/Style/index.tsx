//
//  index.tsx
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
import { StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useEquivalent } from 'sugax';
import { flattenStyle } from './flatten';

type ComponentStyles = {

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
  modalBackdrop?: StyleProp<ViewStyle>;

  picker?: StyleProp<TextStyle>;

  calendarWeekContainer?: StyleProp<ViewStyle>;
  calendarWeekdayContainer?: StyleProp<ViewStyle>;
  calendarWeekday?: StyleProp<TextStyle>;

  toast?: StyleProp<ViewStyle>;
  toastText?: StyleProp<TextStyle>;

  formErrorMessage?: StyleProp<TextStyle>;

  formCheckbox?: StyleProp<TextStyle>;
  formRadio?: StyleProp<TextStyle>;

  formPicker?: StyleProp<TextStyle>;
  formPickerError?: StyleProp<TextStyle>;

  formPlainSegmentedControl?: StyleProp<ViewStyle>;
  formPlainSegmentedControlError?: StyleProp<ViewStyle>;

  formSegmentedControl?: StyleProp<ViewStyle>;
  formSegmentedControlError?: StyleProp<ViewStyle>;

  formTextField?: StyleProp<TextStyle>;
  formTextFieldError?: StyleProp<TextStyle>;

  formDate?: StyleProp<TextStyle>;
  formDateError?: StyleProp<TextStyle>;

};

type _StyleProp = StyleProp<ViewStyle | TextStyle | ImageStyle>;

const StyleContext = React.createContext<{
  components: ComponentStyles;
  classes: Record<string, _StyleProp>;
}>({ components: {}, classes: {} });

type WithCallback<T extends object> = { [K in keyof T]: T[K] | ((prev: T[K]) => T[K]); };
const mergeStyle = <T extends Record<string, _StyleProp>>(
  parent: T,
  style: WithCallback<T>,
) => ({
  ..._.mapValues(parent, v => flattenStyle(v)),
  ..._.mapValues(style, (v, k) => flattenStyle([parent[k], _.isFunction(v) ? v(parent[k] as T[keyof T]) : v])),
});

export const StyleProvider: React.FC<React.PropsWithChildren<{
  components?: WithCallback<ComponentStyles>;
  classes?: WithCallback<Record<string, _StyleProp>>;
}>> = ({
  children,
  components,
  classes,
}) => {
  const parent = React.useContext(StyleContext);
  const _components = useEquivalent(components);
  const _classes = useEquivalent(classes);
  const value = React.useMemo(() => ({
    components: _components ? StyleSheet.create(mergeStyle(parent.components, _components)) as ComponentStyles : parent.components,
    classes: _classes ? StyleSheet.create(mergeStyle(parent.classes, _classes)) : parent.classes,
  }), [parent, _components, _classes]);
  return (
    <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
  );
}

StyleProvider.displayName = 'StyleProvider';

export type ClassNames = string | _.Falsey | ClassNames[];

export const useComponentStyle = (
  component: keyof ComponentStyles,
  classNames?: ClassNames,
) => {
  const { components, classes } = React.useContext(StyleContext);
  return React.useMemo(() => {
    const names = _.compact(_.compact(_.flattenDeep([classNames])).join(' ').split(/\s/));
    const styles = _.values(_.pickBy(classes, (v, k) => _.includes(names, k)));
    return flattenStyle([components[component], ...styles]);
  }, [components, classes, component, classNames]);
}

export const useStyle = (
  classNames?: ClassNames,
) => {
  const { classes } = React.useContext(StyleContext);
  const names = _.sortedUniq(_.compact(_.compact(_.flattenDeep([classNames])).join(' ').split(/\s/)).sort());
  return React.useMemo(() => {
    const styles = _.values(_.pickBy(classes, (v, k) => _.includes(names, k)));
    return flattenStyle(styles);
  }, [classes, names.join(' ')]);
}

export const useAllStyle = () => React.useContext(StyleContext);
