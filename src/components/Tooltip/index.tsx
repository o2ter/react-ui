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
import { createMemoComponent } from '../../internals/utils';
import { Popover } from '../Popover';
import { useComponentStyle } from '../Style';
import { useStableCallback } from 'sugax';
import { TextStyleProvider, flattenStyle } from '../index.web';
import { textStyleKeys } from '../Text/style';
import { StyleSheet } from 'react-native';

export const Tooltip = createMemoComponent((
  {
    containerStyle,
    render,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof Popover>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Popover>>
) => {

  const defaultStyle = useComponentStyle('tooltip');
  const _defaultStyle = React.useMemo(() => flattenStyle([{
    color: 'white',
    backgroundColor: 'black',
    borderWidth: 0,
    shadowOpacity: 0,
  }, defaultStyle, containerStyle]), [defaultStyle, containerStyle]);

  const _styles = React.useMemo(() => StyleSheet.create({
    text: _.pick(_defaultStyle, textStyleKeys),
    container: _.omit(_defaultStyle, textStyleKeys),
  }), [_defaultStyle]);

  const _render = useStableCallback(() => (
    <TextStyleProvider style={_styles.text}>{render()}</TextStyleProvider>
  ));

  return (
    <Popover
      ref={forwardRef}
      render={_render}
      containerStyle={_styles.container}
      {...props}
    >{children}</Popover>
  );
}, {
  displayName: 'Tooltip',
});
