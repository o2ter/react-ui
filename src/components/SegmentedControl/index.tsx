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
import { Animated, View, ViewProps, StyleProp, ViewStyle, TextStyle, LayoutRectangle } from 'react-native';
import { Modify } from '../../internals/types';

import { style as _style } from './style';
import { Segment } from './segment';

const segment_value = (item: string | { value: string }) => _.isString(item) ? item : item.value;

type SegmentedControlBaseProps = Modify<ViewProps, {
  value?: string;
  onChange?: (value: string) => void;
  segments?: (string | { label: any, value: string })[];
  segmentTextStyle?: StyleProp<TextStyle>;
  selectedSegmentTextStyle?: StyleProp<TextStyle>;
  segmentContainerStyle?: StyleProp<ViewStyle>;
  selectedSegmentContainerStyle?: StyleProp<ViewStyle>;
}>

type SegmentedControlProps = Modify<SegmentedControlBaseProps, { tabStyle?: StyleProp<ViewStyle>; }>

export const SegmentedControl = React.forwardRef<View, SegmentedControlProps>(({
  value,
  style,
  onChange,
  segments = [],
  tabStyle,
  segmentTextStyle,
  selectedSegmentTextStyle,
  segmentContainerStyle,
  selectedSegmentContainerStyle,
  ...props
}, forwardRef) => {

  const [segmentBounds, setSegmentBounds] = React.useState<Record<number, LayoutRectangle>>({});
  const selected_idx = Math.max(0, _.findIndex(segments, x => segment_value(x) === value));
  const selected_bounds = segmentBounds[selected_idx] ?? {};

  const [tabTranslate, setTabTranslate] = React.useState(new Animated.ValueXY({ x: selected_bounds.x ?? 0, y: selected_bounds.width ?? 0 }));

  React.useEffect(() => { setTabTranslate(new Animated.ValueXY({ x: selected_bounds.x ?? 0, y: selected_bounds.width ?? 0 })); }, [segmentBounds]);

  React.useEffect(() => {
    if (!_.isNil(selected_bounds.x) && !_.isNil(selected_bounds.width)) {
      Animated.spring(tabTranslate, {
        toValue: {
          x: selected_bounds.x,
          y: selected_bounds.width,
        },
        useNativeDriver: false,
      }).start();
    }
  }, [selected_bounds.x, selected_bounds.width]);

  return <View
    ref={forwardRef}
    style={[_style.segmentedControlContainer, style]}
    {...props}>
    <Animated.View style={{
      position: 'absolute',
      top: 0,
      height: '100%',
      left: tabTranslate.x,
      width: tabTranslate.y,
    }}>
      <View style={[{ flex: 1, backgroundColor: 'white', margin: 2, borderRadius: 8, alignSelf: 'stretch' }, _style.shadow, tabStyle]} />
    </Animated.View>
    {React.Children.map(segments, (item, index) => (
      <Segment
        item={item}
        onLayout={({ nativeEvent }) => setSegmentBounds(state => ({ ...state, [index]: nativeEvent.layout }))}
        isSelected={selected_idx === index}
        segmentTextStyle={segmentTextStyle}
        selectedSegmentTextStyle={selectedSegmentTextStyle}
        segmentContainerStyle={segmentContainerStyle}
        selectedSegmentContainerStyle={selectedSegmentContainerStyle}
        onPress={() => { if (_.isFunction(onChange)) onChange(segment_value(segments[index])) }} />
    ))}
  </View>;
});

type PlainSegmentedControlProps = Modify<SegmentedControlBaseProps, { color?: string; }>

export const PlainSegmentedControl = React.forwardRef<View, PlainSegmentedControlProps>(({
  value,
  style,
  color = '#2196F3',
  onChange,
  segments = [],
  segmentTextStyle,
  selectedSegmentTextStyle,
  segmentContainerStyle,
  selectedSegmentContainerStyle,
  ...props
}, forwardRef) => {

  const selected_idx = Math.max(0, _.findIndex(segments, x => segment_value(x) === value));

  return <View
    ref={forwardRef}
    style={[_style.plainSegmentedControlContainer, { borderColor: color }, style]}
    {...props}>
    {React.Children.map(segments, (item, index) => (
      <Segment
        item={item}
        isSelected={selected_idx === index}
        segmentTextStyle={[{ color }, segmentTextStyle]}
        selectedSegmentTextStyle={[{ color: 'white' }, selectedSegmentTextStyle]}
        segmentContainerStyle={segmentContainerStyle}
        selectedSegmentContainerStyle={[{ backgroundColor: color }, selectedSegmentContainerStyle]}
        onPress={() => { if (_.isFunction(onChange)) onChange(segment_value(segments[index])) }} />
    ))}
  </View>;
});
