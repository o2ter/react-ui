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
import { Platform, TextStyle, ViewStyle, ShadowStyleIOS } from 'react-native';
import { rgba } from '../internals/color';

const createShadowValue = (shadow: ShadowStyleIOS) => {
  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius } = shadow;
  const offsetX = shadowOffset ? `${shadowOffset.width}px` : null;
  const offsetY = shadowOffset ? `${shadowOffset.height}px` : null;
  const blurRadius = shadowRadius ? `${shadowRadius}px` : null;
  const color = shadowColor ? rgba(shadowColor as string, shadowOpacity ?? 1) : null;
  if (_.isNil(color) || _.isNil(offsetX) || _.isNil(offsetY) || _.isNil(blurRadius)) return;
  return `${offsetX} ${offsetY} ${blurRadius} ${color}`;
};

export const selectPlatformShadow = (style: ViewStyle & { boxShadow?: string }) => {

  const {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    boxShadow,
    elevation,
  } = style;

  return Platform.select({
    ios: {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    },
    android: {
      shadowColor,
      elevation,
    },
    web: {
      boxShadow: boxShadow ?? createShadowValue({
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
      }),
    },
    default: {},
  });
}

export const selectPlatformTextShadow = (style: TextStyle & { textShadow?: string }) => {
  const {
    textShadowColor,
    textShadowOffset,
    textShadowRadius,
    textShadow,
    elevation,
  } = style;

  return Platform.select({
    ios: {
      textShadowColor,
      textShadowOffset,
      textShadowRadius,
    },
    android: {
      textShadowColor,
      elevation,
    },
    web: {
      boxShadow: textShadow ?? createShadowValue({
        shadowColor: textShadowColor,
        shadowOffset: textShadowOffset,
        shadowRadius: textShadowRadius,
      }),
    },
    default: {},
  });
}
