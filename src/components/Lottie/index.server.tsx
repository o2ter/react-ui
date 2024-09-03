//
//  index.web.tsx
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
import React from 'react';
import { View, Animated } from 'react-native';
import { flattenStyle } from '../Style/flatten';
import { LottieProps } from './types';

const LottieBase = React.forwardRef<View, LottieProps>(({
  source,
  style,
  duration = 0,
  autoPlay = false,
  loop = true,
  renderer = 'canvas',
  preserveAspectRatio,
  ...props
}, forwardRef) => {

  const _style = flattenStyle(style) ?? {};

  let aspectRatio;
  let _width = _style.width;
  let _height = _style.height;

  if (!_.isNil(source)) {
    if (!_.isNil(_width) && !_.isNil(_height)) {
      _width = source.w;
      _height = source.h;
    } else if (!_.isNil(_width) || !_.isNil(_height)) {
      aspectRatio = source.w / source.h;
    }
  }

  return <View
    ref={forwardRef}
    style={[{ aspectRatio, width: _width, height: _height }, style]}
    {...props} />;
});

export const Lottie = Animated.createAnimatedComponent(LottieBase);

Lottie.displayName = 'Lottie';

export default Lottie;