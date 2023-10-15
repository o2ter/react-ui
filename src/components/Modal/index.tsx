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
import { View, Pressable, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from '../../theme';
import { useComponentStyle } from '../Style';

type ModalConfig = React.ReactElement | {
  backdropStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  element?: React.ReactElement;
};

const ModalContext = React.createContext((config?: ModalConfig) => { });
ModalContext.displayName = 'ModalContext';

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider: React.FC<React.PropsWithChildren<{
  backdrop?: boolean;
}>> = ({
  backdrop = true,
  children,
}) => {

  const [config, setConfig] = React.useState<ModalConfig>();
  const theme = useTheme();
  const modalBackdrop = useComponentStyle('modalBackdrop');
  const modalContainer = useComponentStyle('modalContainer');

  const element = React.isValidElement(config) ? config : config && 'element' in config ? config.element : undefined;

  return <ModalContext.Provider value={setConfig}>
    {children}
    {React.isValidElement(element) && <>
      {backdrop === true && <Pressable
        onPress={() => setConfig(undefined)}
        style={[
          {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: theme.zIndex.modalBackdrop,
          },
          Platform.select({
            web: { cursor: 'default' } as any,
            default: {},
          }),
          StyleSheet.absoluteFill,
          modalBackdrop,
          config && 'backdropStyle' in config ? config.backdropStyle : {},
        ]} />}
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
          config && 'containerStyle' in config ? config.containerStyle : {},
        ]}>
        {element}
      </View>
    </>}
  </ModalContext.Provider>;
};

ModalProvider.displayName = 'ModalProvider';