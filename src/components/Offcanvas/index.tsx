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
import { View, Pressable, StyleSheet, Platform } from 'react-native';

import { useTheme } from '../../theme';
import { useComponentStyle } from '../Style';

type OffcanvasConfig = {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  element?: React.ReactNode;
};

const OffcanvasContext = React.createContext((config: OffcanvasConfig = {}) => { });
OffcanvasContext.displayName = 'OffcanvasContext';

export const useOffcanvas = () => React.useContext(OffcanvasContext);

export const OffcanvasProvider: React.FC<React.PropsWithChildren<{
  backdrop?: boolean;
}>> = ({
  backdrop = true,
  children,
}) => {

  const [offcanvas, setOffcanvas] = React.useState<OffcanvasConfig>();
  const theme = useTheme();
  const offcanvasBackdrop = useComponentStyle('offcanvasBackdrop');
  const offcanvasContainer = useComponentStyle('offcanvasContainer');
  const offcanvasLeftContainer = useComponentStyle('offcanvasLeftContainer');
  const offcanvasRightContainer = useComponentStyle('offcanvasRightContainer');
  const offcanvasTopContainer = useComponentStyle('offcanvasTopContainer');
  const offcanvasBottomContainer = useComponentStyle('offcanvasBottomContainer');

  const placement = offcanvas?.placement ?? 'left';

  return <OffcanvasContext.Provider value={setOffcanvas}>
    {children}
    {React.isValidElement(offcanvas?.element) && <>
      {backdrop === true && <Pressable
        onPress={() => setOffcanvas(undefined)}
        style={[
          {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: theme.zIndex.offcanvasBackdrop,
          },
          Platform.select({
            web: { cursor: 'default' } as any,
            default: {},
          }),
          StyleSheet.absoluteFill,
          offcanvasBackdrop,
        ]} />}
      <View
        pointerEvents='box-none'
        style={[
          {
            zIndex: theme.zIndex.offcanvas,
            borderColor: theme.grays['300'],
            backgroundColor: theme.root.backgroundColor,
            ...placement === 'left' ? {} : { left: 0, borderLeftWidth: 1 },
            ...placement === 'right' ? {} : { right: 0, borderRightWidth: 1 },
            ...placement === 'top' ? {} : { top: 0, borderTopWidth: 1 },
            ...placement === 'bottom' ? {} : { bottom: 0, borderBottomWidth: 1 },
            ...placement === 'left' || placement === 'right' ? {
              width: 400,
              maxWidth: '100%',
            } : {
              height: 400,
              maxHeight: '100%',
            },
          },
          StyleSheet.absoluteFill,
          Platform.select({
            web: { position: 'fixed' } as any,
            default: {},
          }),
          offcanvasContainer,
          placement === 'left' && offcanvasLeftContainer,
          placement === 'right' && offcanvasRightContainer,
          placement === 'top' && offcanvasTopContainer,
          placement === 'bottom' && offcanvasBottomContainer,
        ]}>
        {offcanvas?.element}
      </View>
    </>}
  </OffcanvasContext.Provider>;
};

OffcanvasProvider.displayName = 'OffcanvasProvider';
