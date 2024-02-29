//
//  index.tsx
//
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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

export const FormUploader = createMemoComponent(<
  File extends unknown,
  Uploaded extends unknown
>(
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
    }
    addEventListener('submit', listener);
    return () => removeEventListener('submit', listener);
  }, [uploads]);

  const _onUpload = useStableCallback(onUpload);
  const submitFiles = useStableCallback((...files: File[]) => {
    const uploads = _.map(files, file => new FormUploadHandler(
      file, _onUpload,
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
