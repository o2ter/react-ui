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
import { Line, Segment } from '../format/types';
import { RichTextInputProps, RichTextInputRef } from './types';
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

const decodeContent = (content?: _Delta) => {
  if (!content) return [];
  const result: Line[] = [];
  let segments: Segment[] = [];
  content.forEach(({ insert, attributes }) => {
    if (_.isString(insert) && _.every(insert, x => x === '\n')) {
      _.range(insert.length).forEach(() => {
        result.push({ segments, attributes: attributes ?? {} });
        segments = [];
      });
    } else if (_.isString(insert)) {
      for (const [i, line] of insert.split('\n').entries()) {
        if (i !== 0) {
          result.push({ segments, attributes: {} });
          segments = [];
        }
        segments.push({ insert: line, attributes: attributes ?? {} });
      }
    } else {
      segments.push({ insert: insert ?? '', attributes: attributes ?? {} });
    }
  });
  if (!_.isEmpty(segments)) result.push({ segments, attributes: {} });
  return result;
}

const _removeEmptyLines = (lines: Line[]) => _.dropRightWhile(lines, x => _.every(x.segments, s => _.isEmpty(s.insert)) && _.isEmpty(x.attributes));

export const Base = React.forwardRef(({
  value,
  options = {},
  readOnly,
  onChangeText,
  onChangeSelection,
  onMouseDown,
  onMouseUp,
  ...props
}: RichTextInputProps, forwardRef: React.ForwardedRef<RichTextInputRef>) => {

  const editorRef = React.useRef<Quill>();
  const containerRef = React.useRef<React.ComponentRef<'div'>>(null);

  const _onChangeText = useStableCallback(onChangeText ?? (() => { }));
  const _onChangeSelection = useStableCallback(onChangeSelection ?? (() => { }));

  const [mouseDown, setMouseDown] = React.useState(false);
  const [capture, setCapture] = React.useState<_Delta>();
  const content = React.useMemo(() => encodeContent(value ?? []), [value]);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || mouseDown || _.isNil(capture)) return;
    setCapture(undefined);
    _onChangeText(_removeEmptyLines(decodeContent(capture)), editor);
  }, [capture, mouseDown]);

  React.useEffect(() => {

    const editor = editorRef.current;
    if (!editor || mouseDown) return;

    if (!encodeContent(_removeEmptyLines(decodeContent(editor.getContents()))).diff(content).length()) return;

    const selection = editor.hasFocus() && editor.getSelection();
    editor.setContents(content, 'silent');

    if (!selection) return;

    const diff = editor.getContents().diff(content);
    const pos = diff.transformPosition(selection.index);
    editor.setSelection(pos, selection.length, 'silent');

  }, [content, mouseDown]);

  React.useEffect(() => {
    editorRef.current?.enable(!readOnly);
  }, [readOnly]);

  React.useImperativeHandle(forwardRef, () => ({
    get value() {
      return value;
    },
    get editor() {
      return editorRef.current;
    },
    get container() {
      return containerRef.current ?? undefined;
    },
    get assets() {
      return _.compact(content.map(op => {
        if (_.isNil(op.insert) || _.isString(op.insert)) return;
        if (_.isString(op.insert.image)) return op.insert.image;
      }));
    },
    replaceAssets(assets: Record<string, string>) {
      const editor = editorRef.current;
      if (!editor) return;
      let isChanged = false;
      const ops = content.map(op => {
        if (_.isNil(op.insert) || _.isString(op.insert)) return op;
        if (_.isString(op.insert.image)) {
          const replace = assets[op.insert.image];
          if (replace) {
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
  }), [content]);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const editor = new Quill(element, {
      theme: 'bubble',
      ...options,
      modules: {
        imageResize: true,
        ...options.modules ?? {},
      },
    });
    editorRef.current = editor;
    const textChange = (delta: _Delta, oldContent: _Delta) => {
      setCapture(oldContent.compose(delta));
    }
    const selectionChange = (range: Range) => {
      _onChangeSelection(range, editor);
    };
    editor.on('text-change', textChange);
    editor.on('selection-change', selectionChange);
    if (!_.isEmpty(value)) editor.setContents(content, 'silent');
    return () => {
      editor.off('text-change', textChange);
      editor.off('selection-change', selectionChange);
    };
  }, []);

  return <div
    ref={containerRef}
    onMouseDown={(e) => {
      setMouseDown(true);
      if (onMouseDown) onMouseDown(e);
    }}
    onMouseUp={(e) => {
      setMouseDown(false);
      if (onMouseUp) onMouseUp(e);
    }}
    {...props}
  />;
});
