
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
