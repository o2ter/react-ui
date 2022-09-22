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
import { View, Modal as RNModal, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../theme';

const ModalContext = React.createContext((element) => {});

export const useModal = () => React.useContext(ModalContext);

export const ModalProvider = ({ 
    children,
    backdrop = true,
}) => {
    
    const [modal, setModal] = React.useState();
    const theme = useTheme();
    
    return <ModalContext.Provider value={setModal}>
      {children}
      <RNModal visible={React.isValidElement(modal)} transparent>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {backdrop === true && <Pressable style={StyleSheet.absoluteFill} onPress={() => setModal()}>
            <View style={[theme.styles.modalBackdrop, StyleSheet.absoluteFill]} />
          </Pressable>}
          {modal}
        </View>
      </RNModal>
    </ModalContext.Provider>;
};
