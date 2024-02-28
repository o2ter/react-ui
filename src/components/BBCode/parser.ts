//
//  ast.ts
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

export const html_escaper = (() => {

  const ds = /[0-9]{2,3}/g;
  const es = /&(?:amp|lt|gt|apos|quot|#[0-9]{2,3});/g;
  const ca = /[&<>\[\]'"]/g;

  const esca = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '[': '&#91;',
    ']': '&#93;',
    "'": '&#39;',
    '"': '&quot;'
  };
  const pe = (m: string) => esca[m as keyof typeof esca];

  const unes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&quot;': '"'
  };
  const cape = (m: string) => {
    const digits = m.match(ds);
    if (digits) {
      const ascii = parseInt(digits as any);
      if (32 <= ascii && ascii <= 126)
        return String.fromCharCode(ascii);
    }
    return unes[m as keyof typeof unes];
  };

  return {
    escape: (es: string) => es.replace(ca, pe),
    unescape: (un: string) => un.replace(es, cape),
  };

})();

const tags: any = {
  b: {},
  i: {},
  s: {},
  u: {},
  // sub: {},
  // sup: {},
  font: {},
  size: {},
  header: { lineAttr: true },
  color: {},
  link: {},
  left: { alias: 'align', lineAttr: true },
  center: { alias: 'align', lineAttr: true },
  right: { alias: 'align', lineAttr: true },
  justify: { alias: 'align', lineAttr: true },
  indent: { lineAttr: true },
  // table: { block: true },
  // tr: { block: true },
  // td: { block: true },
  // ul: { block: true },
  // ol: { block: true },
  // li: { isSelfClosing: true },
  img: { stringContent: true },
}

const tag_regex = /\[([^\/\[\]\n\r\s=]+)(?:=([^\[\]\n\r]+))?((?:\s+(?:[^\/\[\]\n\r\s=]+)=(?:[^\[\]\n\r\s]+))*)\]|\[\/([^\/\[\]\n\r\s=]+)\]/;
const space_regex = /\s+/;
const attrs_regex = /([^\/\[\]\n\r\s=]+)=([^\[\]\n\r\s]+)/;

const match_result = (matches: RegExpExecArray) => {

  const [match, tag1, attr, attrs_str, tag2] = matches;
  const tag = tag1 ?? tag2;

  const attrs_list = _.split(attrs_str, space_regex).filter(x => !_.isEmpty(x));
  const attrs: Record<string, string> = {};

  for (const [, key, val] of attrs_list.map(x => attrs_regex.exec(x) ?? [])) {
    if (!_.isNil(key) && !_.isNil(val)) {
      attrs[key] = val;
    }
  }

  const _attrs = _.isNil(attr) ? attrs : {
    [tag]: attr,
    ...attrs
  };

  return { match, tag, attrs: _attrs };
}

type Segment = {
  attributes: Record<string, Record<string, string>>;
  insert: string | Record<string, string>;
};

type Line = {
  attributes: Record<string, Record<string, string>>;
  segments: Segment[];
};

export const parser = (docs: string) => {
  const result: Line[] = [];
  const attributes: Record<string, any> = {};
  const line_attributes: Record<string, any> = {};
  for (let line of _.split(docs, /\r\n|\r|\n/)) {
    let segments: Segment[] = [];
    const pushLine = () => {
      result.push({
        segments,
        attributes: _.omitBy(line_attributes, v => _.isNil(v)),
      });
    }
    const pushSegment = (segment: string) => {
      segments.push({
        insert: html_escaper.unescape(segment),
        attributes: _.omitBy(attributes, v => _.isNil(v)),
      });
    }
    if (_.isEmpty(line)) {
      pushLine();
      continue;
    }
    while (line.length > 0) {
      const matches = tag_regex.exec(line);
      if (!matches) {
        pushSegment(line);
        break;
      }

      const { match, tag, attrs } = match_result(matches);
      const prefix = line.slice(0, matches.index);
      line = line.slice(matches.index + matches[0].length);

      const _attributes = tags[tag]?.lineAttr ? line_attributes : attributes;

      if (prefix) pushSegment(prefix);

      if (!(tag in tags)) {
        pushSegment(match);
      } else if (match.startsWith('[/')) {
        if (tags[tag].lineAttr && !_.isEmpty(segments)) {
          pushLine();
          segments = [];
        }
        _attributes[tags[tag].alias ?? tag] = undefined;
      } else {
        if (!_.isNil(_attributes[tags[tag].alias ?? tag])) {
          pushSegment(match);
        } else {
          if (tags[tag].lineAttr && !_.isEmpty(segments)) {
            pushLine();
            segments = [];
          }
          if (tags[tag].stringContent) {
            const pattern = `[/${tag}]`;
            const index = line.indexOf(pattern);
            if (index === -1) {
              pushSegment(prefix);
            } else {
              segments.push({
                insert: { [tag]: line.slice(0, index) },
                attributes: { [tag]: attrs },
              });
              line = line.slice(index + pattern.length);
            }
          } else {
            _attributes[tags[tag].alias ?? tag] = tags[tag].alias ? { [tags[tag].alias ?? tag]: tag } : attrs;
          }
        }
      }
    }
    if (!_.isEmpty(segments)) pushLine();
  }
  return result;
};