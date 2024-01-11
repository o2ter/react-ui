//
//  index.tsx
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
import { View, Pressable, LayoutRectangle, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';

import { useTheme } from '../../theme';
import { _useComponentStyle } from '../Style';
import { flattenStyle } from '../Style/flatten';
import { useAnimate } from 'sugax';

type OffcanvasConfig = React.ReactElement | {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  backdropStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  element?: React.ReactElement;
};

const OffcanvasContext = React.createContext((config?: OffcanvasConfig) => { });
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

  const element = React.isValidElement(config) ? config : config && 'element' in config ? config.element : undefined;
  const { value: fadeAnim, start } = useAnimate(0);
  React.useEffect(() => {
    start({
      toValue: _.isNil(element) ? 0 : 1,
      duration: theme.offcanvasDuration,
      easing: theme.offcanvasEasing,
      onCompleted: () => {
        if (_.isNil(element)) {
          setDisplay(undefined);
          setLayout(undefined);
        } else {
          setDisplay(current => config ?? current);
        }
      }
    });
  }, [_.isNil(element)]);

  const displayElement = React.isValidElement(display) ? display : display && 'element' in display ? display.element : undefined;
  const placement = display && 'placement' in display ? display.placement ?? 'left' : 'left';

  return <OffcanvasContext.Provider value={setConfig}>
    {children}
    {React.isValidElement(displayElement) && <>
      {backdrop === true && <Pressable
        onPress={() => setConfig(undefined)}
        style={flattenStyle([
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
          display && 'backdropStyle' in display ? display.backdropStyle : {},
          {
            opacity: fadeAnim,
          },
        ])} />}
      <View
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
        style={flattenStyle([
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
          display && 'containerStyle' in display ? display.containerStyle : {},
          {
            opacity: layout ? 1 : 0,
            ...layout && placement === 'left' ? { left: (fadeAnim - 1) * layout.width } : {},
            ...layout && placement === 'right' ? { right: (fadeAnim - 1) * layout.width } : {},
            ...layout && placement === 'top' ? { top: (fadeAnim - 1) * layout.height } : {},
            ...layout && placement === 'bottom' ? { bottom: (fadeAnim - 1) * layout.height } : {},
          },
        ])}>
        {displayElement}
      </View>
    </>}
  </OffcanvasContext.Provider>;
};

OffcanvasProvider.displayName = 'OffcanvasProvider';
