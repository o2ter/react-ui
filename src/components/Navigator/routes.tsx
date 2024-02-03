//
//  routes.tsx
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
import { useNavigatorContext } from './context';
import { useLocation, Location } from 'react-router-dom';

function invariant(cond: boolean, message: string): any {
  if (!cond) throw new Error(message);
}

export const Route: React.FC<{
  component: React.ComponentType<any>;
  layout?: React.ComponentType<{
    children?: React.ReactNode;
  }>;
  props?: any;
  statusCode?: number | ((location: Location) => number);
  title?: string | ((location: Location) => string);
  meta?: Record<string, string> | ((location: Location) => Record<string, string>);
  caseSensitive?: boolean;
  index?: boolean;
  path?: string;
  id?: string;
}> = () => invariant(
  false,
  `A <Route> is only ever to be used as the child of <Navigator> element, ` +
  `never rendered directly. Please wrap your <Route> in a <Navigator>.`
);

Route.displayName = 'Route';

export function createRoutesFromChildren(children?: React.ReactNode) {

  const routes: any[] = [];

  React.Children.forEach(children, element => {

    if (!React.isValidElement(element)) return;

    if (element.type === React.Fragment) {
      routes.push(createRoutesFromChildren(element.props.children));
      return;
    }

    invariant(
      element.type === Route,
      `[${typeof element.type === 'string' ? element.type : element.type.name}] ` +
      `is not a <Route> component. All component children of <Navigator> must be a <Route> or <React.Fragment>`
    );

    const route = { ...element.props };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return _.flattenDeep(routes);
}

const RouteObject: React.FC<React.PropsWithChildren<React.ComponentPropsWithoutRef<typeof Route>>> = ({
  component: Component,
  layout: Layout = React.Fragment,
  props: _props,
  children,
  ...props
}) => {

  const {
    statusCode,
    title,
    meta = {},
  } = props;

  const NavigatorContext = useNavigatorContext();
  const location = useLocation();

  const _statusCode = _.isFunction(statusCode) ? statusCode(location) : statusCode;
  const _title = _.isFunction(title) ? title(location) : title;
  const _meta = _.isFunction(meta) ? meta(location) : meta;

  if (NavigatorContext) {
    for (const [key, value] of Object.entries(props)) {
      NavigatorContext[key] = value;
    }
    NavigatorContext.statusCode = _statusCode;
    NavigatorContext.title = _title;
    NavigatorContext.meta = _meta;
  }

  if (globalThis.document && _.isString(_title)) {
    document.title = _title;
  }

  return (
    <Layout>
      <Component {...props} {..._props}>{children}</Component>
    </Layout>
  );
};

RouteObject.displayName = 'RouteObject';

export function routesBuilder(routes: any[]): any {

  const result = [];

  for (const route of routes) {

    const {
      caseSensitive, component, path, index, children = [], ...props
    } = route;

    result.push({
      element: !_.isNil(component) ? <RouteObject component={component} {...props} /> : undefined,
      caseSensitive,
      path,
      index,
      children: routesBuilder(children),
    });
  }

  return result;
}
