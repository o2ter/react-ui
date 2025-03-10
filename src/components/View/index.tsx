//
//  index.tsx
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
import { View as RNView, ViewProps as RNViewProps } from 'react-native';
import { createMemoComponent } from '../../internals/utils';
import { _useComponentStyle } from '../Style';
import { ClassNames } from '../Style/types';
import { TextStyleProvider } from '../Text/style';
import { normalizeStyle } from '../Style/flatten';

type ViewProps = RNViewProps & {
  classes?: ClassNames;
};

export const View = createMemoComponent(({
  classes,
  style,
  children,
  ...props
}: ViewProps, forwardRef: React.ForwardedRef<RNView>) => {
  const viewStyle = _useComponentStyle('view', classes);
  return (
    <RNView
      ref={forwardRef}
      style={normalizeStyle([viewStyle, style])}
      {...props}>
      <TextStyleProvider classes={classes} style={style}>{children}</TextStyleProvider>
    </RNView>
  );
}, {
  displayName: 'View',
});

export default View;
