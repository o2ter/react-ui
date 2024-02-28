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
import { Base } from './base';
import { createMemoComponent } from '../../internals/utils';
import { Format, _format } from './format';

type RichTextInputProps<F extends keyof Format> = Omit<React.ComponentPropsWithoutRef<typeof Base>, 'value' | 'onChangeText'> & {
  format?: F;
  value?: ReturnType<Format[F]['encoder']>;
  onChangeText?: (text: ReturnType<Format[F]['encoder']>) => void;
}

export const RichTextInput = createMemoComponent(<F extends keyof Format = 'bbcode'>(
  {
    format,
    value,
    onChangeText,
    options = {},
    ...props
  }: RichTextInputProps<F>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof Base>>
) => {
  const { defaultOptions, encoder, decoder } = _format[format ?? 'bbcode' as F];
  const _value = React.useMemo(() => decoder(value ?? '' as any), [value]);
  return (
    <Base
      ref={forwardRef}
      value={_value}
      onChangeText={(delta) => {
        if (_.isFunction(onChangeText)) onChangeText(encoder(delta) as any);
      }}
      options={{
        theme: 'snow',
        ...defaultOptions,
        ...options,
        modules: {
          ...defaultOptions.modules ?? {},
          ...options.modules ?? {},
        },
      }}
      {...props}
    />
  );
}, {
  displayName: 'RichTextInput',
});
