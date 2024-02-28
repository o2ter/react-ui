//
//  bbcode2delta.ts
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
import { parser } from '../../../BBCode/parser';
import { Line, Segment } from '../../types';

export const bbcode2delta = (docs: string) => {
  const result: Line[] = [];
  for (const line of parser(docs)) {
    const segments: Segment[] = [];
    for (const segment of line.segments) {
      const attributes: Record<string, any> = {};
      for (const [key, attrs] of _.toPairs(segment.attributes)) {
        switch (key) {
          case 'b': attributes.bold = true; break;
          case 'i': attributes.italic = true; break;
          case 's': attributes.strike = true; break;
          case 'u': attributes.underline = true; break;
          case 'font': attributes.font = attrs.font; break;
          case 'size': attributes.size = attrs.size; break;
          case 'color': attributes.color = attrs.color; break;
          case 'link': attributes.link = attrs.link; break;
        }
      }
      if (_.isString(segment.insert)) {
        segments.push({ insert: segment.insert, attributes });
      } else {
        for (const [key, value] of _.toPairs(segment.insert)) {
          switch (key) {
            case 'img':
              segments.push({
                insert: { image: value },
                attributes: {
                  ...attributes,
                  ...segment.attributes.img ?? {},
                },
              });
          }
        }
      }
    }
    const attributes: Record<string, any> = {};
    if (!_.isNil(line.attributes?.align?.align)) attributes.align = line.attributes.align.align;
    if (!_.isNil(line.attributes?.indent?.indent)) {
      let indent = parseInt(line.attributes.indent.indent);
      if (_.isSafeInteger(indent)) attributes.indent = indent;
    }
    if (!_.isNil(line.attributes?.header?.header)) {
      let header = parseInt(line.attributes.header.header);
      if (_.isSafeInteger(header)) attributes.header = header;
    }
    result.push({ segments, attributes });
  }
  return result;
};