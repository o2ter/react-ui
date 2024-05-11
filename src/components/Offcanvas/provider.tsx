//
//  provider.tsx
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
import { View, Pressable, LayoutRectangle, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { normalizeStyle } from '../Style/flatten';
import { useAnimate } from 'sugax';
import { OffcanvasConfig } from './types';

type _OffcanvasConfig = React.ReactElement | Omit<OffcanvasConfig, 'id'>;

const setOffcanvasAction = (setConfig: React.Dispatch<React.SetStateAction<OffcanvasConfig | undefined>>) => (
  config?: _OffcanvasConfig | ((prevState: OffcanvasConfig | undefined) => _OffcanvasConfig | undefined)
) => {
  const uniqId = _.uniqueId();
  if (_.isFunction(config)) {
    setConfig(v => {
      const _config = config(v);
      if (!_config) return;
      if (React.isValidElement(_config)) return { id: uniqId, element: _config };
      return { id: uniqId, ..._config as Omit<OffcanvasConfig, 'id'> };
    });
  } else if (React.isValidElement(config)) {
    setConfig({ id: uniqId, element: config });
  } else if (config) {
    setConfig({ id: uniqId, ...config as Omit<OffcanvasConfig, 'id'> });
  } else {
    setConfig(undefined);
  }
  return uniqId;
}

const OffcanvasContext = React.createContext<ReturnType<typeof setOffcanvasAction>>(() => _.uniqueId());
OffcanvasContext.displayName = 'OffcanvasContext';

export const useOffcanvas = () => React.useContext(OffcanvasContext);

type OffcanvasProviderProps = React.PropsWithChildren<{
  backdrop?: boolean;
}>;

export const OffcanvasProvider: React.FC<OffcanvasProviderProps> = ({
  backdrop = true,
  children,
}) => {

  const [config, setConfig] = React.useState<OffcanvasConfig>();
  const [display, setDisplay] = React.useState<OffcanvasConfig>();
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const theme = useTheme();
  const offcanvasBackdrop = _useComponentStyle('offcanvasBackdrop');
  const offcanvasContainer = _useComponentStyle('offcanvasContainer');
  const offcanvasLeftContainer = _useComponentStyle('offcanvasLeftContainer');
  const offcanvasRightContainer = _useComponentStyle('offcanvasRightContainer');
  const offcanvasTopContainer = _useComponentStyle('offcanvasTopContainer');
  const offcanvasBottomContainer = _useComponentStyle('offcanvasBottomContainer');

  const { value: fadeAnim, start } = useAnimate(0);
  React.useEffect(() => {
    setDisplay(current => config ?? current);
    start({
      toValue: _.isNil(config?.element) ? 0 : 1,
      duration: theme.offcanvasDuration,
      easing: theme.offcanvasEasing,
      onCompleted: () => {
        if (!_.isNil(config?.element)) return;
        setDisplay(undefined);
        setLayout(undefined);
      }
    });
  }, [_.isNil(config?.element)]);

  const setOffcanvas = React.useCallback(setOffcanvasAction(setConfig), []);
  const placement = display?.placement ?? 'left';

  if (display?.element && config?.element && display.element !== config.element) setDisplay(config);

  return <OffcanvasContext.Provider value={setOffcanvas}>
    {children}
    {React.isValidElement(display?.element) && <>
      {backdrop === true && <Pressable
        onPress={display?.onDismiss ?? (() => setConfig(undefined))}
        style={normalizeStyle([
          {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: theme.zIndex.offcanvasBackdrop,
          },
          Platform.select({
            web: { cursor: 'default' } as any,
            default: {},
          }),
          StyleSheet.absoluteFill,
          Platform.select({
            web: { position: 'fixed' } as any,
            default: {},
          }),
          offcanvasBackdrop,
          display?.backdropStyle ?? {},
          {
            opacity: fadeAnim,
          },
        ])} />}
      <View
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
        style={normalizeStyle([
          {
            zIndex: theme.zIndex.offcanvas,
            borderColor: theme.grays['300'],
            backgroundColor: theme.root.backgroundColor,
            ...placement === 'left' ? { borderRightWidth: 1 } : { right: 0 },
            ...placement === 'right' ? { borderLeftWidth: 1 } : { left: 0 },
            ...placement === 'top' ? { borderBottomWidth: 1 } : { bottom: 0 },
            ...placement === 'bottom' ? { borderTopWidth: 1 } : { top: 0 },
            ...placement === 'left' || placement === 'right' ? {
              width: 400,
              maxWidth: '100%',
            } : {
              height: 400,
              maxHeight: '100%',
            },
          },
          Platform.select({
            web: { position: 'fixed' } as any,
            default: { position: 'absolute' },
          }),
          offcanvasContainer,
          placement === 'left' && offcanvasLeftContainer,
          placement === 'right' && offcanvasRightContainer,
          placement === 'top' && offcanvasTopContainer,
          placement === 'bottom' && offcanvasBottomContainer,
          display?.containerStyle ?? {},
          {
            opacity: layout ? 1 : 0,
            ...layout && placement === 'left' ? { left: (fadeAnim - 1) * layout.width } : {},
            ...layout && placement === 'right' ? { right: (fadeAnim - 1) * layout.width } : {},
            ...layout && placement === 'top' ? { top: (fadeAnim - 1) * layout.height } : {},
            ...layout && placement === 'bottom' ? { bottom: (fadeAnim - 1) * layout.height } : {},
          },
        ])}>
        {display?.element}
      </View>
    </>}
  </OffcanvasContext.Provider>;
};

OffcanvasProvider.displayName = 'OffcanvasProvider';
