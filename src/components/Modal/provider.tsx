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
import { View, Pressable, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { flattenStyle } from '../Style/flatten';
import { useAnimate } from 'sugax';
import { ModalConfig } from './types';

const ModalContext = React.createContext((config?: ModalConfig) => { });
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

  const element = React.isValidElement(config) ? config : config && 'element' in config ? config.element : undefined;
  const { value: fadeAnim, start } = useAnimate(0);
  React.useEffect(() => {
    setDisplay(current => config ?? current);
    start({
      toValue: _.isNil(element) ? 0 : 1,
      duration: theme.modalDuration,
      easing: theme.modalEasing,
      onCompleted: () => {
        if (!_.isNil(element)) return;
        setDisplay(undefined);
      }
    });
  }, [_.isNil(element)]);

  const displayElement = React.isValidElement(display) ? display : display && 'element' in display ? display.element : undefined;
  const onDismiss = display && 'onDismiss' in display ? display.onDismiss : undefined;

  if (displayElement && element && displayElement !== element) setDisplay(config);

  return <ModalContext.Provider value={setConfig}>
    {children}
    {React.isValidElement(displayElement) && <>
      {backdrop === true && <Pressable
        onPress={onDismiss ?? (() => setConfig(undefined))}
        style={flattenStyle([
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
          display && 'backdropStyle' in display ? display.backdropStyle : {},
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
          display && 'containerStyle' in display ? display.containerStyle : {},
          {
            opacity: fadeAnim,
          },
        ]}>
        {displayElement}
      </View>
    </>}
  </ModalContext.Provider>;
};

ModalProvider.displayName = 'ModalProvider';