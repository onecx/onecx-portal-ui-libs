// import { type ReactNode } from 'react';
// import { createRoot, type Root } from 'react-dom/client';
// import { type NextComponentType } from 'next';
// import { type AppProps } from 'next/app';
// import { type Router, type NextRouter } from 'next/router';
// import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
// import r2wc from '@r2wc/react-to-web-component';
// import { getLocation } from '@onecx/accelerator';
// import {
//   AppStateProvider,
//   ConfigurationProvider,
// } from '@onecx/react-integration-interface';
// import { useAppHref } from './routing.utils';

// type ContextHandlerProps = {
//   router: NextRouter;
//   renderPage: (Component: NextComponentType) => ReactNode;
// };

// const createNextjsWebComponent = (
//   component: NextComponentType,
//   elementName: string
// ) => {
//   const WebComponent = r2wc(component, {
//     props: {},
//   });
//   customElements.define(elementName, WebComponent);
// };

// const normalizePath = (path: string) =>
//   path.replace(/\/+$/, '').replace(/^\/?/, '/');

// const createNextjsAppWebComponent = (
//   CustomPage: ({ Component, pageProps }: AppProps) => JSX.Element,
//   routes: Record<string, NextComponentType>,
//   elementName: string
// ) => {
//   const ContextHandler = ({ router, renderPage }: ContextHandlerProps) => {
//     const { href } = useAppHref();
//     const baseHref = normalizePath(href);
//     const currentPath = normalizePath(router.pathname);

//     const relativePath = currentPath.startsWith(baseHref)
//       ? currentPath.slice(baseHref.length) || '/'
//       : currentPath;

//     const Component = routes[relativePath] || (() => <div>Page not found</div>);

//     return (
//       <RouterContext.Provider value={router}>
//         {renderPage(Component)}
//       </RouterContext.Provider>
//     );
//   };

//   /**
//    * Custom Web Component wrapper for Next.js app
//    * - Handles router mock, popstate, cleanup, dynamic props, and attributes as props
//    */
//   class CustomWebComponent extends HTMLElement {
//     private _router: NextRouter;
//     private _root?: Root;
//     private _onPopState: () => void;

//     constructor() {
//       super();

//       const initialPath = `${getLocation().pathname}`;

//       // Helper to parse query string
//       const parseQuery = (search: string) =>
//         Object.fromEntries(new URLSearchParams(search));

//       this._router = {
//         pathname: initialPath,
//         query: parseQuery(window.location.search),
//         asPath: initialPath,
//         basePath: '',
//         route: initialPath,
//         isFallback: false,
//         isReady: true,
//         isLocaleDomain: false,
//         isPreview: false,
//         push: async (path: string) => {
//           window.history.pushState({}, '', path);
//           this.updatePath(path);
//           this._router.events.emit('routeChangeComplete', path);
//           return true;
//         },
//         replace: async (path: string) => {
//           window.history.replaceState({}, '', path);
//           this.updatePath(path);
//           this._router.events.emit('routeChangeComplete', path);
//           return true;
//         },
//         reload: () => window.location.reload(),
//         back: () => window.history.back(),
//         forward: () => window.history.forward(),
//         prefetch: async () => Promise.resolve(),
//         beforePopState: () => false,
//         events: new (class {
//           private _listeners: Record<string, ((...args: any[]) => void)[]> = {};
//           on(event: string, cb: (...args: any[]) => void) {
//             this._listeners[event] = this._listeners[event] || [];
//             this._listeners[event].push(cb);
//           }
//           off(event: string, cb: (...args: any[]) => void) {
//             if (!this._listeners[event]) return;
//             this._listeners[event] = this._listeners[event].filter(
//               (fn) => fn !== cb
//             );
//           }
//           emit(event: string, ...args: any[]) {
//             (this._listeners[event] || []).forEach((fn) => fn(...args));
//           }
//         })(),
//       };

//       this._onPopState = this._onPopStateImpl.bind(this);
//       window.addEventListener('popstate', this._onPopState);
//     }

//     private _onPopStateImpl() {
//       this.updatePath(window.location.pathname);
//     }

//     connectedCallback(): void {
//       // Ensure only one mountPoint exists
//       let mountPoint = this.querySelector(
//         'div[data-mount-point]'
//       ) as HTMLDivElement | null;
//       if (!mountPoint) {
//         mountPoint = document.createElement('div');
//         mountPoint.setAttribute('data-mount-point', 'true');
//         this.appendChild(mountPoint);
//       }

//       if (!this._root) {
//         this._root = createRoot(mountPoint);
//       }

//       this.render();
//     }

//     disconnectedCallback(): void {
//       window.removeEventListener('popstate', this._onPopState);
//       this._root?.unmount();
//       // Clean up mountPoint
//       const mountPoint = this.querySelector('div[data-mount-point]');
//       if (mountPoint) {
//         this.removeChild(mountPoint);
//       }
//     }

//     updatePath(path: string): void {
//       this._router.pathname = path;
//       this._router.asPath = path;
//       this._router.query = Object.fromEntries(
//         new URLSearchParams(window.location.search)
//       );
//       this.render();
//     }

//     /**
//      * React to attribute changes and rerender React
//      */
//     static get observedAttributes() {
//       // Observe all attributes present at creation time
//       return [];
//     }

//     attributeChangedCallback(name: string, oldValue: string, newValue: string) {
//       if (oldValue !== newValue) {
//         this.render();
//       }
//     }

//     /**
//      * Converts webcomponent attributes to props for React, with basic type conversion
//      */
//     private getPropsFromAttributes(): Record<string, any> {
//       const convert = (value: string): any => {
//         if (value === 'true') return true;
//         if (value === 'false') return false;
//         if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
//         return value;
//       };
//       return Object.fromEntries(
//         Array.from(this.attributes).map((attr) => [
//           attr.name,
//           convert(attr.value),
//         ])
//       );
//     }

//     private render(): void {
//       try {
//         this._root?.render(
//           <AppStateProvider>
//             <ConfigurationProvider>
//               <ContextHandler
//                 router={this._router}
//                 renderPage={(Component) => (
//                   <CustomPage
//                     pageProps={{ ...this.getPropsFromAttributes() }}
//                     Component={Component}
//                     router={this._router as Router}
//                   />
//                 )}
//               />
//             </ConfigurationProvider>
//           </AppStateProvider>
//         );
//       } catch (err) {
//         // Fallback to error message in DOM
//         const mountPoint = this.querySelector('div[data-mount-point]');
//         if (mountPoint) {
//           mountPoint.innerHTML = `<pre style='color:red'>${
//             (err as Error).message
//           }</pre>`;
//         }
//       }
//     }
//   }

//   customElements.define(elementName, CustomWebComponent);
// };

// export { createNextjsWebComponent, createNextjsAppWebComponent };
