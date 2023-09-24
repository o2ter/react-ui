//
//  index.web.tsx
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
import { View } from 'react-native';
import { SVGProps } from './types';
import { createMemoComponent } from '../../internals/utils';
import { flattenStyle } from '../Style/flatten';

export const SVG = createMemoComponent(({
  source,
  style,
  ...props
}: SVGProps, forwardRef: React.ForwardedRef<View>) => {

  const {
    width,
    height,
    aspectRatio,
    ..._style
  } = flattenStyle(style) ?? {};

  const { content, uri } = source ?? {};
  const dataStr = React.useMemo(() => _.isString(content) ? `data:image/svg+xml,${encodeURIComponent(content)}` : '', [content]);

  if (_.isString(content)) {
    return <View ref={forwardRef} style={[{ width, height, aspectRatio }, _style]} {...props}>
      <img
        draggable={false}
        width={_.isNil(width) && (_.isNil(height) || _.isNil(aspectRatio)) ? undefined : '100%'}
        height={_.isNil(height) && (_.isNil(width) || _.isNil(aspectRatio)) ? undefined : '100%'}
        src={dataStr} />
    </View>;
  }

  if (_.isString(uri)) {
    return <View ref={forwardRef} style={[{ width, height, aspectRatio }, _style]} {...props}>
      <img
        draggable={false}
        width={_.isNil(width) && (_.isNil(height) || _.isNil(aspectRatio)) ? undefined : '100%'}
        height={_.isNil(height) && (_.isNil(width) || _.isNil(aspectRatio)) ? undefined : '100%'}
        src={uri} />
    </View>;
  }

  return <View ref={forwardRef} style={[{ width, height, aspectRatio }, _style]} {...props} />;
}, {
  displayName: 'SVG',
});

export default SVG;