//
//  index.js
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
import { Animated, View, Text, Pressable, StyleSheet } from 'react-native';
import { List } from '../List';
import { Icon } from '../Icon';

const segment_label = (item) => _.isString(item) ? item : item?.label;
const segment_value = (item) => _.isString(item) ? item : item?.value;

const shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
};

function Segment({
    item,
    onLayout,
    isSelected,
    segmentTextStyle,
    selectedSegmentTextStyle,
    segmentContainerStyle,
    selectedSegmentContainerStyle,
    onPress,
}) {

	const _segmentContainerStyle = isSelected ? StyleSheet.compose(segmentContainerStyle, selectedSegmentContainerStyle) : segmentContainerStyle;
	const _segmentTextStyle = isSelected ? StyleSheet.compose(segmentTextStyle, selectedSegmentTextStyle) : segmentTextStyle;
	const _iconStyle = isSelected ? StyleSheet.compose(item.iconStyle, item.selectedIconStyle) : item.iconStyle;

	const title = segment_label(item);
	let content;

    if (!_.isEmpty(item.icon) && !_.isEmpty(title)) {
        content = <Icon icon={item.icon} name={item.iconName} style={_segmentTextStyle} iconStyle={_iconStyle}> {title}</Icon>;
    } else if (!_.isEmpty(item.icon)) {
        content = <Icon icon={item.icon} name={item.iconName} iconStyle={_iconStyle} />;
    } else if (!_.isEmpty(title)) {
        content = <Text style={_segmentTextStyle}>{title}</Text>;
    }

    return <Pressable
    onPress={onPress}
    onLayout={onLayout}
    style={[{ paddingVertical: 8, paddingHorizontal: 16 }, _segmentContainerStyle]}>{content}</Pressable>
}

export const SegmentedControl = React.forwardRef(({
    value,
    style,
	onChange,
    segments,
    tabStyle,
    segmentTextStyle,
    selectedSegmentTextStyle,
    segmentContainerStyle,
    selectedSegmentContainerStyle,
    ...props
}, forwardRef) => {
    
    const [segmentBounds, setSegmentBounds] = React.useState({});
    const selected_idx = Math.max(0, _.findIndex(segments, x => segment_value(x) === value));
    const selected_bounds = segmentBounds[selected_idx] ?? {};

    const [tabTranslate, setTabTranslate] = React.useState(new Animated.ValueXY({ x: selected_bounds.x ?? 0, y: selected_bounds.width ?? 0 }));

    React.useEffect(() => { setTabTranslate(new Animated.ValueXY({ x: selected_bounds.x ?? 0, y: selected_bounds.width ?? 0 })); }, [segmentBounds]);

    React.useEffect(() => {
        Animated.spring(tabTranslate, {
            toValue: {
                x: selected_bounds.x,
                y: selected_bounds.width,
            },
            useNativeDriver: false,
        }).start();
    }, [selected_bounds.x, selected_bounds.width]);

    return <View
    ref={forwardRef}
    style={[{
        margin: 4,
        width: 'fit-content',
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: 'lightgray',
        alignItems: 'stretch',
    }, style]}
    {...props}>
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            left: tabTranslate.x,
            width: tabTranslate.y,
        }}>
            <View style={[{ flex: 1, backgroundColor: 'white', margin: 2, borderRadius: 8, alignSelf: 'stretch' }, shadow, tabStyle]} />
        </Animated.View>
        <List
        data={segments}
        renderItem={({ item, index }) => <Segment
        item={item}
        onLayout={(e) => setSegmentBounds(state => ({ ...state, [index]: e.nativeEvent.layout }))}
        isSelected={selected_idx === index}
        segmentTextStyle={segmentTextStyle}
        selectedSegmentTextStyle={selectedSegmentTextStyle}
        segmentContainerStyle={segmentContainerStyle}
        selectedSegmentContainerStyle={selectedSegmentContainerStyle}
        onPress={() => onChange(segment_value(segments[index]))} />} />
    </View>;
});

export const PlainSegmentedControl = React.forwardRef(({
    value,
    style,
    color = '#2196F3',
	onChange,
    segments,
    segmentTextStyle,
    selectedSegmentTextStyle,
    segmentContainerStyle,
    selectedSegmentContainerStyle,
    ...props
}, forwardRef) => {
    
    const selected_idx = Math.max(0, _.findIndex(segments, x => segment_value(x) === value));

    return <View
    ref={forwardRef}
    style={[{
        width: 'fit-content',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: color,
        overflow: 'hidden',
        alignItems: 'stretch',
    }, style]}
    {...props}>
        <List
        data={segments}
        renderItem={({ item, index }) => <Segment
        item={item}
        isSelected={selected_idx === index}
        segmentTextStyle={[{ color: 'black' }, segmentTextStyle]}
        selectedSegmentTextStyle={[{ color: 'white' }, selectedSegmentTextStyle]}
        segmentContainerStyle={segmentContainerStyle}
        selectedSegmentContainerStyle={[{ backgroundColor: color }, selectedSegmentContainerStyle]}
        onPress={() => onChange(segment_value(segments[index]))} />} />
    </View>;
});
