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
import { View, ActivityIndicator as RNActivityIndicator, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';

const ActivityIndicatorContext = React.createContext({ 
    setTasks: () => {}, 
    defaultDelay: 250,
});

export function useActivityIndicator() {
    
    const { setTasks, defaultDelay } = React.useContext(ActivityIndicatorContext);

    return async (callback = async () => {}, delay) => {

        const id = uuid.v4();
        
        let completed = false;
        const _delay = delay ?? defaultDelay;
        
        if (_.isNumber(_delay) && _delay > 0) {
            setTimeout(() => { if (!completed) setTasks(tasks => [...tasks, id]); }, _delay);
        } else {
            setTasks(tasks => [...tasks, id]);
        }

        try {

            const result = await callback();

            completed = true;
            setTasks(tasks => _.filter(tasks, x => x !== id));

            return result;

        } catch (e) {

            completed = true;
            setTasks(tasks => _.filter(tasks, x => x !== id));

            throw e;
        }
    };
}

export const ActivityIndicatorProvider = ({ 
    children,
    defaultDelay = 250,
    backdrop = true,
    backdropColor = 'rgba(0, 0, 0, 0.75)',
    passThroughEvents = false,
    ActivityIndicator = () => <RNActivityIndicator color='white' />,
}) => {

    const [tasks, setTasks] = React.useState([]);
    
    return <ActivityIndicatorContext.Provider value={{ setTasks, defaultDelay }}>
        {children}
        {!_.isEmpty(tasks) && <View
        pointerEvents={passThroughEvents ? 'none' : 'auto'}
        style={[{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
        }, StyleSheet.absoluteFill]}>
            {backdrop === true ? <View style={{
                padding: 32,
                borderRadius: 8,
                backgroundColor: backdropColor,
            }}><ActivityIndicator /></View> : <ActivityIndicator />}
        </View>}
    </ActivityIndicatorContext.Provider>;
};
