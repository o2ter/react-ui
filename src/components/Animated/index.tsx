//
//  index.tsx
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
import { Animated, Pressable, Platform } from 'react-native';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const useFadeAnim = (options: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  timing: Partial<Animated.TimingAnimationConfig>;
}) => {

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {

    options.setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: options.visible ? 1 : 0,
      useNativeDriver: Platform.OS !== 'web',
      ...options.timing,
    }).start(() => !options.visible && options.setVisible(false));

  }, [options.visible]);

  return fadeAnim;
}