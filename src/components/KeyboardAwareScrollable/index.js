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
import { Platform, UIManager, Keyboard, TextInput, findNodeHandle } from 'react-native';
import { useMergeRefs } from 'sugax';

const _KeyboardAwareScrollable = (Scrollable) => React.forwardRef(({
  onScroll,
  scrollEventThrottle = 1,
  children,
  ...props
}, forwardRef) => {

  const scrollViewRef = React.useRef();
  const scrollEvent = React.useRef({});

  const ref = useMergeRefs(scrollViewRef, forwardRef);

  React.useEffect(() => {

    const event = Keyboard.addListener('keyboardWillShow', (event) => {

      const currentlyFocusedInput = TextInput.State.currentlyFocusedInput();
      const scrollResponder = scrollViewRef.current.getScrollResponder();
      const innerViewNode = scrollResponder.getInnerViewNode();

      UIManager.viewIsDescendantOf(findNodeHandle(currentlyFocusedInput), innerViewNode, (isAncestor) => {

        if (isAncestor) {

          currentlyFocusedInput.measureInWindow((_x, y, _width, height) => {

            const maxY = y + height;
            const contentOffsetY = scrollEvent.current.contentOffset?.y ?? 0;

            if (maxY > event.endCoordinates.screenY) {

              scrollViewRef.current.scrollTo({ y: contentOffsetY + maxY - event.endCoordinates.screenY });
            }
          });
        }
      });
    });

    return () => event.remove();

  }, []);

  return <Scrollable
    ref={ref}
    onScroll={(event) => {
      _.assignIn(scrollEvent.current, event.nativeEvent);
      if (_.isFunction(onScroll)) onScroll(event);
    }}
    scrollEventThrottle={scrollEventThrottle}
    scrollToOverflowEnabled={true}
    {...props}>{children}</Scrollable>;
});

export const KeyboardAwareScrollable = Platform.select({
  ios: _KeyboardAwareScrollable,
  default: (Component) => Component,
});