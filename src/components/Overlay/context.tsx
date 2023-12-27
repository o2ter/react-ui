//
//  context.tsx
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
import { GestureResponderEvent } from 'react-native';

export type OverlayConfig = {
  id: string;
  node?: React.ReactElement;
  onTouchOutside: (event: GestureResponderEvent) => void;
};

export const OverlayContext = React.createContext<{
  nodes: OverlayConfig[];
  setNodes: React.Dispatch<React.SetStateAction<OverlayConfig[]>>;
}>({
  nodes: [],
  setNodes: () => { },
});

OverlayContext.displayName = 'OverlayContext';

export const useOverlay = (
  node?: React.ReactElement,
  onTouchOutside?: (event: GestureResponderEvent) => void
) => {

  const id = React.useId();
  const { setNodes } = React.useContext(OverlayContext);

  const _onTouchOutside = onTouchOutside ?? (() => { });

  React.useEffect(() => {
    setNodes(nodes => [...nodes, { id, node, onTouchOutside: _onTouchOutside }]);
    return () => setNodes(nodes => _.filter(nodes, x => x.id !== id));
  }, []);

  React.useEffect(() => {
    setNodes(nodes => _.map(nodes, x => x.id === id ? { id, node, onTouchOutside: _onTouchOutside } : x));
  }, [node]);
}
