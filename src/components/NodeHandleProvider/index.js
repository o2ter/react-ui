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
import { findDOMNode } from 'react-dom';

export class NodeHandleProvider extends React.PureComponent {

  state = {
    nodeHandle: null,
  }

  componentDidMount() {
    const nodeHandle = findDOMNode(this);
    this.setState({ nodeHandle: nodeHandle }, () => {
      if (_.isFunction(this.props.onChangeHandle)) this.props.onChangeHandle(nodeHandle);
    });
  }

  componentDidUpdate() {
    const nodeHandle = findDOMNode(this);
    if (nodeHandle !== this.state.nodeHandle) {
      this.setState({ nodeHandle: nodeHandle }, () => {
        if (_.isFunction(this.props.onChangeHandle)) this.props.onChangeHandle(nodeHandle);
      });
    }
  }

  componentWillUnmount() {
    this.setState({ nodeHandle: null }, () => {
      if (_.isFunction(this.props.onChangeHandle)) this.props.onChangeHandle();
    });
  }

  render() {
    return this.props.children;
  }
};

export default NodeHandleProvider;