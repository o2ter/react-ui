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
import { Image as RNImage, ImageProps as RNImageProps, ImageURISource, ImageRequireSource, StyleSheet } from 'react-native';
import ImageBase from './ImageBase';
import { Modify } from '../../internals/types';

type ImageProps = Modify<RNImageProps, {
  source: ImageURISource | ImageRequireSource;
}>

export const Image = React.forwardRef<React.ComponentRef<typeof ImageBase>, ImageProps>(({
  source,
  style,
  ...props
}, forwardRef) => {

  const {
    width,
    height,
    ..._style
  } = StyleSheet.flatten(style) ?? {};

  const _source = RNImage.resolveAssetSource ? RNImage.resolveAssetSource(source) : undefined;
  const [imageSize, setImageSize] = React.useState({ width: _source?.width ?? 0, height: _source?.height ?? 0 });

  React.useEffect(() => {
    if (!_.isNumber(source) && _.isString(source?.uri)) {
      RNImage.getSize(source.uri, (width, height) => setImageSize({ width, height }));
    }
  }, [!_.isNumber(source) && source?.uri]);

  let aspectRatio;
  let _width = width;
  let _height = height;

  if ((_.isNil(width) || _.isNil(height)) && imageSize.width && imageSize.height) {

    if (!_.isNil(_width) && !_.isNil(_height)) {
      _width = imageSize.width;
      _height = imageSize.height;
    } else if (!_.isNil(_width) || !_.isNil(_height)) {
      aspectRatio = imageSize.width / imageSize.height;
    }
  }

  if (_.isNumber(props.blurRadius) && props.blurRadius > 0 && _.isNumber(imageSize.width) && _.isNumber(_width) && _width > 0) {
    props.blurRadius = props.blurRadius * imageSize.width / _width;
  }

  return <ImageBase
    ref={forwardRef}
    source={source}
    style={[{ width: _width, height: _height, aspectRatio }, _style]}
    {...props} />;
});

export default Image;