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
import { Delta, Quill } from '../quill';
import { Line, RichTextInputProps, RichTextInputRef } from '../types';

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

const _removeEmptyLines = (lines: Line[]) => _.takeWhile(lines, x => !_.isEmpty(x.segments) || !_.isEmpty(x.attributes));

export const Base = React.forwardRef(({
  value = [],
  options = {},
  onUploadImage,
  onChangeText,
  onChangeSelection,
  ...props
}: RichTextInputProps, forwardRef: React.ForwardedRef<RichTextInputRef>) => {

  const editorRef = React.useRef<Quill>();
  const containerRef = React.useRef<React.ComponentRef<'div'>>(null);

  const _onChangeText = useStableCallback(onChangeText ?? (() => { }));
  const _onChangeSelection = useStableCallback(onChangeSelection ?? (() => { }));

  const [capture, setCapture] = React.useState(value);
  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (_.isEqual(_removeEmptyLines(capture), _removeEmptyLines(value))) return;
    const selection = editor.getSelection(true);
    editor.setContents(encodeContent(value ?? []), 'silent');
    if (selection) editor.setSelection(selection, 'silent');
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
    replaceAssets(assets: Record<string, string>) {
      const editor = editorRef.current;
      if (!editor) return;
      let isChanged = false;
      const ops = editor.getContents().map(op => {
        if (_.isNil(op.insert) || _.isString(op.insert)) return op;
        if (_.isString(op.insert.image)) {
          for (const [source, replace] of _.entries(assets)) {
            if (source !== op.insert.image) continue;
            isChanged = true;
            return { ...op, insert: { image: replace } };
          }
        }
        return op;
      });
      if (!isChanged) return;
      const selection = editor.getSelection(true);
      editor.setContents(new Delta(ops), 'silent');
      if (selection) editor.setSelection(selection, 'silent');
    },
  }), []);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const editor = new Quill(element, {
      theme: 'bubble',
      ...options,
      modules: {
        imageResize: true,
        imageUploader: {
          upload: onUploadImage ?? (blob => new Promise(res => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => res(reader.result as string);
          })),
        },
        ...options.modules ?? {},
      },
    });
    editorRef.current = editor;
    const textChange = (...args: Parameters<TextChangeHandler>) => {
      const value = decodeContent(editor.getContents());
      setCapture(value);
      _onChangeText(value, ...args, editor);
    }
    const selectionChange = (...args: Parameters<SelectionChangeHandler>) => _onChangeSelection(...args, editor);
    editor.on('text-change', textChange);
    editor.on('selection-change', selectionChange);
    if (!_.isEmpty(value)) editor.setContents(encodeContent(value), 'silent');
    () => {
      editor.off('text-change', textChange);
      editor.off('selection-change', selectionChange);
    };
  }, []);

  return <div ref={containerRef} {...props} />;
});
