//
//  index.js
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

type UploadInputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'children'> & {
  children?: React.ReactNode | ((input: React.RefObject<HTMLInputElement>) => React.ReactNode | undefined);
};

const UploadInputContext = React.createContext<React.RefObject<HTMLInputElement> | null>(null);

export const UploadInput: React.FC<UploadInputProps> = ({ children, style, ...props }) => {
  const ref = React.useRef<React.ComponentRef<'input'>>(null);
  return (
    <>
      <UploadInputContext.Provider value={ref}>
        {_.isFunction(children) ? children(ref) : children}
      </UploadInputContext.Provider>
      <input ref={ref} type='file' style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        inset: 0,
        opacity: 0,
        ...style ?? {},
      }} {...props} />
    </>
  );
}

export const useUploadInput = () => React.useContext(UploadInputContext);

export default UploadInput;
