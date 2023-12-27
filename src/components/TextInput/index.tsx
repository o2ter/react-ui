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
import { Platform, Pressable, TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import { useDefaultInputStyle } from './style';
import { createMemoComponent, createComponent } from '../../internals/utils';
import { ClassNames, _useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';
import { useFocus, useFocusRing } from '../../internals/focus';
import { useMergeRefs } from 'sugax';
import View from '../View';

type TextInputState = {
  value: string;
  focused: boolean;
  disabled: boolean;
};

type TextInputProps = Omit<RNTextInputProps, 'style'> & {
  classes?: ClassNames;
  variant?: 'outline' | 'underlined' | 'unstyled';
  style?: StyleProp<TextStyle> | ((state: TextInputState) => StyleProp<TextStyle>);
  prepend?: React.ReactNode | ((state: TextInputState) => React.ReactNode);
  append?: React.ReactNode | ((state: TextInputState) => React.ReactNode);
};

const InnerTextInput = createComponent(({
  style,
  children,
  ...props
}: RNTextInputProps, forwardRef: React.ForwardedRef<RNTextInput>) => {
  const defaultStyle = _useComponentStyle('text');
  return (
    <RNTextInput
      ref={forwardRef}
      style={textStyleNormalize([defaultStyle, style])}
      {...props}>
      {children}
    </RNTextInput>
  );
});

export const TextInput = createMemoComponent(({
  classes,
  style,
  value,
  variant,
  editable,
  prepend,
  append,
  onFocus,
  onBlur,
  children,
  ...props
}: TextInputProps, forwardRef: React.ForwardedRef<RNTextInput>) => {

  const inputRef = React.useRef<React.ComponentRef<typeof RNTextInput>>();
  const ref = useMergeRefs(inputRef, forwardRef);

  const theme = useTheme();

  const [focused, _onFocus, _onBlur] = useFocus(onFocus, onBlur);

  const textStyle = _useComponentStyle('text');
  const textInputStyle = _useComponentStyle('textInput', classes, [
    focused && 'focus',
  ]);
  const defaultStyle = useDefaultInputStyle(theme, variant);

  const focusRing = useFocusRing(focused);

  const state = { focused, disabled: !editable, value: value ?? '' };

  if (!prepend && !append) {
    return (
      <RNTextInput
        ref={ref}
        value={value}
        style={textStyleNormalize([
          defaultStyle,
          focusRing,
          textStyle,
          textInputStyle,
          _.isFunction(style) ? style(state) : style,
        ])}
        editable={editable}
        onFocus={_onFocus}
        onBlur={_onBlur}
        {...props}>
        {children}
      </RNTextInput>
    );
  }

  return (
    <Pressable onFocus={() => void inputRef.current?.focus()}>
      <View style={[
        {
          flexDirection: 'row',
          gap: theme.spacer * 0.375,
        },
        defaultStyle,
        focusRing,
        textStyle,
        textInputStyle,
        _.isFunction(style) ? style(state) : style,
      ]}>
        {_.isFunction(prepend) ? prepend(state) : prepend}
        <InnerTextInput
          ref={ref}
          value={value}
          style={[
            { flex: 1 },
            Platform.select({
              web: { outline: 0 } as any,
              default: {},
            }),
          ]}
          editable={editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          {...props}>
          {children}
        </InnerTextInput>
        {_.isFunction(append) ? append(state) : append}
      </View>
    </Pressable>
  );
}, {
  displayName: 'TextInput',
});

export default TextInput;