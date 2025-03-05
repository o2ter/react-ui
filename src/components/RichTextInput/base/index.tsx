//
//  index.tsx
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
import type _Delta from 'quill-delta';
import { useStableCallback } from 'sugax';
import { Delta, Quill } from '../quill';
import { Line } from '../format/types';
import { RichTextInputProps, RichTextInputRef, SelectionChangeHandler, TextChangeHandler } from './types';
import { Range } from 'quill';

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

  const [capture, setCapture] = React.useState({ delta: new Delta, content: new Delta });
  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !capture.delta.length()) return;
    const content = capture.content.compose(capture.delta);
    editor.setContents(capture.content, 'silent');
    setCapture({ delta: new Delta, content });
    _onChangeText(decodeContent(content), editor);
  }, [capture]);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = editor.getSelection();
    const oldContent = editor.getContents();
    const delta = encodeContent(value ?? []);
    editor.setContents(delta, 'silent');
    if (selection && editor.hasFocus()) {
      const pos = oldContent.diff(delta).transformPosition(selection.index);
      editor.setSelection(pos, selection.length, 'silent');
    }
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
    get assets() {
      const editor = editorRef.current;
      if (!editor) return [];
      return _.compact(editor.getContents().map(op => {
        if (_.isNil(op.insert) || _.isString(op.insert)) return;
        if (_.isString(op.insert.image)) return op.insert.image;
      }));
    },
    replaceAssets(assets: Record<string, string>) {
      const editor = editorRef.current;
      if (!editor) return;
      let isChanged = false;
      const oldContents = editor.getContents();
      const ops = oldContents.map(op => {
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
      const delta = new Delta(ops);
      _onChangeText(decodeContent(delta), editor);
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
    const textChange = (delta: _Delta) => {
      setCapture(v => ({ delta: v.delta.compose(delta), content: v.content }));
    }
    const selectionChange = (range: Range) => _onChangeSelection(range, editor);
    editor.on('text-change', textChange);
    editor.on('selection-change', selectionChange);
    if (!_.isEmpty(value)) editor.setContents(encodeContent(value), 'silent');
    return () => {
      editor.off('text-change', textChange);
      editor.off('selection-change', selectionChange);
    };
  }, []);

  return <div ref={containerRef} {...props} />;
});
