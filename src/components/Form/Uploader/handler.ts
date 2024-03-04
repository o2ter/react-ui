//
//  handler.ts
//
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
//

import _ from 'lodash';
import { createChannel, useChannel } from 'sugax';

export type FormUpload<F, U> = FormUploadHandler<F, U> | U;

export type FormUploaderCallback<F, U> = (
  file: F,
  progress: (bytes: number, total: number) => void
) => PromiseLike<U>;

export class FormUploadHandler<F, U> {

  #file: F;
  #upload: FormUploaderCallback<F, U>;
  #refresh: () => void;
  #complete: (uploaded: U, handler: FormUploadHandler<F, U>) => void;

  #promise?: Promise<void>;
  #progress = createChannel({ bytes: 0, total: 0 });
  #error = createChannel<Error | null>(null);

  constructor(
    file: F,
    upload: FormUploaderCallback<F, U>,
    refresh: () => void,
    complete: (uploaded: U, handler: FormUploadHandler<F, U>) => void
  ) {
    this.#file = file;
    this.#upload = upload;
    this.#refresh = refresh;
    this.#complete = complete;
  }

  get file() {
    return this.#file;
  }

  get error() {
    return this.#error.current;
  }

  startUpload() {
    if (_.isNil(this.#promise)) {
      this.#promise = (async () => {
        try {
          this.#error.setValue(null);
          const uploaded = await this.#upload(this.#file, (bytes, total) => {
            this.#progress.setValue({ bytes, total });
            this.#refresh();
          });
          this.#complete(uploaded, this);
          this.#refresh();
        } catch (e) {
          this.#error.setValue(e as Error);
          this.#promise = undefined;
          this.#refresh();
        }
      })();
    }
    return this.#promise;
  }

  useProgress() {
    return useChannel(this.#progress);
  }

  useError() {
    return useChannel(this.#error);
  }
}
