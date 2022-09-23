//
//  date.ts
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
import { DateTime } from 'luxon';

export function dateToString(year: number, month: number, day: number) {
  return `${_.padStart(`${year}`, 4, '0')}-${_.padStart(`${month}`, 2, '0')}-${_.padStart(`${day}`, 2, '0')}`;
}

export class _Date {
  
  year: number;
  month: number;
  day: number;
  
  constructor(date: string | DateTime) {
    if (date instanceof DateTime) date = date.toISODate();
    if (!_.isString(date)) date = DateTime.now().toISODate();
    const matched = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (matched) {
      this.year = parseInt(matched[1]);
      this.month = parseInt(matched[2]);
      this.day = parseInt(matched[3]);
    } else {
      const today = DateTime.now();
      this.year = today.year;
      this.month = today.month;
      this.day = today.day;
    }
  }
  
  toString() {
    return dateToString(this.year, this.month, this.day);
  }

  static lessThan(d1: string | DateTime | _Date, d2: string | DateTime | _Date) {
    const _d1 = d1 instanceof _Date ? d1 : new _Date(d1);
    const _d2 = d2 instanceof _Date ? d2 : new _Date(d2);
    if (_d1.year < _d2.year) return true;
    if (_d1.year > _d2.year) return false;
    if (_d1.month < _d2.month) return true;
    if (_d1.month > _d2.month) return false;
    return _d1.day < _d2.day;
  }
}
