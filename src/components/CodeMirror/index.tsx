//
//  index.tsx
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
import React, { ComponentRef, ComponentPropsWithoutRef } from 'react';
import { View } from '../View';
import { Modify } from '../../internals/types';
import { useMergeRefs, useStableRef } from 'sugax';
import { EditorState } from '@codemirror/state';
import { lineNumbers as _lineNumbers, ViewUpdate } from '@codemirror/view';
import { EditorView, keymap, highlightSpecialChars, drawSelection } from '@codemirror/view';
import { standardKeymap, history, historyKeymap } from '@codemirror/commands';
import { defaultHighlightStyle, syntaxHighlighting, codeFolding as _codeFolding, foldGutter as _foldGutter } from '@codemirror/language';

type CodeMirrorProps = Modify<ComponentPropsWithoutRef<typeof View>, {
  theme?: Parameters<typeof EditorView.theme>[0],
  darkMode?: boolean,
  initialValue?: string;
  autoFocus?: boolean;
  onChange?: (e: ViewUpdate) => void;
  onChangeValue?: (value: string) => void;
  onFocus?: (e: ViewUpdate) => void;
  onBlur?: (e: ViewUpdate) => void;
  onSelectionChange?: (e: ViewUpdate) => void;
  extensions?: any[];
  editable?: boolean;
  codeFolding?: boolean;
  lineNumbers?: boolean;
  allowMultipleSelections?: boolean;
  tabSize?: number;
  keymaps?: any[];
}>

export const CodeMirror = React.forwardRef<ComponentRef<typeof View>, CodeMirrorProps>(({
  theme,
  darkMode = false,
  initialValue,
  autoFocus,
  onChange,
  onChangeValue,
  onFocus,
  onBlur,
  onSelectionChange,
  extensions = [],
  editable = true,
  codeFolding = false,
  lineNumbers = false,
  allowMultipleSelections = true,
  tabSize = 4,
  keymaps = [],
  ...props
}, forwardRef) => {

  const codeMirror = React.useRef<EditorView>();
  const containerRef = React.useRef<ComponentRef<typeof View>>();
  const ref = useMergeRefs(containerRef, forwardRef);

  const onChangeRef = useStableRef(onChange);
  const onChangeValueRef = useStableRef(onChangeValue);
  const onFocusRef = useStableRef(onFocus);
  const onBlurRef = useStableRef(onBlur);
  const onSelectionChangeRef = useStableRef(onSelectionChange);

  React.useEffect(() => {

    if (_.isNil(containerRef.current)) return;

    const editor = new EditorView({
      doc: initialValue,
      parent: containerRef.current as any,
      extensions: [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of(_.flattenDeep([standardKeymap, historyKeymap, keymaps])),
        lineNumbers && _lineNumbers(),
        codeFolding && _codeFolding(),
        codeFolding && _foldGutter(),
        EditorView.editable.of(editable),
        EditorState.allowMultipleSelections.of(allowMultipleSelections),
        EditorState.tabSize.of(tabSize),
        EditorView.updateListener.of((e) => {
          if (e.docChanged) {
            onChangeRef.current?.(e);
            onChangeValueRef.current?.(e.state.doc.toString());
          }
          if (e.focusChanged) {
            const callback = e.view.hasFocus ? onFocusRef : onBlurRef;
            callback.current?.(e);
          }
          if (e.selectionSet) {
            onSelectionChangeRef.current?.(e);
          }
        }),
        EditorView.theme(_.merge({ '&': { width: '100%', height: '100%' } }, theme), { dark: darkMode }),
        ...extensions
      ].filter(Boolean),
    });

    codeMirror.current = editor;
    if (autoFocus) editor.focus();

    return () => editor.destroy();

  }, []);

  return <View ref={ref} {...props} />;
});

export default CodeMirror;