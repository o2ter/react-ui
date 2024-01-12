//
//  index.tsx
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
import { Pressable as RNPressable, PressableProps as RNPressableProps } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import { TextStyleProvider } from '../Text/style';
import { normalizeStyle } from '../Style/flatten';

type PressableProps = RNPressableProps & {
  classes?: ClassNames;
};

export const Pressable = createMemoComponent((
  {
    classes,
    style,
    children,
    ...props
  }: PressableProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RNPressable>>
) => {
  const viewStyle = _useComponentStyle('view', classes);
  return (
    <RNPressable
      ref={forwardRef}
      style={(state) => normalizeStyle([viewStyle, _.isFunction(style) ? style(state) : style])}
      {...props}>
      {(state) => (
        <TextStyleProvider
          classes={classes}
          style={_.isFunction(style) ? style(state) : style}
        >
          {_.isFunction(children) ? children(state) : children}
        </TextStyleProvider>
      )}
    </RNPressable>
  );
}, {
  displayName: 'Pressable',
});

export default Pressable;
