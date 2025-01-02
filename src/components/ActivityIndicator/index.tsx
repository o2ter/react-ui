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
import { Animated, View, ActivityIndicator as RNActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { normalizeStyle } from '../Style/flatten';
import { ActivityIndicatorContext } from './context';

export { useActivity } from './context';

type ActivityIndicatorProviderProps = React.PropsWithChildren<{
  defaultDelay?: number;
  backdrop?: boolean;
  passThroughEvents?: boolean;
  ActivityIndicator?: () => JSX.Element;
}>;

export const ActivityIndicatorProvider: React.FC<ActivityIndicatorProviderProps> = ({
  children,
  defaultDelay = 250,
  backdrop = true,
  passThroughEvents = false,
  ActivityIndicator = () => <RNActivityIndicator color='white' />,
}) => {

  const [tasks, setTasks] = React.useState<string[]>([]);
  const [visible, setVisible] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const theme = useTheme();
  const defaultStyle = _useComponentStyle('activityIndicator');
  const defaultBackdropStyle = _useComponentStyle('activityIndicatorBackdrop');

  React.useEffect(() => {

    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: _.isEmpty(tasks) ? 0 : 1,
      duration: theme.activityIndicatorDuration,
      easing: theme.activityIndicatorEasing,
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished) setVisible(!_.isEmpty(tasks));
    });

  }, [_.isEmpty(tasks)]);

  const value = React.useMemo(() => ({ setTasks, defaultDelay }), [defaultDelay]);

  return <ActivityIndicatorContext.Provider value={value}>
    {children}
    {visible && <Animated.View
      pointerEvents={passThroughEvents ? 'none' : 'auto'}
      style={normalizeStyle([
        {
          opacity: fadeAnim,
          zIndex: theme.zIndex.indicator,
        },
        style.activityIndicator,
        StyleSheet.absoluteFill,
        Platform.select({
          web: { position: 'fixed' } as any,
          default: {},
        }),
        defaultStyle,
      ])}>
      {backdrop === true ? <View style={[
        style.activityIndicatorBackdrop,
        defaultBackdropStyle
      ]}><ActivityIndicator /></View> : <ActivityIndicator />}
    </Animated.View>}
  </ActivityIndicatorContext.Provider>;
};

ActivityIndicatorProvider.displayName = 'ActivityIndicatorProvider';

const style = StyleSheet.create({

  activityIndicator: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  activityIndicatorBackdrop: {
    padding: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});
