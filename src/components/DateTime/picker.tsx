//
//  picker.tsx
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
import { Platform } from 'react-native';
import { Modify } from '../../internals/types';
import { Pressable } from '../Pressable';
import { Modal, useModal } from '../Modal';
import { useTheme } from '../../theme';
import { Popover } from '../Popover';
import Text from '../Text';
import View from '../View';
import { useMergeRefs } from 'sugax';
import { _StyleContext } from '../Style';

type SelectPosition = 'top' | 'bottom';
type SelectAlignment = 'left' | 'right';

export type PopoverConfig = {
  arrow?: boolean;
  shadow?: boolean | number;
  position?: SelectPosition | SelectPosition[];
  alignment?: SelectAlignment | SelectAlignment[];
};

type PickerBaseProps = Modify<React.ComponentPropsWithoutRef<typeof Text> & Pick<React.ComponentPropsWithoutRef<typeof Pressable>, 'onFocus' | 'onBlur'>, {
  popover?: boolean | PopoverConfig;
  picker: any;
  disabled?: boolean;
  pickerHidden: boolean;
  setPickerHidden: React.Dispatch<React.SetStateAction<boolean>>;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}>

export const PickerBase = React.forwardRef<React.ComponentRef<typeof Pressable>, PickerBaseProps>(({
  popover,
  style,
  picker,
  disabled,
  pickerHidden,
  setPickerHidden,
  onFocus,
  onBlur,
  prepend,
  append,
  children,
  ...props
}, forwardRef) => {

  const theme = useTheme();

  const pressableRef = React.useRef<React.ComponentRef<typeof Pressable>>();
  const ref = useMergeRefs(pressableRef, forwardRef);

  const pickerBody = (
    <Pressable
      ref={ref}
      onPress={() => {
        if (disabled) return;
        setPickerHidden(false);
      }}
      style={[
        {
          flexDirection: 'row',
          gap: theme.spacer * 0.375,
        },
        Platform.select({
          web: { outline: 0 } as any,
          default: {},
        }),
        style
      ]}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {prepend}
      {_.isString(children) ? (
        <Text style={{ flex: 1 }} {...props}>{children || ' '}</Text>
      ) : children}
      {append}
    </Pressable>
  );

  if (!popover) {
    return (
      <>
        {pickerBody}
        <Modal
          visible={disabled ? false : !pickerHidden}
          onDismiss={() => {
            setPickerHidden(true);
          }}
        >{picker}</Modal>
      </>
    );
  }

  return (
    <_StyleContext.Consumer>
      {(_style) => (
        <Popover
          hidden={disabled ? true : pickerHidden}
          position={_.isBoolean(popover) ? ['top', 'bottom'] : popover?.position}
          alignment={_.isBoolean(popover) ? ['left', 'right'] : popover?.alignment}
          arrow={_.isBoolean(popover) ? false : popover?.arrow ?? false}
          shadow={_.isBoolean(popover) ? false : popover?.shadow ?? false}
          onTouchOutside={(e) => {
            if (pressableRef.current === e.target as any) return;
            setPickerHidden(true);
          }}
          containerStyle={{
            display: 'flex',
            borderColor: theme.grays['400'],
            borderWidth: theme.borderWidth,
            borderRadius: theme.borderRadiusBase,
            padding: 4,
          }}
          render={() => (
            <_StyleContext.Provider value={_style}>
              <View style={{ minWidth: 350 }}>{picker}</View>
            </_StyleContext.Provider>
          )}
        >
          {pickerBody}
        </Popover>
      )}
    </_StyleContext.Consumer>
  );
});
