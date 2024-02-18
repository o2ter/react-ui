//
//  quill.ts
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
import Quill from 'quill';
import { ImageResize } from './modules/imageResize/ImageResize';
import { ImageDrop } from './modules/imageDrop/ImageDrop';

import './quill.scss';

export const Delta = Quill.import('delta');

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

const imgAttrs = [
  'alt',
  'height',
  'width',
] as const;

Quill.register(class extends Quill.import('formats/image') {
  static formats(domNode: HTMLImageElement) {
    const style = domNode.style;
    const attrs = _.filter(imgAttrs, s => domNode.hasAttribute(s));
    return {
      style: _.fromPairs(_.map([...style], s => [s, style.getPropertyValue(s)])),
      ..._.fromPairs(_.map(attrs, s => [s, domNode.getAttribute(s)])),
    };
  }
  format(name: string, value: any) {
    if (_.includes(imgAttrs, name)) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else if (name === 'style') {
      for (const [k, v] of _.toPairs(value)) {
        if (value) {
          this.domNode.style.setProperty(k, v);
        } else {
          this.domNode.style.removeProperty(k);
        }
      }
    } else {
      super.format(name, value);
    }
  }
}, true);

const BlockEmbed = Quill.import('blots/block/embed');

Quill.register(class extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
});

export const defaultToolbarHandler = (quill: Quill) => { 
  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('divider', () => {
    const range = quill.getSelection(true);
    quill.insertText(range.index, '\n', Quill.sources.USER);
    quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    quill.setSelection(range.index + 2, range.length, Quill.sources.SILENT);
  });
}

export { Quill };
