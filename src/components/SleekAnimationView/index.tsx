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
import { Image, StyleProp, ViewStyle, ImageStyle, ImageSourcePropType, ImageResizeMode } from 'react-native';
import { List } from '../List';
import { StickyView } from '../StickyView';
import { Modify } from '../../internals/types';

type SleekAnimationViewProps = Modify<Omit<React.ComponentPropsWithoutRef<typeof StickyView>, 'stickyView'>, {
  backgroundContainerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ImageStyle>;
  backgroundImages: ImageSourcePropType[];
  resizeMode?: ImageResizeMode;
}>

export const SleekAnimationView = React.forwardRef(_.assign(({
  backgroundContainerStyle,
  backgroundStyle,
  backgroundImages = [],
  resizeMode,
  children,
  ...props
}: SleekAnimationViewProps, forwardRef: React.ForwardedRef<React.ComponentRef<typeof StickyView>>) => (
  <StickyView
    ref={forwardRef}
    stickyContainerStyle={[{ zIndex: -1 }, backgroundContainerStyle]}
    stickyView={({ factor }) => <List
      data={backgroundImages}
      renderItem={({ item, index }) => <Image
        source={item}
        style={[{
          width: '100%',
          height: '100%',
          display: index === Math.min(backgroundImages.length - 1, Math.floor(factor * backgroundImages.length)) ? 'flex' : 'none'
        }, backgroundStyle]}
        resizeMode={resizeMode} />} />}
    {...props}>
    {children}
  </StickyView>
), {
  displayName: 'SleekAnimationView',
}));

export default SleekAnimationView;