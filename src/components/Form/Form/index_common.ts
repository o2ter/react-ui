//
//  index.ts
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the 'Software'), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import _ from 'lodash';
import { Form as FormBase } from './base';
import { FormConsumer } from './context';
import { FormGroup } from '../Group';
import { FormList } from '../List';
import { FormDate } from '../DateTime';
import ErrorMessage from '../ErrorMessage';
import Field from '../Field';
import TextField from '../TextField';
import Button from '../Button';
import Picker from '../Picker';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
import Select from '../Select';
import Switch from '../Switch';
import HiddenData from '../HiddenData';
import FormUploader from '../Uploader';

export const Form = _.assign(FormBase, {
  Consumer: FormConsumer,
  Group: FormGroup,
  List: FormList,
  ErrorMessage,
  Field,
  TextField,
  Button,
  Picker,
  Checkbox,
  Radio,
  Select,
  Switch,
  Date: FormDate,
  HiddenData,
  _Uploader: FormUploader,
});
