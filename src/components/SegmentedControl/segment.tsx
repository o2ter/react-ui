//
//  segment.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
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
import { Text, TextStyle, ViewStyle, Pressable, StyleProp, LayoutChangeEvent, GestureResponderEvent } from 'react-native';

import { style as _style } from './style';
import { textStyleNormalize } from '../Text/style';

type SegmentProps = {
  item: { label: string };
  selected: boolean;
  segmentTextStyle?: StyleProp<TextStyle> | ((state: { selected: boolean; }) => StyleProp<TextStyle>);
  segmentContainerStyle?: StyleProp<ViewStyle> | ((state: { selected: boolean; }) => StyleProp<TextStyle>);
  onLayout?: (event: LayoutChangeEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
};

export const Segment: React.FC<SegmentProps> = ({
  item,
  onLayout,
  selected,
  segmentTextStyle,
  segmentContainerStyle,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    onLayout={onLayout}
    style={[
      { paddingVertical: 8, paddingHorizontal: 16 },
      _.isFunction(segmentContainerStyle) ? segmentContainerStyle({ selected }) : segmentContainerStyle,
    ]}>
    <Text style={textStyleNormalize([
      _.isFunction(segmentTextStyle) ? segmentTextStyle({ selected }) : segmentTextStyle,
    ])}>{item.label}</Text>
  </Pressable>
);

Segment.displayName = 'Segment';