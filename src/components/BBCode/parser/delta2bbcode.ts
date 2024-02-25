//
//  delta2bbcode.ts
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
import { html_escaper } from './ast';

export const delta2bbcode = (docs: any[]) => {
  let result = '';
  for (const line of docs) {
    for (const [k, v] of _.toPairs(line.attributes)) {
      switch (k) {
        case 'align':
          switch (v) {
            case 'left': result += '[left]'; break;
            case 'right': result += '[right]'; break;
            case 'center': result += '[center]'; break;
            case 'justify': result += '[justify]'; break;
          } break;
        case 'indent': result += `[indent=${v}]`; break;
        case 'header': result += `[header=${v}]`; break;
      }
    }
    let currentAttrs: Record<string, any> = {};
    for (const { insert, attributes = {} } of line.segments) {
      if (_.isString(insert)) {
        const add: Record<string, any> = {};
        const remove: Record<string, any> = {};
        for (const k of _.uniq([..._.keys(currentAttrs), ..._.keys(attributes)])) {
          if (attributes[k] === currentAttrs[k]) continue;
          if (!_.isNil(attributes[k])) add[k] = attributes[k];
          if (!_.isNil(currentAttrs[k])) remove[k] = currentAttrs[k];
        }
        for (const k of _.keys(remove).reverse()) {
          switch (k) {
            case 'font': result += '[/font]'; break;
            case 'size': result += '[/size]'; break;
            case 'color': result += '[/color]'; break;
            case 'bold': result += '[/b]'; break;
            case 'italic': result += '[/i]'; break;
            case 'strike': result += '[/s]'; break;
            case 'underline': result += '[/u]'; break;
            case 'link': result += '[/link]'; break;
          }
        }
        currentAttrs = _.omit(currentAttrs, ..._.keys(remove));
        for (const [k, v] of _.toPairs(add)) {
          currentAttrs[k] = v;
          switch (k) {
            case 'font': result += `[font=${v}]`; break;
            case 'size': result += `[size=${v}]`; break;
            case 'color': result += `[color=${v}]`; break;
            case 'bold': result += '[b]'; break;
            case 'italic': result += '[i]'; break;
            case 'strike': result += '[s]'; break;
            case 'underline': result += '[u]'; break;
            case 'link': result += `[link=${v}]`; break;
          }
        }
        result += html_escaper.escape(insert);
      } else {
        for (const [k, v] of _.toPairs(insert)) {
          switch (k) {
            case 'image':
              if (attributes.width) {
                result += `[img width=${attributes.width}]${html_escaper.escape(v as string)}[/img]`;
              } else {
                result += `[img]${html_escaper.escape(v as string)}[/img]`;
              }
              break;
          }
        }
      }
    }
    for (const k of _.keys(currentAttrs).reverse()) {
      switch (k) {
        case 'font': result += '[/font]'; break;
        case 'size': result += '[/size]'; break;
        case 'color': result += '[/color]'; break;
        case 'bold': result += '[/b]'; break;
        case 'italic': result += '[/i]'; break;
        case 'strike': result += '[/s]'; break;
        case 'underline': result += '[/u]'; break;
        case 'link': result += '[/link]'; break;
      }
    }
    for (const [k, v] of _.toPairs(line.attributes).reverse()) {
      switch (k) {
        case 'align':
          switch (v) {
            case 'left': result += '[/left]'; break;
            case 'right': result += '[/right]'; break;
            case 'center': result += '[/center]'; break;
            case 'justify': result += '[/justify]'; break;
          } break;
        case 'indent': result += '[/indent]'; break;
        case 'header': result += '[/header]'; break;
      }
    }
    result += '\n';
  }
  return result;
}