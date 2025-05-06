import { type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { type NextComponentType } from 'next'
import { type AppProps } from 'next/app'
import { type Router, type NextRouter } from 'next/router'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'
import r2wc from '@r2wc/react-to-web-component'
import { getLocation } from '@onecx/accelerator'
import { AppStateProvider, ConfigurationProvider } from '@onecx/react-integration-interface'
import { useAppHref } from './routing.utils'

type ContextHandlerProps = {
  router: NextRouter
  renderPage: (Component: NextComponentType) => ReactNode
}

const createNextjsWebComponent = (component: NextComponentType, elementName: string) => {
  const WebComponent = r2wc(component, {
    props: {},
  })
  customElements.define(elementName, WebComponent)
}

const normalizePath = (path: string) => path.replace(/\/+$/, '').replace(/^\/?/, '/')

const createNextjsAppWebComponent = (
  CustomPage: ({ Component, pageProps }: AppProps) => JSX.Element,
  routes: Record<string, NextComponentType>,
  elementName: string
) => {
  const ContextHandler = ({ router, renderPage }: ContextHandlerProps) => {
    const { href } = useAppHref()
    const baseHref = normalizePath(href)
    const currentPath = normalizePath(router.pathname)

    const relativePath = currentPath.startsWith(baseHref) ? currentPath.slice(baseHref.length) || '/' : currentPath

    const Component = routes[relativePath] || (() => <div>Page not found</div>)

    return <RouterContext.Provider value={router}>{renderPage(Component)}</RouterContext.Provider>
  }

  class CustomWebComponent extends HTMLElement {
    private _router: NextRouter
    private _root?: Root

    constructor() {
      super()

      const initialPath = `${getLocation().pathname}`

      this._router = {
        pathname: initialPath,
        query: {},
        asPath: initialPath,
        basePath: '',
        route: initialPath,
        isFallback: false,
        isReady: true,
        isLocaleDomain: false,
        isPreview: false,
        push: async (path: string) => {
          window.history.pushState({}, '', path)
          this.updatePath(path)
          return true
        },
        replace: async (path: string) => {
          window.history.replaceState({}, '', path)
          this.updatePath(path)
          return true
        },
        reload: () => window.location.reload(),
        back: () => window.history.back(),
        forward: () => window.history.forward(),
        prefetch: async () => Promise.resolve(),
        beforePopState: () => false,
        events: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          on: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          off: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          emit: () => {},
        },
      }

      window.addEventListener('popstate', () => this.updatePath(window.location.pathname))
    }

    connectedCallback(): void {
      const mountPoint = document.createElement('div')
      this.appendChild(mountPoint)

      if (!this._root) {
        this._root = createRoot(mountPoint)
      }

      this.render()
    }

    updatePath(path: string): void {
      this._router.pathname = path
      this._router.asPath = path
      this.render()
    }

    private render(): void {
      this._root?.render(
        <AppStateProvider>
          <ConfigurationProvider>
            <ContextHandler
              router={this._router}
              renderPage={(Component) => (
                <CustomPage pageProps={{}} Component={Component} router={this._router as Router} />
              )}
            />
          </ConfigurationProvider>
        </AppStateProvider>
      )
    }
  }

  customElements.define(elementName, CustomWebComponent)
}

export { createNextjsWebComponent, createNextjsAppWebComponent }
