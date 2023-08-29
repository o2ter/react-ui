//
//  styles.ts
//
//  The MIT License
//  Copyright (c) 2015 - 2022 Susan Cheng. All rights reserved.
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
import { CSSProperties } from 'react';
import { StyleProp } from 'react-native';

const decodeBox = (x?: string | number) => {
  if (_.isNil(x)) return;
  if (_.isNumber(x)) return { top: x, bottom: x, left: x, right: x };
  const parts = _.compact(x.split(/\s+/g));
  if (parts.length === 1) return { top: parts[0], bottom: parts[0], left: parts[0], right: parts[0] };
  if (parts.length === 2) return { top: parts[0], bottom: parts[0], left: parts[1], right: parts[1] };
  if (parts.length === 4) return { top: parts[0], bottom: parts[2], left: parts[3], right: parts[1] };
}

const normalize = (style: CSSProperties): CSSProperties => {
  const {
    margin,
    marginTop = decodeBox(margin)?.top,
    marginBottom = decodeBox(margin)?.bottom,
    marginLeft = decodeBox(margin)?.left,
    marginRight = decodeBox(margin)?.right,
    padding,
    paddingTop = decodeBox(padding)?.top,
    paddingBottom = decodeBox(padding)?.bottom,
    paddingLeft = decodeBox(padding)?.left,
    paddingRight = decodeBox(padding)?.right,
    borderColor,
    borderTopColor = decodeBox(borderColor)?.top,
    borderBottomColor = decodeBox(borderColor)?.bottom,
    borderLeftColor = decodeBox(borderColor)?.left,
    borderRightColor = decodeBox(borderColor)?.right,
    borderWidth,
    borderTopWidth = decodeBox(borderWidth)?.top,
    borderBottomWidth = decodeBox(borderWidth)?.bottom,
    borderLeftWidth = decodeBox(borderWidth)?.left,
    borderRightWidth = decodeBox(borderWidth)?.right,
    borderStyle,
    borderTopStyle = decodeBox(borderStyle)?.top,
    borderBottomStyle = decodeBox(borderStyle)?.bottom,
    borderLeftStyle = decodeBox(borderStyle)?.left,
    borderRightStyle = decodeBox(borderStyle)?.right,
    borderRadius,
    borderTopLeftRadius = decodeBox(borderRadius)?.top,
    borderBottomLeftRadius = decodeBox(borderRadius)?.bottom,
    borderTopRightRadius = decodeBox(borderRadius)?.left,
    borderBottomRightRadius = decodeBox(borderRadius)?.right,
    ..._style
  } = style;
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
    ..._.isNil(borderTopStyle) ? {} : { borderTopStyle },
    ..._.isNil(borderBottomStyle) ? {} : { borderBottomStyle },
    ..._.isNil(borderLeftStyle) ? {} : { borderLeftStyle },
    ..._.isNil(borderRightStyle) ? {} : { borderRightStyle },
    ..._.isNil(borderTopLeftRadius) ? {} : { borderTopLeftRadius },
    ..._.isNil(borderBottomLeftRadius) ? {} : { borderBottomLeftRadius },
    ..._.isNil(borderTopRightRadius) ? {} : { borderTopRightRadius },
    ..._.isNil(borderBottomRightRadius) ? {} : { borderBottomRightRadius },
  } as CSSProperties;
}

const _flatten = (styles?: StyleProp<CSSProperties>): CSSProperties[] => {
  if (_.isArray(styles)) return _.flatMap(styles, v => _flatten(v as any));
  if (_.isNumber(styles)) return [styles.__registeredStyleBrand];
  return styles ? [styles] : [];
}

export const flattenCSSStyle = (styles?: StyleProp<CSSProperties>) => {
  return _.reduce(_flatten(styles), (acc, style) => ({ ...normalize(acc), ...normalize(style) }), {} as CSSProperties);
}
