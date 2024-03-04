//
//  handler.ts
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
