//
//  ios.tsx
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
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { ItemValue, PickerNative, PickerProps } from './native';
import { createMemoComponent } from '../../internals/utils';
import { useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';
import { useFocus, useFocusRing } from '../../internals/focus';

export const PickerIOS = createMemoComponent(<T = ItemValue>({
  classes,
  value,
  items = [],
  disabled = false,
  style,
  renderText = (item) => item?.label,
  onValueChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
}: PickerProps<T>, forwardRef: React.ForwardedRef<Text>) => {

  const selected = _.find(items, x => x.value === value);

  const [showPicker, setShowPicker] = React.useState(false);
  const [orientation, setOrientation] = React.useState('portrait');

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const pickerStyle = useComponentStyle('picker', classes, [
    focused && 'focus',
    disabled ? 'disabled' : 'enabled',
  ]);

  function _setShowPicker(value: boolean) {
    setShowPicker(value);
    value ? _onFocus() : _onBlur();
  }

  return (
    <React.Fragment>
      <TouchableOpacity activeOpacity={1} onPress={() => { if (!disabled) _setShowPicker(true) }}>
        <Text ref={forwardRef} style={textStyleNormalize([
          useFocusRing(focused),
          pickerStyle,
          _.isFunction(style) ? style({ focus: focused }) : style,
        ])}>{renderText(selected)}</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={showPicker}
        animationType='slide'
        supportedOrientations={['portrait', 'landscape']}
        onOrientationChange={({ nativeEvent }) => setOrientation(nativeEvent.orientation)}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => _setShowPicker(false)} />
        <View style={{
          height: 45,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingHorizontal: 10,
          backgroundColor: '#f8f8f8',
          borderTopWidth: 1,
          borderTopColor: '#dedede',
          zIndex: 2,
        }}>
          <TouchableOpacity
            onPress={() => _setShowPicker(false)}
            hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <Text style={{
              color: '#007aff',
              fontWeight: '600',
              fontSize: 17,
              paddingTop: 1,
              paddingRight: 11,
            }}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          justifyContent: 'center',
          backgroundColor: '#d0d4da',
          height: orientation === 'portrait' ? 215 : 162,
        }}>
          <PickerNative value={value} items={items} onValueChange={onValueChange} />
        </View>
      </Modal>
    </React.Fragment>
  )
}, {
  displayName: 'Picker',
});

export default PickerIOS;