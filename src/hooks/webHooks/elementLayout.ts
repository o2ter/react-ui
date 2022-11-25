//
//  elementLayout.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2022 O2ter Limited. All rights reserved.
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
import { UIManager } from 'react-native';

type LayoutValue = {
  x: number,
  y: number,
  width: number,
  height: number,
  left: number,
  top: number,
};

type LayoutEvent<T> = {
  nativeEvent: {
    layout: LayoutValue,
    target: T,
  },
  timeStamp: number,
};

const onLayoutCallbackMap = new WeakMap<object, (event: LayoutEvent<any>) => void>();

const resizeObserver = (() => {

  if (typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') return;

  return new window.ResizeObserver((entries) => {

    for (const entry of entries) {

      const node = entry.target;
      const onLayout = onLayoutCallbackMap.get(node);

      if (_.isFunction(onLayout)) {

        UIManager.measure(node as any, (x, y, width, height, left, top) => {
          const event: LayoutEvent<any> = {
            nativeEvent: {
              layout: { x, y, width, height, left, top },
              get target() { return entry.target },
            },
            timeStamp: Date.now(),
          };
          onLayout(event);
        });
      }
    }
  });
})();

export const useElementLayout = <T extends Element>(
  ref: React.RefObject<T>,
  onLayout: (event: LayoutEvent<T>) => void
) => {

  if (_.isNil(resizeObserver)) return;

  React.useEffect(() => {
    const node = ref.current;
    if (!_.isNil(node)) {
      onLayoutCallbackMap.set(node, onLayout);
    }
    return () => {
      if (!_.isNil(node)) {
        resizeObserver.unobserve(node);
      }
    };
  }, [ref, onLayout]);

  React.useEffect(() => {
    const node = ref.current;
    if (!_.isNil(node)) {
      const onLayout = onLayoutCallbackMap.get(node);
      if (_.isFunction(onLayout)) {
        resizeObserver.observe(node);
      } else {
        resizeObserver.unobserve(node);
      }
    }
    return () => {
      if (!_.isNil(node)) {
        resizeObserver.unobserve(node);
      }
    };
  }, [ref]);
}