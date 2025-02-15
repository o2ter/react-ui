//
//  context.ts
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
import { Awaitable } from '@o2ter/utils-js';

export const ActivityIndicatorContext = React.createContext<{
  setTasks: React.Dispatch<React.SetStateAction<string[]>>;
  defaultDelay: number;
}>({
  setTasks: () => { },
  defaultDelay: 250,
});

ActivityIndicatorContext.displayName = 'ActivityIndicatorContext';

export const useActivity = () => {

  const { setTasks, defaultDelay } = React.useContext(ActivityIndicatorContext);

  return async <T>(callback: () => Awaitable<T>, delay?: number) => {

    const id = _.uniqueId();

    let completed = false;
    const _delay = delay ?? defaultDelay;

    if (_.isNumber(_delay) && _delay > 0) {
      setTimeout(() => { if (!completed) setTasks(tasks => [...tasks, id]); }, _delay);
    } else {
      setTasks(tasks => [...tasks, id]);
    }

    try {

      const result = await callback();

      completed = true;
      setTasks(tasks => _.filter(tasks, x => x !== id));

      return result;

    } catch (e) {

      completed = true;
      setTasks(tasks => _.filter(tasks, x => x !== id));

      throw e;
    }
  };
};
