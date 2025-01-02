//
//  provider.tsx
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
import { View, Pressable, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { normalizeStyle } from '../Style/flatten';
import { useAnimate } from 'sugax';
import { ModalConfig } from './types';

type _ModalConfig = React.ReactElement | Omit<ModalConfig, 'id'>;

const setModalAction = (setConfig: React.Dispatch<React.SetStateAction<ModalConfig | undefined>>) => (
  config?: _ModalConfig | ((prevState: ModalConfig | undefined) => _ModalConfig | undefined)
) => {
  const uniqId = _.uniqueId();
  if (_.isFunction(config)) {
    setConfig(v => {
      const _config = config(v);
      if (!_config) return;
      if (React.isValidElement(_config)) return { id: uniqId, element: _config };
      return { id: uniqId, ..._config as Omit<ModalConfig, 'id'> };
    });
  } else if (React.isValidElement(config)) {
    setConfig({ id: uniqId, element: config });
  } else if (config) {
    setConfig({ id: uniqId, ...config as Omit<ModalConfig, 'id'> });
  } else {
    setConfig(undefined);
  }
  return uniqId;
}

const ModalContext = React.createContext<ReturnType<typeof setModalAction>>(() => _.uniqueId());
ModalContext.displayName = 'ModalContext';

export const useModal = () => React.useContext(ModalContext);

type ModalProviderProps = React.PropsWithChildren<{
  backdrop?: boolean;
}>;

export const ModalProvider: React.FC<ModalProviderProps> = ({
  backdrop = true,
  children,
}) => {

  const [config, setConfig] = React.useState<ModalConfig>();
  const [display, setDisplay] = React.useState<ModalConfig>();
  const theme = useTheme();
  const modalBackdrop = _useComponentStyle('modalBackdrop');
  const modalContainer = _useComponentStyle('modalContainer');

  const { value: fadeAnim, start } = useAnimate(0);
  React.useEffect(() => {
    setDisplay(current => config ?? current);
    start({
      toValue: _.isNil(config?.element) ? 0 : 1,
      duration: theme.modalDuration,
      easing: theme.modalEasing,
      onCompleted: () => {
        if (!_.isNil(config?.element)) return;
        setDisplay(undefined);
      }
    });
  }, [_.isNil(config?.element)]);

  const setModal = React.useCallback(setModalAction(setConfig), []);

  if (display?.element && config?.element && display.element !== config.element) setDisplay(config);

  return (
    <ModalContext.Provider value={setModal}>
      {children}
      {React.isValidElement(display?.element) && <>
        {backdrop === true && <Pressable
          onPress={display?.onDismiss ?? (() => setConfig(undefined))}
          style={normalizeStyle([
            {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: theme.zIndex.modalBackdrop,
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
            modalBackdrop,
            display?.backdropStyle ?? {},
            {
              opacity: fadeAnim,
            },
          ])} />}
        <View
          pointerEvents='box-none'
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: theme.zIndex.modal,
            },
            StyleSheet.absoluteFill,
            Platform.select({
              web: { position: 'fixed' } as any,
              default: {},
            }),
            modalContainer,
            display?.containerStyle ?? {},
            {
              opacity: fadeAnim,
            },
          ]}>
          {display?.element}
        </View>
      </>}
    </ModalContext.Provider>
  );
};

ModalProvider.displayName = 'ModalProvider';