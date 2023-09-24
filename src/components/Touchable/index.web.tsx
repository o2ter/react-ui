//
//  index.web.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2023 O2ter Limited. All rights reserved.
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
import { TouchableWithoutFeedback } from 'react-native';
import { NodeHandleProvider } from '../NodeHandleProvider';
import { TouchableProps } from './types';
import { createMemoComponent } from '../../internals/utils';

export const supportsPointerEvent = () => typeof window !== 'undefined' && window.PointerEvent != null;
const options = { passive: true };

function normalizeEvent(event: any) {
  event.nativeEvent = event;
  return event;
}

function registerEventListener(nodeHandle: EventTarget | undefined, event: string, callback: ((event: any) => void) | undefined) {

  React.useEffect(() => {

    if (!(nodeHandle instanceof EventTarget) || !_.isFunction(callback)) return;

    const _callback = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      callback(normalizeEvent(e));
    }
    nodeHandle.addEventListener(event, _callback, options);

    return () => nodeHandle.removeEventListener(event, _callback);

  }, [nodeHandle, event, callback]);
}

const empty_function = () => { };

export const Touchable = createMemoComponent(({
  onDragStart,
  onDragEnd,
  onDrop,
  onDragIn,
  onDragOver,
  onDragOut,
  onHoverIn,
  onHoverOut,
  children,
  ...props
}: TouchableProps, forwardRef: React.ForwardedRef<TouchableWithoutFeedback>) => {

  const [nodeHandle, setNodeHandle] = React.useState<Element & EventTarget>();

  const _supportsPointerEvent = supportsPointerEvent();
  registerEventListener(nodeHandle, 'drop', onDrop);
  registerEventListener(nodeHandle, 'dragend', onDragEnd);
  registerEventListener(nodeHandle, 'dragenter', onDragIn);
  registerEventListener(nodeHandle, 'dragover', _.isFunction(onDrop) ? onDragOver ?? empty_function : onDragOver);
  registerEventListener(nodeHandle, 'dragleave', onDragOut);
  registerEventListener(nodeHandle, _supportsPointerEvent ? 'pointerenter' : 'mouseenter', onHoverIn);
  registerEventListener(nodeHandle, _supportsPointerEvent ? 'pointerleave' : 'mouseleave', onHoverOut);

  React.useEffect(() => {

    if (!(nodeHandle instanceof EventTarget) || !_.isFunction(onDragStart)) return;

    const originalDraggableValue = nodeHandle.getAttribute('draggable');
    const _onDrag = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStart(normalizeEvent(e));
    }

    nodeHandle.addEventListener('dragstart', _onDrag, options);
    nodeHandle.setAttribute('draggable', 'true');

    return () => {
      nodeHandle.removeEventListener('dragstart', _onDrag);
      if (_.isNil(originalDraggableValue)) {
        nodeHandle.removeAttribute('draggable');
      } else {
        nodeHandle.setAttribute('draggable', originalDraggableValue);
      }
    }

  }, [nodeHandle, onDragStart]);

  return <NodeHandleProvider onChangeHandle={setNodeHandle}>
    <TouchableWithoutFeedback ref={forwardRef} {...props}>{children}</TouchableWithoutFeedback>
  </NodeHandleProvider>;
}, {
  displayName: 'Touchable',
});

export default Touchable;