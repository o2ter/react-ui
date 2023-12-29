//
//  flatten.tsx
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
import { StyleProp } from 'react-native';

const normalize = <T>(style: T): T => {
  const {
    margin,
    marginHorizontal = margin,
    marginVertical = margin,
    marginTop = marginVertical,
    marginBottom = marginVertical,
    marginLeft = marginHorizontal,
    marginRight = marginHorizontal,
    padding,
    paddingHorizontal = padding,
    paddingVertical = padding,
    paddingTop = paddingVertical,
    paddingBottom = paddingVertical,
    paddingLeft = paddingHorizontal,
    paddingRight = paddingHorizontal,
    borderColor,
    borderTopColor = borderColor,
    borderBottomColor = borderColor,
    borderLeftColor = borderColor,
    borderRightColor = borderColor,
    borderWidth,
    borderTopWidth = borderWidth,
    borderBottomWidth = borderWidth,
    borderLeftWidth = borderWidth,
    borderRightWidth = borderWidth,
    borderRadius,
    borderTopLeftRadius = borderRadius,
    borderBottomLeftRadius = borderRadius,
    borderTopRightRadius = borderRadius,
    borderBottomRightRadius = borderRadius,
    ..._style
  } = style as any;
  return {
    ..._style,
    ..._.isNil(marginTop) ? {} : { marginTop },
    ..._.isNil(marginBottom) ? {} : { marginBottom },
    ..._.isNil(marginLeft) ? {} : { marginLeft },
    ..._.isNil(marginRight) ? {} : { marginRight },
    ..._.isNil(paddingTop) ? {} : { paddingTop },
    ..._.isNil(paddingBottom) ? {} : { paddingBottom },
    ..._.isNil(paddingLeft) ? {} : { paddingLeft },
    ..._.isNil(paddingRight) ? {} : { paddingRight },
    ..._.isNil(borderTopColor) ? {} : { borderTopColor },
    ..._.isNil(borderBottomColor) ? {} : { borderBottomColor },
    ..._.isNil(borderLeftColor) ? {} : { borderLeftColor },
    ..._.isNil(borderRightColor) ? {} : { borderRightColor },
    ..._.isNil(borderTopWidth) ? {} : { borderTopWidth },
    ..._.isNil(borderBottomWidth) ? {} : { borderBottomWidth },
    ..._.isNil(borderLeftWidth) ? {} : { borderLeftWidth },
    ..._.isNil(borderRightWidth) ? {} : { borderRightWidth },
    ..._.isNil(borderTopLeftRadius) ? {} : { borderTopLeftRadius },
    ..._.isNil(borderBottomLeftRadius) ? {} : { borderBottomLeftRadius },
    ..._.isNil(borderTopRightRadius) ? {} : { borderTopRightRadius },
    ..._.isNil(borderBottomRightRadius) ? {} : { borderBottomRightRadius },
  } as T;
}

const _flatten = <T>(styles?: StyleProp<T>): T[] => {
  if (_.isArray(styles)) return _.flatMap(styles, v => _flatten(v as any));
  if (_.isNumber(styles)) return [styles.__registeredStyleBrand];
  return styles ? [styles] : [];
}

export const flattenStyle = <T>(styles?: StyleProp<T>) => {
  return _.reduce(_flatten(styles), (acc, style) => ({ ...normalize(acc), ...normalize(style) }), {} as T);
}
