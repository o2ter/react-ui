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
import { StyleSheet } from 'react-native';
import RNLottie, { AnimatedLottieViewProps, AnimationObject } from 'lottie-react-native';
import { Modify } from '../../internals/types';

type LottieProps = Modify<AnimatedLottieViewProps, {
  source: AnimationObject;
}>

export const Lottie = React.forwardRef<RNLottie, LottieProps>(({
  source,
  style,
  duration = 0,
  loop = true,
  autoPlay = false,
  ...props
}, forwardRef) => {

  const _style = StyleSheet.flatten(style) ?? {};

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

  return <RNLottie
    ref={forwardRef}
    source={source}
    progress={Math.max(0, Math.min(1, duration))}
    autoPlay={autoPlay}
    loop={loop}
    style={[{ aspectRatio, width: _width, height: _height }, style]}
    {...props} />;
});

export default Lottie;
