//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2023 O2ter Limited. All rights reserved.
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
import { View, Text, Pressable, Animated, Platform, StyleSheet, LayoutAnimation, ColorValue, RecursiveArray } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { ValidateError, useMount } from 'sugax';
import { useTheme } from '../../theme';
import { useSafeAreaInsets } from '../SafeAreaView';
import { useLocalize, useUserLocales } from '@o2ter/i18n';

type ToastMessage = string | (Error & { code?: number });
type ToastType = 'success' | 'info' | 'warning' | 'error';

const ToastContext = React.createContext({
  showError(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { },
  showWarning(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { },
  showInfo(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { },
  showSuccess(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { },
  showToast(message: ToastMessage | RecursiveArray<ToastMessage>, color: string, timeout?: number) { },
});

export const useToast = () => React.useContext(ToastContext);

const icons = {
  success: 'M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8h2l2-1-4-1A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10M8 10l-1 2 4 4L21 6l-1-1-9 8-3-3Z',
  info: 'M11 9h2V7h-2m1 13a8 8 0 1 1 0-16 8 8 0 0 1 0 16m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z',
  warning: 'm12 6 8 13H4l8-13m0-4L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
  error: 'M11 15h2v2h-2zm0-8h2v6h-2zm1-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
}

const CloseButton: React.FC<{
  color: ColorValue;
}> = ({ color }) => <Svg width={24} height={24}>
  <Path fill={color} d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
</Svg>;

function toString(message: ToastMessage) {
  if (_.isString(message)) return message;
  if (_.isNumber(message.code) && _.isString(message.message)) return `${message.message} (${message.code})`;
  if (_.isString(message.message)) return message.message;
  return `${message}`;
}

const ToastBody: React.FC<{
  message: ToastMessage;
  type: ToastType | string;
  onShow: (x: { dismiss: VoidFunction }) => void;
  onDismiss: VoidFunction;
}> = ({
  message,
  type,
  onShow,
  onDismiss,
}) => {

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const theme = useTheme();

    function _dismiss() {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: theme.toastDuration,
        easing: theme.toastEasing,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        _.isFunction(onDismiss) && onDismiss();
      });
    }

    useMount(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.toastDuration,
        easing: theme.toastEasing,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => onShow({ dismiss() { _dismiss(); } }));
    });

    const { color, messageColor, ...toastColorStyle } = theme.styles.toastColors(type);

    const localize = useLocalize();
    const _message = localize(message instanceof ValidateError ? message.locales : {}) ?? toString(message);

    return <Animated.View
      style={[
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
        toastColorStyle,
        theme.styles.toastStyle,
        { opacity: fadeAnim },
      ]}>
      {!_.isNil(icons[type as ToastType]) && <Svg width={24} height={24}><Path fill={color} d={icons[type as ToastType]} /></Svg>}
      <Text style={[
        {
          flex: 1,
          marginHorizontal: theme.spacer * 0.5,
          fontSize: theme.fontSizeBase,
          color: messageColor,
        },
        theme.styles.toastTextStyle,
      ]}>{_message}</Text>
      <Pressable onPress={_dismiss}><CloseButton color={color} /></Pressable>
    </Animated.View>
  }

export const ToastProvider: React.FC<React.PropsWithChildren<{
  defaultTimeout?: number;
}>> = ({
  defaultTimeout = 5000,
  children,
}) => {

  const [elements, setElements] = React.useState({});
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const provider = React.useMemo(() => {

    function show_message(
      message: ToastMessage | ReadonlyArray<ToastMessage> | RecursiveArray<ToastMessage>,
      type: ToastType | string,
      timeout?: number
    ) {

      if (_.isNil(message)) return;
      if (!_.isString(message) && _.isArrayLike(message)) {
        _.forEach(message, x => show_message(x, type, timeout));
        return;
      }

      const id = _.uniqueId();

      setElements(elements => ({
        ...elements,
        [id]: <ToastBody key={id} message={message} type={type}
          onShow={({ dismiss }) => setTimeout(dismiss, timeout ?? defaultTimeout)}
          onDismiss={() => setElements(elements => _.pickBy(elements, (_val, key) => key != id))} />
      }));
    }

    return {
      showError(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { show_message(message, 'error', timeout); },
      showWarning(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { show_message(message, 'warning', timeout); },
      showInfo(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { show_message(message, 'info', timeout); },
      showSuccess(message: ToastMessage | RecursiveArray<ToastMessage>, timeout?: number) { show_message(message, 'success', timeout); },
      showToast(message: ToastMessage | RecursiveArray<ToastMessage>, color: string, timeout?: number) { show_message(message, color, timeout); },
    };

  }, []);

  return <ToastContext.Provider value={provider}>
    {children}
    {!_.isEmpty(elements) && <View style={[
      {
        top: insets.top,
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: theme.zIndex.toast,
      },
      Platform.select({
        web: { position: 'fixed' } as any,
        default: { position: 'absolute' },
      }),
    ]}>{_.values(elements)}</View>}
  </ToastContext.Provider>;
};
