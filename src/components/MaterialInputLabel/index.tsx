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
import Text from '../Text';
import { StyleProp, TextStyle } from 'react-native';
import { useAnimate } from 'sugax';
import { _useComponentStyle } from '../Style';
import { useTheme } from '../../theme';

type MaterialInputLabelProps = React.ComponentPropsWithoutRef<typeof Text> & {
  label: string;
  style?: StyleProp<TextStyle>;
  focused: boolean;
  active: boolean;
};

export const MaterialInputLabel = ({
  label,
  style,
  focused,
  active,
  ...props
}: MaterialInputLabelProps) => {
  const theme = useTheme();
  const defaultStyle = _useComponentStyle('text') as TextStyle;
  const fontSize = defaultStyle.fontSize ?? theme.root.fontSize;
  const _active = focused || active;
  const { value, start } = useAnimate(_active ? 0 : 1);
  React.useEffect(() => {
    start({
      toValue: _active ? 0 : 1,
      duration: 100,
    });
  }, [_active]);
  return (
    <Text
      style={[
        {
          maxWidth: '75%',
          fontSize: fontSize * 0.75,
          color: theme.grays['500'],
          userSelect: 'none',
        },
        value > 0 && {
          transformOrigin: 'top left',
          transform: [
            { scale: value / 3 + 1 },
            { translateY: value * fontSize * 0.375 },
          ],
        },
        style,
      ]}
      {...props}
    >{label}</Text>
  );
};