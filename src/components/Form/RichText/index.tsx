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
import { FormUploadHandler } from '../Uploader/handler';

type FormRichTextProps<U> = Omit<React.ComponentPropsWithoutRef<typeof RichTextInput>, 'onUploadImage'> & {
  name: string;
  uploadProps?: React.ComponentPropsWithRef<typeof FormUploader<Blob & { source: string }, U>> & {
    resolveUrl: (uploaded: U) => string;
  };
  validate?: (value: any) => void;
};

const dataUrlToBlob = async (data: string) => {
  try {
    if (!data.startsWith('data:')) return;
    const response = await fetch(data);
    return await response.blob();
  } catch (e) { }
}

export const FormRichText = createMemoComponent(<Uploaded extends unknown>(
  {
    name,
    uploadProps,
    validate,
    ...props
  }: FormRichTextProps<Uploaded>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RichTextInput>>
) => {
  const inputRef = React.useRef<React.ComponentRef<typeof RichTextInput>>();
  const ref = useMergeRefs(inputRef, forwardRef);
  const { value, setTouched, onChange, useValidator } = useField(name);
  useValidator(validate);
  const cache = React.useRef(new Map<Blob & { source: string }, Uploaded>).current;
  if (uploadProps) {
    const { onUpload, resolveUrl, ..._props } = uploadProps;
    const updateResolvedUploads = () => {
      const editor = inputRef.current;
      if (!editor) return;
      const assets = _.fromPairs(_.map([...cache.entries()], ([blob, uploaded]) => [blob.source, resolveUrl(uploaded)]));
      editor.replaceAssets(assets);
    };
    return (
      <FormUploader
        onUpload={async (file: Blob & { source: string }, progress) => {
          const result = await onUpload(file, progress);
          cache.set(file, result);
          updateResolvedUploads();
          return result;
        }}
        {..._props}
      >
        {({ setUploads, submitFiles }) => (
          <RichTextInput
            ref={ref}
            value={value}
            onChangeText={async (text) => {
              onChange(text);
              setTouched();
              updateResolvedUploads();
              const assets = inputRef.current?.assets;
              if (!assets) return;
              setUploads(uploads => {
                let result = [...uploads];
                for (const upload of uploads) {
                  if (_.includes(
                    assets,
                    upload instanceof FormUploadHandler ? upload.file.source : resolveUrl(upload)
                  )) continue;
                  result = _.filter(result, x => x !== upload);
                }
                return result;
              });
              const files = _.compact(await Promise.all(assets.map(async source => {
                const blob = await dataUrlToBlob(source);
                if (blob) return _.assign(blob, { source });
              })));
              if (!_.isEmpty(files)) submitFiles(...files);
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
