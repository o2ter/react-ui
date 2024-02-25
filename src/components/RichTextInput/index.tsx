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
import type { SelectionChangeHandler, TextChangeHandler } from 'quill';
import { useStableCallback } from 'sugax';
import { Delta, Quill, defaultToolbarHandler } from './quill';
import { createMemoComponent } from '../../internals/utils';
import { Line, RichTextInputProps, RichTextInputRef } from './types';

const defaultToolbar = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['bold', 'italic', 'strike', 'underline'],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  ['link', 'blockquote', 'code-block', 'image'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
] as const;

const encodeContent = (lines: Line[]) => {
  const content = new Delta();
  let lineAttrs = {};
  for (const [i, line] of lines.entries()) {
    if (i !== 0) content.insert('\n', lineAttrs);
    for (const segment of line.segments) {
      content.insert(segment.insert, segment.attributes);
    }
    lineAttrs = line.attributes;
  }
  if (!_.isEmpty(lineAttrs)) content.insert('\n', lineAttrs);
  return content;
}

const decodeContent = (content?: ReturnType<Quill['getContents']>) => {
  if (!content) return [];
  const result: Line[] = [];
  content.eachLine((line, attributes) => {
    result.push({
      attributes,
      segments: line.map(({ insert, attributes }) => ({
        attributes: attributes ?? {},
        insert: insert ?? '',
      })),
    })
  });
  return result;
}

export const RichTextInput = createMemoComponent(({
  value,
  options = {},
  onChangeText,
  onChangeSelection,
  ...props
}: RichTextInputProps, forwardRef: React.ForwardedRef<RichTextInputRef>) => {

  const editorRef = React.useRef<Quill>();
  const containerRef = React.useRef<React.ComponentRef<'div'>>(null);

  const _onChangeText = useStableCallback(onChangeText ?? (() => { }));
  const _onChangeSelection = useStableCallback(onChangeSelection ?? (() => { }));

  const setValue = (editor: Quill) => {
    const current = decodeContent(editor.getContents());
    if (!_.isEqual(current, value)) {
      const selection = editor.getSelection(true);
      editor.setContents(encodeContent(value ?? []), 'silent');
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
      return decodeContent(editorRef.current?.getContents());
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
      theme: 'bubble',
      ...options,
      modules: {
        toolbar: defaultToolbar,
        imageDrop: true,
        imageResize: {
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        ...options.modules ?? {},
      },
    });
    defaultToolbarHandler(editor);
    editorRef.current = editor;
    const textChange = (...args: Parameters<TextChangeHandler>) => _onChangeText(decodeContent(editor.getContents()), ...args, editor);
    const selectionChange = (...args: Parameters<SelectionChangeHandler>) => _onChangeSelection(...args, editor);
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
