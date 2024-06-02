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
import { View, Text, Pressable, Animated, Platform, StyleSheet, LayoutAnimation, RecursiveArray } from 'react-native';
import { useMount } from 'sugax';
import { ValidateError } from '@o2ter/valid.js';
import { useTheme } from '../../theme';
import { useSafeAreaInsets } from '../SafeAreaView';
import { useLocalize } from '@o2ter/i18n';
import { _useComponentStyle } from '../Style';
import { textStyleNormalize } from '../Text/style';
import { ThemeColors } from '../../theme/variables';
import { MaterialIcons as Icon } from '../Icons';
import { normalizeStyle } from '../Style/flatten';
import { useErrorFormatter } from '../ErrorFormatter/context';
import { ErrorMessage, errorString } from '../utils';

type AlertType = 'success' | 'info' | 'warning' | 'error';
type AlertOptions = { color: ThemeColors | (string & {}); icon?: React.ReactElement; timeout?: number; };

const AlertContext = React.createContext<(
  message: ErrorMessage | ReadonlyArray<ErrorMessage> | RecursiveArray<ErrorMessage>,
  style: AlertType | Omit<AlertOptions, 'timeout'>,
  timeout?: number,
  formatter?: (error: Error) => string
) => void>(() => { });

AlertContext.displayName = 'AlertContext';

export const useAlert = () => {
  const formatter = useErrorFormatter();
  const showMessage = React.useContext(AlertContext);
  return React.useMemo(() => ({
    showError(message: ErrorMessage | RecursiveArray<ErrorMessage>, timeout?: number) { showMessage(message, 'error', timeout, formatter); },
    showWarning(message: ErrorMessage | RecursiveArray<ErrorMessage>, timeout?: number) { showMessage(message, 'warning', timeout, formatter); },
    showInfo(message: ErrorMessage | RecursiveArray<ErrorMessage>, timeout?: number) { showMessage(message, 'info', timeout, formatter); },
    showSuccess(message: ErrorMessage | RecursiveArray<ErrorMessage>, timeout?: number) { showMessage(message, 'success', timeout, formatter); },
    showAlert(message: ErrorMessage | RecursiveArray<ErrorMessage>, options: AlertOptions) { showMessage(message, options, options.timeout, formatter); },
  }), [formatter, showMessage])
};

const icons = {
  success: 'task-alt',
  info: 'info-outline',
  warning: 'warning-amber',
  error: 'error-outline',
} as const;

type AlertBodyProps = {
  message: ErrorMessage;
  style: AlertType | { color: string; icon?: React.ReactElement },
  onShow: (x: { dismiss: VoidFunction }) => void;
  onDismiss: VoidFunction;
  formatter?: (error: Error) => string;
};

const AlertBody: React.FC<AlertBodyProps> = ({
  message,
  style,
  onShow,
  onDismiss,
  formatter,
}) => {

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const alertStyle = _useComponentStyle('alert');
  const alertTextStyle = _useComponentStyle('alertText');

  function _dismiss() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: theme.alertDuration,
      easing: theme.alertEasing,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      _.isFunction(onDismiss) && onDismiss();
    });
  }

  useMount(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: theme.alertDuration,
      easing: theme.alertEasing,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => onShow({ dismiss() { _dismiss(); } }));
  });

  const { color, messageColor, ...alertColorStyle } = theme.palette.alertColors(_.isString(style) ? style : style.color);

  const localize = useLocalize();
  const _message = errorString(message, localize, formatter);

  return <Animated.View
    style={normalizeStyle([
      {
        marginTop: 8,
        minWidth: 320,
        padding: theme.spacer,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: theme.borderRadiusBase,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      alertColorStyle,
      alertStyle,
      { opacity: fadeAnim },
    ])}>
    {_.isString(style) && <Icon color={color} size={24} name={icons[style]} />}
    {!_.isString(style) && React.isValidElement(style.icon) && style.icon}
    <Text style={textStyleNormalize([
      {
        flex: 1,
        marginHorizontal: theme.spacer * 0.5,
        fontSize: theme.root.fontSize,
        color: messageColor,
      },
      alertTextStyle,
    ])}>{_message}</Text>
    <Pressable onPress={_dismiss}>
      <Icon color={color} size={24} name='close' />
    </Pressable>
  </Animated.View>
}

AlertBody.displayName = 'AlertBody';

type AlertProviderProps = React.PropsWithChildren<{
  defaultTimeout?: number;
}>;

export const AlertProvider: React.FC<AlertProviderProps> = ({
  defaultTimeout = 5000,
  children,
}) => {

  const [elements, setElements] = React.useState({});
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const provider = React.useMemo(() => {
    function showMessage(
      message: ErrorMessage | ReadonlyArray<ErrorMessage> | RecursiveArray<ErrorMessage>,
      style: AlertType | Omit<AlertOptions, 'timeout'>,
      timeout?: number,
      formatter?: (error: Error) => string
    ) {
      if (_.isNil(message)) return;
      if (!_.isString(message) && _.isArrayLike(message)) {
        _.forEach(message, x => showMessage(x, style, timeout, formatter));
        return;
      }
      const id = _.uniqueId();
      setElements(elements => ({
        ...elements,
        [id]: (
          <AlertBody
            key={id}
            message={message}
            style={style}
            onShow={({ dismiss }) => setTimeout(dismiss, timeout ?? defaultTimeout)}
            onDismiss={() => setElements(elements => _.pickBy(elements, (_val, key) => key != id))}
            formatter={formatter}
          />
        ),
      }));
    }
    return showMessage;
  }, []);

  return <AlertContext.Provider value={provider}>
    {children}
    {!_.isEmpty(elements) && <View style={[
      {
        top: insets.top,
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: theme.zIndex.alert,
      },
      Platform.select({
        web: { position: 'fixed' } as any,
        default: { position: 'absolute' },
      }),
    ]}>{_.values(elements)}</View>}
  </AlertContext.Provider>;
};

AlertProvider.displayName = 'AlertProvider';