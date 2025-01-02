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
import { Text, TextProps } from 'react-native';
import { useLocalize } from '@o2ter/i18n';
import { ValidateError } from '@o2ter/valid.js';
import { useField } from '../Form/hooks';
import { Modify } from '../../../internals/types';
import { useTheme } from '../../../theme';
import { createMemoComponent } from '../../../internals/utils';
import { _useComponentStyle } from '../../Style';
import { ClassNames } from '../../Style/types';
import { textStyleNormalize } from '../../Text/style';
import { useErrorFormatter } from '../../ErrorFormatter/context';
import { errorString } from '../../utils';

type FormErrorMessageProps = Modify<TextProps, {
  classes?: ClassNames;
  name: string | string[];
  message?: String;
}>

export const FormErrorMessage = createMemoComponent(({
  classes,
  name,
  style,
  message,
  ...props
}: FormErrorMessageProps, forwardRef: React.ForwardedRef<Text>) => {

  const { error, touched } = useField(name);
  const theme = useTheme();
  const formErrorMessageStyle = _useComponentStyle('formErrorMessage', classes);

  const path = _.toPath(name);
  const _error = error.find(x => x instanceof ValidateError ? _.isEqual(x.path, path) : true) ?? _.first(error);

  const localize = useLocalize();
  const formatter = useErrorFormatter();
  const _message = !_.isNil(_error) ? message ?? errorString(_error, localize, formatter) : undefined;

  return (
    <React.Fragment>
      {touched && !_.isNil(_message) && <Text ref={forwardRef} style={textStyleNormalize([
        { color: theme.themeColors.danger },
        formErrorMessageStyle,
        style,
      ])} {...props}>{_message}</Text>}
    </React.Fragment>
  );
}, {
  displayName: 'Form.ErrorMessage'
});

export default FormErrorMessage;