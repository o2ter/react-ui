//
//  body.tsx
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
import { View as RNView, Platform, useWindowDimensions, ScaledSize, StyleProp, ViewStyle, Animated } from 'react-native';
import { LayoutRectangle } from 'react-native';
import { useTheme } from '../../../theme';
import { useComponentStyle } from '../../Style';
import { flattenStyle } from '../../Style/flatten';
import { PopoverPosition } from './types';
import { elevationShadow, selectPlatformShadow } from '../../../shadow';

type PopoverBodyProps = React.PropsWithChildren<{
  hidden: boolean;
  position: PopoverPosition;
  layout: LayoutRectangle;
  style?: StyleProp<ViewStyle>;
}>;

const selectPosition = (
  position: PopoverPosition,
  layout: LayoutRectangle,
  windowDimensions: ScaledSize
) => {
  const _position = ['top', 'left', 'right', 'bottom'] as const;
  if (_.includes(_position, position)) return position as (typeof _position)[number];
  const spaces = {
    top: Math.max(0, layout.y),
    left: Math.max(0, layout.x),
    right: Math.max(0, windowDimensions.width - layout.x - layout.width),
    bottom: Math.max(0, windowDimensions.height - layout.y - layout.height),
  };
  return _.maxBy(_position, x => spaces[x])!;
};

export const PopoverBody: React.FC<PopoverBodyProps> = ({
  hidden, position, layout, style, children,
}) => {

  const theme = useTheme();
  const windowDimensions = useWindowDimensions();
  const [containerLayout, setContainerLayout] = React.useState<LayoutRectangle>();

  const [visible, setVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {

    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: hidden ? 0 : 1,
      duration: theme.popoverDuration,
      easing: theme.popoverEasing,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => setVisible(!hidden));

  }, [hidden]);

  const arrowSize = theme.spacers['2'];
  const {
    borderColor = theme.grays['300'], backgroundColor = theme.root.backgroundColor, borderTopWidth: borderWidth = theme.borderWidth, borderLeftWidth, borderRightWidth, borderBottomWidth, ..._style
  } = flattenStyle([useComponentStyle('popover'), style]);

  const _position = selectPosition(position, layout, windowDimensions);
  const containerWidth = containerLayout?.width ?? 0;
  const containerHeight = containerLayout?.height ?? 0;

  const _pos_x = {
    top: layout.x + 0.5 * layout.width - 0.5 * containerWidth,
    left: layout.x - containerWidth - arrowSize,
    right: layout.x + layout.width + arrowSize + borderWidth,
    bottom: layout.x + 0.5 * layout.width - 0.5 * containerWidth,
  }[_position];
  const _pos_y = {
    top: layout.y - containerHeight - arrowSize,
    left: layout.y + 0.5 * layout.height - 0.5 * containerHeight,
    right: layout.y + 0.5 * layout.height - 0.5 * containerHeight,
    bottom: layout.y + layout.height + arrowSize + borderWidth,
  }[_position];

  const _arrow_pos_x = _position === 'left' ? containerWidth : _position === 'right' ? -arrowSize : 0.5 * containerWidth - arrowSize;
  const _arrow_pos_y = _position === 'top' ? containerHeight : _position === 'bottom' ? -arrowSize : 0.5 * containerHeight - arrowSize;

  return (
    <>
      {visible && <Animated.View
        pointerEvents='box-none'
        onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}
        style={[
          selectPlatformShadow({
            shadowColor: 'black',
            ...elevationShadow(6),
          }),
          {
            left: _pos_x,
            top: _pos_y,
            backgroundColor: backgroundColor,
            borderStyle: 'solid',
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderRadius: theme.borderRadiusBase,
            minWidth: 2 * theme.borderRadiusBase + (_position === 'top' || _position === 'bottom' ? 2 * arrowSize : arrowSize),
            minHeight: 2 * theme.borderRadiusBase + (_position === 'left' || _position === 'right' ? 2 * arrowSize : arrowSize),
            zIndex: theme.zIndex.popover,
            opacity: containerLayout ? fadeAnim : 0,
            padding: theme.spacers['1'],
          },
          Platform.select({
            web: { position: 'fixed' } as any,
            default: { position: 'absolute' },
          }),
          _style,
        ]}
      >
        <RNView
          pointerEvents='box-none'
          style={{
            position: 'absolute',
            left: _arrow_pos_x - borderWidth,
            top: _arrow_pos_y - borderWidth,
            borderStyle: 'solid',
            borderTopWidth: _position === 'bottom' ? 0 : arrowSize,
            borderLeftWidth: _position === 'right' ? 0 : arrowSize,
            borderRightWidth: _position === 'left' ? 0 : arrowSize,
            borderBottomWidth: _position === 'top' ? 0 : arrowSize,
            borderTopColor: _position === 'top' ? borderColor : 'transparent',
            borderLeftColor: _position === 'left' ? borderColor : 'transparent',
            borderRightColor: _position === 'right' ? borderColor : 'transparent',
            borderBottomColor: _position === 'bottom' ? borderColor : 'transparent',
          }} />
        <RNView
          pointerEvents='box-none'
          style={{
            position: 'absolute',
            left: _position === 'left' ? _arrow_pos_x - 2 * borderWidth : _position === 'right' ? _arrow_pos_x : _arrow_pos_x - borderWidth,
            top: _position === 'top' ? _arrow_pos_y - 2 * borderWidth : _position === 'bottom' ? _arrow_pos_y : _arrow_pos_y - borderWidth,
            borderStyle: 'solid',
            borderTopWidth: _position === 'bottom' ? 0 : arrowSize,
            borderLeftWidth: _position === 'right' ? 0 : arrowSize,
            borderRightWidth: _position === 'left' ? 0 : arrowSize,
            borderBottomWidth: _position === 'top' ? 0 : arrowSize,
            borderTopColor: _position === 'top' ? backgroundColor : 'transparent',
            borderLeftColor: _position === 'left' ? backgroundColor : 'transparent',
            borderRightColor: _position === 'right' ? backgroundColor : 'transparent',
            borderBottomColor: _position === 'bottom' ? backgroundColor : 'transparent',
          }} />
        {children}
      </Animated.View>}
    </>
  );
};
