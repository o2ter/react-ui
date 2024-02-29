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
import { RichTextInput } from '../../RichTextInput';
import { useField } from '../Form/hooks';
import FormUploader from '../Uploader';
import { createMemoComponent } from '../../../internals/utils';
import { useMergeRefs } from 'sugax';

type FormRichTextProps<F, U> = React.ComponentPropsWithoutRef<typeof RichTextInput> & {
  name: string;
  uploadProps?: React.ComponentPropsWithoutRef<typeof FormUploader<F, U>> & { resolveUrl: (uploaded: U) => string; };
  validate?: (value: any) => void;
};

export const FormRichText = createMemoComponent(<
  File extends unknown,
  Uploaded extends unknown
>(
  {
    name,
    uploadProps,
    validate,
    ...props
  }: FormRichTextProps<File, Uploaded>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RichTextInput>>
) => {
  const inputRef = React.useRef<React.ComponentRef<typeof RichTextInput>>();
  const ref = useMergeRefs(inputRef, forwardRef);
  const { value, setTouched, onChange, useValidator } = useField(name);
  useValidator(validate);
  if (uploadProps) {
    const { onUpload, resolveUrl, ..._props } = uploadProps;
    return (
      <FormUploader
        onUpload={async (file: File, progress) => {
          const result = await onUpload(file, progress);
          return result;
        }}
        {..._props}
      >
        {({ submitFiles }) => (
          <RichTextInput
            ref={ref}
            value={value}
            onChangeText={(text) => {
              onChange(text);
              setTouched();
            }}
            {...props}
          />
        )}
      </FormUploader>
    );
  }
  return (
    <RichTextInput
      ref={ref}
      value={value}
      onChangeText={(text) => {
        onChange(text);
        setTouched();
      }}
      {...props}
    />
  );
}, {
  displayName: 'Form.RichText'
});

export default FormRichText;
