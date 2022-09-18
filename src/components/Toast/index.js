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
import { v4 as uuidv4 } from 'uuid';

const ToastContext = React.createContext({
    showError(message, timeout) {},
    showWarning(message, timeout) {},
    showInfo(message, timeout) {},
    showSuccess(message, timeout) {},
});

export const useToast = () => React.useContext(ToastContext);

const icons = {
    error: <Svg width={24} height={24}>
        <Path fill='rgb(239, 83, 80)' d='M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' />
    </Svg>,
    warning: <Svg width={24} height={24}>
        <Path fill='rgb(255, 152, 0)' d='M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z' />
    </Svg>,
    info: <Svg width={24} height={24}>
        <Path fill='rgb(3, 169, 244)' d='M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z' />
    </Svg>,
    success: <Svg width={24} height={24}>
        <Path fill='rgb(76, 175, 80)' d='M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z' />
    </Svg>,
}

const iconColor = {
    error: 'rgb(239, 83, 80)',
    warning: 'rgb(255, 152, 0)',
    info: 'rgb(3, 169, 244)',
    success: 'rgb(76, 175, 80)',
}

const CloseButton = ({type}) => <Svg width={24} height={24}>
    <Path fill={iconColor[type]} d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
</Svg>;

const messageColor = {
    error: 'rgb(95, 33, 32)',
    warning: 'rgb(102, 60, 0)',
    info: 'rgb(1, 67, 97)',
    success: 'rgb(30, 70, 32)',
}

const backgroundColor = {
    error: 'rgb(253, 237, 237)',
    warning: 'rgb(255, 244, 229)',
    info: 'rgb(229, 246, 253)',
    success: 'rgb(237, 247, 237)',
}

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

    return <Animated.View
    style={{
        marginTop: 8,
        padding: 16,
        minWidth: 320,
        borderRadius: 4,
        backgroundColor: backgroundColor[type],
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: fadeAnim,
    }}>
        {icons[type]}
        <Text style={{
            flex: 1,
            marginHorizontal: 8,
            fontSize: 14,
            color: messageColor[type]
        }}>{toString(message)}</Text>
        <Pressable onPress={_dismiss}><CloseButton type={type} /></Pressable>
    </Animated.View>
}

export const ToastProvider = ({ 
    children,
    defaultTimeout = 5000,
}) => {

    const [elements, setElements] = React.useState({});

    function show_message(message, type, timeout) {

        if (_.isNil(message)) return;
        if (!_.isString(message) && _.isArrayLike(message)) return _.forEach(message, x => show_message(x, type, timeout));
        
        const id = uuidv4();
        
        setElements(elements => ({
            ...elements,
            [id]: <ToastBody key={id} message={message} type={type}
            onShow={({ dismiss }) => setTimeout(dismiss, timeout ?? defaultTimeout)}
            onDismiss={() => setElements(elements => _.pickBy(elements, (_val, key) => key != id))} />
        }));
    }

    const provider = {
        showError(message, timeout) { show_message(message, 'error', timeout); },
        showWarning(message, timeout) { show_message(message, 'warning', timeout); },
        showInfo(message, timeout) { show_message(message, 'info', timeout); },
        showSuccess(message, timeout) { show_message(message, 'success', timeout); },
    };

    return <ToastContext.Provider value={provider}>
        {children}
        <View style={{
            top: 0,
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',
        }}>{_.values(elements)}</View>
    </ToastContext.Provider>;
};
