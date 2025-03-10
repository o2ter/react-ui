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
import { RichTextInput, Format } from '../../RichTextInput';
import { useField, useForm } from '../Form/hooks';
import { createMemoComponent } from '../../../internals/utils';
import { useMergeRefs } from 'sugax';

type FormRichTextProps<U, F extends keyof Format> = React.ComponentPropsWithoutRef<typeof RichTextInput<F>> & {
  name: string;
  uploadProps?: {
    onUpload: (file: Blob & { source: string }) => PromiseLike<U>;
    resolveUrl: (uploaded: U) => string;
  };
  validate?: (value: any) => void;
};

const dataUrlToBlob = async (data: string) => {
  try {
    if (!data.startsWith('data:')) return;
    const response = await fetch(data);
    return await response.blob();
  } catch { }
}

export const FormRichText = createMemoComponent(<Uploaded extends unknown, F extends keyof Format = 'bbcode'>(
  {
    name,
    uploadProps,
    validate,
    ...props
  }: FormRichTextProps<Uploaded, F>,
  forwardRef: React.ForwardedRef<React.ComponentRef<typeof RichTextInput<F>>>
) => {
  const inputRef = React.useRef<React.ComponentRef<typeof RichTextInput<F>>>();
  const ref = useMergeRefs(inputRef, forwardRef);
  const { addEventListener, removeEventListener } = useForm();
  const { value, setTouched, onChange, useValidator } = useField(name);
  useValidator(validate);
  const [uploads, setUploads] = React.useState<{
    uploaded: Record<string, Uploaded>;
    promises: Record<string, Promise<void> | (() => Promise<void>)>;
  }>({ uploaded: {}, promises: {} });
  React.useEffect(() => {
    if (!uploadProps) return;
    const assets = _.uniq(inputRef.current?.assets);
    for (const source of assets) {
      if (uploads.uploaded[source] || uploads.promises[source]) continue;
      const callback = async () => {
        try {
          const blob = await dataUrlToBlob(source);
          if (blob) throw Error('Invalid file');
          const saved = await uploadProps.onUpload(_.assign(blob, { source }));
          setUploads(v => ({
            uploaded: { ...v.uploaded, [source]: saved },
            promises: _.omit(v.promises, source),
          }));
        } catch (e) {
          setUploads(v => ({
            ...v,
            promises: { ...v.promises, [source]: callback },
          }));
          throw e;
        }
      };
      setUploads(v => ({
        ...v,
        promises: { ...v.promises, [source]: callback },
      }));
    }
    inputRef.current?.replaceAssets(_.mapValues(uploads.uploaded, v => uploadProps.resolveUrl(v)));
  }, [value, uploads]);
  React.useEffect(() => {
    if (!uploadProps || _.isEmpty(uploads.promises)) return;
    const listener = async (action: string) => {
      if (action !== 'submit') return;
      for (const item of _.values(uploads.promises)) {
        await (_.isFunction(item) ? item() : item);
      }
    }
    addEventListener(listener);
    return () => removeEventListener(listener);
  }, [uploads]);
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
