//
//  index.js
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
import { ColorValue } from 'react-native';
import Svg, { SvgProps, Rect } from 'react-native-svg';
import { List } from '../List';
import { Options } from 'jsbarcode';
import { Modify } from '../../internals/types';

const barcodes = require('jsbarcode/src/barcodes');

export const BarcodeFormats = _.keys(barcodes);

type BarcodeProps = Modify<SvgProps, {
  value?: string;
  format?: string;
  options?: Options;
  color?: ColorValue;
  backgroundColor?: ColorValue;
}>

export const Barcode = React.forwardRef<Svg, BarcodeProps>(({
  value = '',
  format = 'CODE128',
  options = {},
  color = 'black',
  backgroundColor,
  ...props
}, forwardRef) => {

  const { rects, size } = React.useMemo(() => {

    const rects = [];
    let last_char;
    let start = 0;
    let end = 0;

    try {

      const encoder = new barcodes[format](value, options);
      const encoded = encoder.encode();

      for (const char of encoded.data) {
        if (last_char != char) {
          if (last_char == '1') {
            rects.push({ x: start, width: end - start });
          }
          start = end;
          last_char = char;
        }
        end += 1;
      }

      if (last_char == '1') {
        rects.push({ x: start, width: end - start });
      }

    } catch { }

    return { rects, size: end };

  }, [value, format, options]);

  return <Svg ref={forwardRef} viewBox={`0 0 ${size} 100`} preserveAspectRatio='none' {...props}>
    {backgroundColor && <Rect x={0} y={0} width={size} height={100} fill={backgroundColor} />}
    <List data={rects} renderItem={({ item }) => <Rect y={0} height={100} fill={color} {...item} />} />
  </Svg>;
});

export default Barcode;
