//
//  body.tsx
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
import { View as RNView, Platform, useWindowDimensions, ScaledSize, StyleProp, ViewStyle, Animated } from 'react-native';
import { LayoutRectangle } from 'react-native';
import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { flattenStyle } from '../Style/flatten';
import { PopoverPosition, PopoverAlignment } from './types';
import { elevationShadow, selectPlatformShadow } from '../../shadow';
import { _useFadeAnim } from '../_Animated';

type PopoverBodyProps = React.PropsWithChildren<{
  hidden: boolean;
  arrow: boolean;
  shadow: boolean | number;
  position: PopoverPosition;
  alignment: PopoverAlignment;
  layout: LayoutRectangle & { pageX: number; pageY: number; };
  style?: StyleProp<ViewStyle>;
}>;

const selectPosition = (
  position: PopoverPosition,
  layout: LayoutRectangle & { pageX: number; pageY: number; },
  windowDimensions: ScaledSize
) => {
  if (position === 'auto') position = ['top', 'left', 'right', 'bottom'];
  position = _.castArray(position);
  const top = layout.y - layout.pageY;
  const left = layout.x - layout.pageX;
  const spaces = {
    top: Math.max(0, top),
    left: Math.max(0, left),
    right: Math.max(0, windowDimensions.width - left - layout.width),
    bottom: Math.max(0, windowDimensions.height - top - layout.height),
  };
  return _.maxBy(position, x => spaces[x])!;
};

export const PopoverBody: React.FC<PopoverBodyProps> = ({
  hidden,
  arrow,
  shadow,
  position,
  alignment,
  layout,
  style,
  children,
}) => {

  const theme = useTheme();
  const windowDimensions = useWindowDimensions();
  const [containerLayout, setContainerLayout] = React.useState<LayoutRectangle>();

  const [visible, setVisible] = React.useState(false);
  const fadeAnim = _useFadeAnim({
    visible: !hidden,
    setVisible,
    timing: {
      duration: theme.popoverDuration,
      easing: theme.popoverEasing,
    }
  });

  const arrowSize = theme.spacers['2'];
  const {
    borderColor = theme.grays['300'],
    backgroundColor = theme.root.backgroundColor,
    borderTopWidth: borderWidth = theme.borderWidth,
    borderLeftWidth,
    borderRightWidth,
    borderBottomWidth,
    ..._style
  } = flattenStyle([_useComponentStyle('popover'), style]);

  const _position = selectPosition(position, layout, windowDimensions);
  const containerWidth = containerLayout?.width ?? 0;
  const containerHeight = containerLayout?.height ?? 0;

  let _pos_x = {
    top: layout.x + 0.5 * layout.width - 0.5 * containerWidth,
    left: layout.x - containerWidth - arrowSize,
    right: layout.x + layout.width + arrowSize + borderWidth,
    bottom: layout.x + 0.5 * layout.width - 0.5 * containerWidth,
  }[_position];
  let _pos_y = {
    top: layout.y - containerHeight - arrowSize,
    left: layout.y + 0.5 * layout.height - 0.5 * containerHeight,
    right: layout.y + 0.5 * layout.height - 0.5 * containerHeight,
    bottom: layout.y + layout.height + arrowSize + borderWidth,
  }[_position];

  const _position_vertical = _position === 'top' || _position === 'bottom';
  const _position_horizontal = _position === 'left' || _position === 'right';

  if (alignment === 'auto') alignment = ['top', 'left', 'right', 'bottom'];
  alignment = _.castArray(alignment);

  if (_position_vertical && _.includes(alignment, 'left') && _pos_x < 0) {
    _pos_x = layout.x;
  } else if (_position_vertical && _.includes(alignment, 'right') && _pos_x + containerWidth > windowDimensions.width) {
    _pos_x = layout.x + layout.width - containerWidth;
  } else if (_position_horizontal && _.includes(alignment, 'top') && _pos_y < 0) {
    _pos_y = layout.y;
  } else if (_position_horizontal && _.includes(alignment, 'bottom') && _pos_y + containerHeight > windowDimensions.height) {
    _pos_y = layout.y + layout.height - containerHeight;
  }

  const _arrow_pos_x = _position === 'left' ? containerWidth : _position === 'right' ? -arrowSize : 0.5 * containerWidth - arrowSize;
  const _arrow_pos_y = _position === 'top' ? containerHeight : _position === 'bottom' ? -arrowSize : 0.5 * containerHeight - arrowSize;

  return (
    <>
      {visible && <Animated.View
        onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}
        style={flattenStyle([
          !!shadow && selectPlatformShadow({
            shadowColor: 'black',
            ...elevationShadow(_.isNumber(shadow) ? shadow : 6),
          }),
          {
            position: 'absolute',
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
            pointerEvents: 'box-none',
          },
          _style,
        ])}
      >
        {arrow && (
          <>
            <RNView
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
                pointerEvents: 'box-none',
              }} />
            <RNView
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
                pointerEvents: 'box-none',
              }} />
          </>
        )}
        {children}
      </Animated.View>}
    </>
  );
};
