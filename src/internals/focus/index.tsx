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
import { Platform } from 'react-native';
import { useStableRef } from 'sugax';
import { tintColor } from '../../color';
import { useTheme } from '../../theme';
import { selectPlatformShadow } from '../../shadow';
import { rgba } from '../color';
import { useAnimate } from 'sugax';

export const useFocus = <T extends (...args: any) => void>(
  onFocus?: T | null,
  onBlur?: T | null,
) => {
  const [focused, setFocused] = React.useState(false);
  const callbacks = useStableRef({
    focus: ((...args) => {
      if (_.isFunction(onFocus)) onFocus(...args);
      setFocused(true);
    }) as T,
    blur: ((...args) => {
      if (_.isFunction(onBlur)) onBlur(...args);
      setFocused(false);
    }) as T,
  });
  const _focus = React.useCallback(((...args) => callbacks.current.focus(...args)) as T, []);
  const _blur = React.useCallback(((...args) => callbacks.current.blur(...args)) as T, []);
  return [focused, _focus, _blur] as const;
}

export const useFocusRing = (
  focused: boolean,
  variant: string = 'primary',
) => {
  const theme = useTheme();
  const { value, start } = useAnimate(0);
  React.useEffect(() => {
    start({
      toValue: focused ? 1 : 0,
      duration: 100,
    });
  }, [focused]);
  const outline = Platform.select({
    web: { outline: 0 } as any,
    default: {},
  });
  if (value === 0) return outline;
  return {
    borderColor: tintColor(theme.themeColors[variant], 0.5),
    ...outline,
    ...selectPlatformShadow({
      shadowColor: theme.themeColors[variant],
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 4 * value,
      boxShadow: `0 0 0 ${4 * value}px ${rgba(theme.themeColors[variant], 0.25)}`
    }),
  };
}
