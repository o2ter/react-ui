//
//  index.ts
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
import { Platform, TextStyle, ShadowStyleIOS } from 'react-native';
import { rgba } from '../internals/color';

const createShadowValue = (shadow: ShadowStyleIOS) => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = shadow;
  if (shadowOpacity === 0) return 'none';
  const offsetX = shadowOffset ? `${shadowOffset.width}px` : null;
  const offsetY = shadowOffset ? `${shadowOffset.height}px` : null;
  const blurRadius = shadowRadius ? `${shadowRadius}px` : null;
  const color = shadowColor ? rgba(shadowColor as string, shadowOpacity ?? 1) : null;
  if (_.isNil(color) || _.isNil(offsetX) || _.isNil(offsetY) || _.isNil(blurRadius)) return;
  return `${offsetX} ${offsetY} ${blurRadius} ${color}`;
};

export const elevationShadow = (x: number) => ({
  shadowOffset: {
    width: 0,
    height: Math.round(x * x / 1012 + x * 723 / 1012 + 72 / 253),
  },
  shadowOpacity: Math.round(3.14658 * Math.log(117.576 * x)) / 100,
  shadowRadius: Math.round(0.509881 * x * x + 69.8617 * x + 29.6285) / 100,
  elevation: x,
});

export const selectPlatformShadow = (style: TextStyle & {
  boxShadow?: string;
  textShadow?: string;
}) => {

  const {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    boxShadow,
    textShadowColor,
    textShadowOffset,
    textShadowRadius,
    textShadow,
    elevation,
    ..._style
  } = style;

  const _elevation = elevation ? elevationShadow(elevation) : null;
  const _shadow = {
    shadowColor,
    shadowOffset: shadowOffset ?? _elevation?.shadowOffset,
    shadowOpacity: shadowOpacity ?? _elevation?.shadowOpacity,
    shadowRadius: shadowRadius ?? _elevation?.shadowRadius,
  };

  return {
    ..._style,
    ...Platform.select({
      ios: { ..._shadow },
      android: {
        shadowColor,
        elevation,
      },
      web: {
        boxShadow: boxShadow ?? createShadowValue(_shadow),
      },
      default: {},
    }),
    ...Platform.select({
      web: {
        textShadow: textShadow ?? createShadowValue({
          shadowColor: textShadowColor,
          shadowOffset: textShadowOffset,
          shadowRadius: textShadowRadius,
        }),
      },
      default: {
        textShadowColor,
        textShadowOffset,
        textShadowRadius,
      },
    }),
  };
}
