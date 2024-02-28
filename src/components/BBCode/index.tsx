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
import { TextStyle, Pressable, Platform, Linking, ViewStyle } from 'react-native';
import View from '../View';
import Text from '../Text';
import Image from '../Image';
import { useTheme } from '../../theme';
import { parser } from './parser/ast';
import { createMemoComponent } from '../../internals/utils';

export * from './editor';

type BBCodeProps = React.ComponentPropsWithoutRef<typeof View> & {
  source?: { content?: string };
  onPressLink?: (link: string) => void;
};

type LinkProps = React.PropsWithChildren<{
  link: string;
  onPressLink?: (link: string) => void;
}>;

const Link = ({
  link,
  onPressLink,
  children,
}: LinkProps) => {
  if (_.isFunction(onPressLink)) {
    return <Pressable onPress={() => onPressLink(link)}>{children}</Pressable>
  }
  return Platform.select({
    web: (
      <a href={link} target='_blank'>{children}</a>
    ),
    default: (
      <Pressable onPress={() => Linking.openURL(link)}>{children}</Pressable>
    ),
  });
}

function* group(
  segments: ReturnType<typeof parser>[number]['segments'],
) {
  let texts: typeof segments = [];
  for (const segment of segments) {
    if (_.isString(segment.insert)) {
      texts.push(segment);
    } else {
      if (!_.isEmpty(texts)) {
        yield { type: 'text', segments: texts } as const;
        texts = [];
      }
      yield { type: 'element', segment } as const;
    }
  }
  if (!_.isEmpty(texts)) {
    yield { type: 'text', segments: texts } as const;
  }
}

export const BBCode = createMemoComponent((
  {
    source,
    onPressLink,
    ...props
  }: BBCodeProps,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof View>>
) => {
  const theme = useTheme();
  const { content = '' } = source ?? {};
  const lines = React.useMemo(() => parser(content), [content]);
  return (
    <View ref={forwardRef} {...props}>
      <View>
        {_.map(lines, (line, i) => {
          if (_.isEmpty(line.segments)) return <Text key={i}>{' '}</Text>
          const grouped = [...group(line.segments)];
          const isTextLine = _.every(grouped, x => x.type === 'text');
          let classes = '';
          const containerStyle: ViewStyle = { flexDirection: 'row', alignItems: 'flex-end' };
          const textLineStyle: TextStyle = {};
          if (!_.isNil(line.attributes?.align?.align)) {
            textLineStyle.textAlign = line.attributes.align.align as any;
            switch (line.attributes.align.align) {
              case 'left': containerStyle.justifyContent = 'flex-start'; break;
              case 'right': containerStyle.justifyContent = 'flex-end'; break;
              case 'center': containerStyle.justifyContent = 'center'; break;
              case 'justify': containerStyle.justifyContent = 'flex-start'; break;
            }
          }
          if (!_.isNil(line.attributes?.indent?.indent)) {
            let indent = parseInt(line.attributes.indent.indent);
            if (_.isSafeInteger(indent)) textLineStyle.marginLeft = indent * theme.spacers['5'];
          }
          if (!_.isNil(line.attributes?.header?.header)) {
            let header = parseInt(line.attributes.header.header);
            if (_.isSafeInteger(header)) classes += ` h${header}`;
          }
          const content = _.map(grouped, (group, j) => {
            switch (group.type) {
              case 'text':
                return (
                  <Text key={j} classes={classes} style={textLineStyle}>
                    {_.map(group.segments, (segment, k) => {
                      const style: TextStyle = {};
                      for (const [key, attrs] of _.toPairs(segment.attributes)) {
                        switch (key) {
                          case 'b': style.fontWeight = 'bold'; break;
                          case 'i': style.fontStyle = 'italic'; break;
                          case 'color': style.color = attrs.color; break;
                          case 'size':
                            let size = parseFloat(attrs.size);
                            if (_.isFinite(size)) style.fontSize = size;
                            else if (theme.fontSizes[attrs.size]) style.fontSize = theme.fontSizes[attrs.size];
                            break;
                          case 'font': style.fontFamily = attrs.font; break;
                        }
                      }
                      const underline = !_.isNil(segment.attributes.u);
                      const lineThrough = !_.isNil(segment.attributes.s);
                      if (underline && lineThrough) {
                        style.textDecorationLine = 'underline line-through';
                      } else if (underline) {
                        style.textDecorationLine = 'underline';
                      } else if (lineThrough) {
                        style.textDecorationLine = 'line-through';
                      }
                      if (_.isString(segment.attributes.link?.link)) {
                        return (
                          <Link key={k} link={segment.attributes.link.link} onPressLink={onPressLink}>
                            <Text style={style}>{_.isString(segment.insert) ? segment.insert : ''}</Text>
                          </Link>
                        );
                      }
                      return <Text key={k} style={style}>{_.isString(segment.insert) ? segment.insert : ''}</Text>
                    })}
                  </Text>
                );
              case 'element':
                for (const [k, v] of _.toPairs(group.segment.insert)) {
                  switch (k) {
                    case 'img':
                      const width = parseFloat(group.segment.attributes.img?.width);
                      return (
                        <Image
                          key={j}
                          source={{ uri: v }}
                          style={{ width: _.isFinite(width) ? width : '100%' }}
                        />
                      );
                  }
                }
            }
          });
          return isTextLine ? content : (
            <View key={i} classes={classes} style={containerStyle}>
              {content}
            </View>
          );
        })}
      </View>
    </View>
  );
}, {
  displayName: 'BBCode',
})
