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
import { View, Text, Pressable, Animated, Platform } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useMount } from 'sugax';
import uuid from 'react-native-uuid';
import { useTheme } from '../../theme';
import { useSafeAreaInsets } from '../SafeAreaView';

const ToastContext = React.createContext({
    showError(message, timeout) {},
    showWarning(message, timeout) {},
    showInfo(message, timeout) {},
    showSuccess(message, timeout) {},
});

export const useToast = () => React.useContext(ToastContext);

const icons = {
    success: 'M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8h2l2-1-4-1A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10M8 10l-1 2 4 4L21 6l-1-1-9 8-3-3Z',
    info: 'M11 9h2V7h-2m1 13a8 8 0 1 1 0-16 8 8 0 0 1 0 16m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z',
    warning: 'm12 6 8 13H4l8-13m0-4L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
    error: 'M11 15h2v2h-2zm0-8h2v6h-2zm1-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
}

const CloseButton = ({ color }) => <Svg width={24} height={24}>
    <Path fill={color} d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
</Svg>;

function toString(message) {
    if (_.isString(message)) return message;
    if (_.isNumber(message.code) && _.isString(message.message)) return `${message.message} (${message.code})`;
    if (_.isString(message.message)) return message.message;
    return `${message}`;
}

function ToastBody({ 
    message, 
    type,
    onShow,
    onDismiss,
}) {

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const theme = useTheme();

    function _dismiss() {
        Animated.timing(fadeAnim, { 
            toValue: 0,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
        }).start(() => _.isFunction(onDismiss) && onDismiss());
    }

    useMount(() => {
        Animated.timing(fadeAnim, { 
            toValue: 1,
            duration: 250,
            useNativeDriver: Platform.OS !== 'web',
        }).start(() => onShow({ dismiss() { _dismiss(); } }));
    });
    
    const { color, messageColor, backgroundColor } = theme.styles.toastColors[type];
    
    return <Animated.View
    style={[theme.styles.toastStyle, { backgroundColor: backgroundColor, opacity: fadeAnim }]}>
        <Svg width={24} height={24}><Path fill={color} d={icons[type]} /></Svg>
        <Text style={[theme.styles.toastTextStyle, { color: messageColor }]}>{toString(message)}</Text>
        <Pressable onPress={_dismiss}><CloseButton color={color} /></Pressable>
    </Animated.View>
}

export const ToastProvider = ({ 
    children,
    defaultTimeout = 5000,
}) => {

    const [elements, setElements] = React.useState({});
    const insets = useSafeAreaInsets();

    function show_message(message, type, timeout) {

        if (_.isNil(message)) return;
        if (!_.isString(message) && _.isArrayLike(message)) return _.forEach(message, x => show_message(x, type, timeout));
        
        const id = uuid.v4();
        
        setElements(elements => ({
            ...elements,
            [id]: <ToastBody key={id} message={message} type={type}
            onShow={({ dismiss }) => setTimeout(dismiss, timeout ?? defaultTimeout)}
            onDismiss={() => setElements(elements => _.pickBy(elements, (_val, key) => key != id))} />
        }));
    }

    const provider = React.useMemo(() => ({
        showError(message, timeout) { show_message(message, 'error', timeout); },
        showWarning(message, timeout) { show_message(message, 'warning', timeout); },
        showInfo(message, timeout) { show_message(message, 'info', timeout); },
        showSuccess(message, timeout) { show_message(message, 'success', timeout); },
    }), [setElements]);

    return <ToastContext.Provider value={provider}>
        {children}
        <View style={{
            top: insets.top,
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',
        }}>{_.values(elements)}</View>
    </ToastContext.Provider>;
};
