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
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

export {
  useHref,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
  useResolvedPath,
  useLinkClickHandler,
  Link,
  NavLink,
} from 'react-router-dom';

const NavigatorContext = React.createContext<Record<string, any> | undefined>(undefined);

export const BrowserNavigator: React.FC<React.PropsWithChildren> = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;
export const StaticNavigator: React.FC<React.PropsWithChildren<{
  location: Partial<Location> | string;
  context?: Record<string, any>;
}>> = ({ location, context, children }) => <NavigatorContext.Provider value={context}>
  <StaticRouter location={location}>{children}</StaticRouter>
</NavigatorContext.Provider>;

export const useNavigatorContext = () => React.useContext(NavigatorContext);

function invariant(cond: boolean, message: string): any {
  if (!cond) throw new Error(message);
}

export const Route: React.FC<{
  component: any;
  statusCode?: number;
  title?: string;
  meta?: Record<string, string>;
  caseSensitive?: boolean;
  index?: boolean;
  path?: string;
  id?: string;
}> = () => invariant(
  false,
  `A <Route> is only ever to be used as the child of <Navigator> element, ` +
  `never rendered directly. Please wrap your <Route> in a <Navigator>.`
);

function createRoutesFromChildren(children: React.ReactNode) {

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
  statusCode,
  title,
  meta = {},
  children,
  ...props
}) => {

  const NavigatorContext = useNavigatorContext();

  if (NavigatorContext) {
    for (const [key, value] of Object.entries(props)) {
      NavigatorContext[key] = value;
    }
    NavigatorContext.statusCode = statusCode;
    NavigatorContext.title = title;
    NavigatorContext.meta = meta;
  }

  if (globalThis.document && _.isString(title)) {
    document.title = title;
  }

  return <Component {...props}>{children}</Component>;
}

function routesBuilder(routes: any[]): any {

  const result = [];

  for (const route of routes) {

    const {
      caseSensitive,
      component,
      path,
      index,
      children = [],
      ...props
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

export const Navigator: React.FC<React.PropsWithChildren> = ({ children }) => useRoutes(routesBuilder(createRoutesFromChildren(children)));
