//
//  index.tsx
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
import React from 'react';
import type { Quill as _Quill, QuillOptionsStatic, SelectionChangeHandler, TextChangeHandler } from 'quill';
import type _Delta from 'quill/node_modules/quill-delta/dist/Delta';
import type { Op } from 'quill/node_modules/quill-delta/dist/Delta';
import { useStableCallback } from 'sugax';
import { Quill } from './quill';
import { createMemoComponent } from '../../internals/utils';

type RichTextInputProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: Op[];
  options?: QuillOptionsStatic;
  onTextChange?: (value: Op[], ...arg: [...Parameters<TextChangeHandler>, _Quill]) => void;
  onSelectionChange?: (...arg: [...Parameters<SelectionChangeHandler>, _Quill]) => void;
};

type RichTextInputRef = {
  value?: Op[];
  editor?: _Quill;
  container?: HTMLDivElement;
};

const defaultToolbar = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['bold', 'italic', 'underline'],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['link', 'blockquote', 'code-block', 'image'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
];

export const RichTextInput = createMemoComponent(({
  value,
  options,
  onTextChange,
  onSelectionChange,
  ...props
}: RichTextInputProps, forwardRef: React.ForwardedRef<RichTextInputRef>) => {

  const editorRef = React.useRef<_Quill>();
  const containerRef = React.useRef<React.ComponentRef<'div'>>(null);

  const _onTextChange = useStableCallback(onTextChange ?? (() => { }));
  const _onSelectionChange = useStableCallback(onSelectionChange ?? (() => { }));

  const setValue = (editor: _Quill) => {
    const current = editor.getContents().ops;
    if (!_.isEqual(current, value)) {
      const selection = editor.getSelection();
      const Delta = Quill.import('delta') as typeof _Delta;
      editor.setContents(new Delta(value ?? []), 'silent');
      if (selection) editor.setSelection(selection, 'silent');
    }
  }

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    setValue(editor);
  }, [value]);

  React.useImperativeHandle(forwardRef, () => ({
    get value() {
      return editorRef.current?.getContents().ops;
    },
    get editor() {
      return editorRef.current;
    },
    get container() {
      return containerRef.current ?? undefined;
    },
  }), []);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const editor = new Quill(element, {
      ...options,
      modules: {
        toolbar: defaultToolbar,
        imageDrop: true,
        imageResize: {
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        ...options?.modules ?? {},
      },
    });
    editorRef.current = editor;
    const textChange = (...args: Parameters<TextChangeHandler>) => _onTextChange(editor.getContents().ops, ...args, editor);
    const selectionChange = (...args: Parameters<SelectionChangeHandler>) => _onSelectionChange(...args, editor);
    editor.on('text-change', textChange);
    editor.on('selection-change', selectionChange);
    setValue(editor);
    () => {
      editor.off('text-change', textChange);
      editor.off('selection-change', selectionChange);
    };
  }, []);

  return <div ref={containerRef} {...props} />;

}, {
  displayName: 'RichTextInput',
})
