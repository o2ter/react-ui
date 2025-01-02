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
import { useStableCallback } from 'sugax';
import { FormUpload, FormUploadHandler, FormUploaderCallback } from './handler';
import { useField } from '../Form/hooks';
import { createMemoComponent } from '../../../internals/utils';

type FormUploaderState<F, U> = {
  uploads: FormUpload<F, U>[];
  setUploads: React.Dispatch<React.SetStateAction<FormUpload<F, U>[]>>;
  submitFiles: (...files: F[]) => void;
};

type FormUploaderProps<F, U> = {
  name: string | string[];
  onUpload: FormUploaderCallback<F, U>;
  validate?: (value: any) => void;
  children: React.ReactNode | ((state: FormUploaderState<F, U>) => React.ReactNode);
};

export const FormUploader = createMemoComponent(<File extends unknown, Uploaded extends unknown>(
  {
    name,
    onUpload,
    validate,
    children
  }: FormUploaderProps<File, Uploaded>,
  forwardRef: React.ForwardedRef<FormUploaderState<File, Uploaded>>
) => {
  const {
    value,
    onChange,
    refresh,
    setTouched,
    useValidator,
    form: {
      addEventListener,
      removeEventListener,
    },
  } = useField(name);

  useValidator(validate);

  const initial = _.castArray(value ?? []);

  const [_uploads, setUploads] = React.useState<FormUpload<File, Uploaded>[]>();
  const uploads = React.useMemo(() => _uploads ?? initial, [_uploads, value]);

  React.useEffect(() => {
    if (uploads === initial) return;
    onChange(_.filter(uploads, x => !(x instanceof FormUploadHandler)));
    setTouched();
  }, [uploads]);

  React.useEffect(() => {
    const listener = async () => {
      const _uploads = _.filter(uploads, x => x instanceof FormUploadHandler) as FormUploadHandler<File, Uploaded>[];
      await Promise.all(_.map(_uploads, x => x.startUpload()));
      for (const { error } of _uploads) {
        if (error) throw error;
      }
      onChange(_.map(uploads, x => x instanceof FormUploadHandler ? x.uploaded : x));
      setTouched();
    }
    addEventListener('submit', listener);
    return () => removeEventListener('submit', listener);
  }, [uploads]);

  const _onUpload = useStableCallback(onUpload);
  const submitFiles = useStableCallback((...files: File[]) => {
    const uploads = _.map(files, file => new FormUploadHandler(
      file, refresh, _onUpload,
      (uploaded, handler) => {
        setUploads(x => x ? _.map(x, v => v === handler ? uploaded : v) : [uploaded]);
      }
    ));
    setUploads(x => [...x ?? initial, ...uploads]);
    uploads.forEach(x => x.startUpload());
  });

  const state: FormUploaderState<File, Uploaded> = React.useMemo(() => ({
    uploads,
    setUploads: (v) => setUploads(_.isFunction(v) ? (x) => v(x ?? initial) : v ?? []),
    submitFiles,
  }), [uploads]);

  React.useImperativeHandle(forwardRef, () => state, [state]);

  return (
    <>{_.isFunction(children) ? children(state) : children}</>
  );
}, {
  displayName: 'Form.Uploader'
});

export default FormUploader;
