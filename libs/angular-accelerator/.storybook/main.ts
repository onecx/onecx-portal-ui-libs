import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/angular-vite'

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url))

const config: StorybookConfig = {
  // Only the folders loaded at runtime. assets/tailwind.css is a global style (project.json `styles`) and is imported
  // as a module, serving it as a static file would return raw CSS instead.
  staticDirs: [
    { from: '../assets/i18n', to: '/assets/i18n' },
    { from: '../assets/images', to: '/assets/images' },
  ],
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/angular-vite',
    options: {
      // Absolute path, the Vitest run (test-a11y) resolves a relative tsconfig against the workspace root.
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    },
  },
  // lightningcss rejects `@media (max-width: var(--mobile-break-point))` in angular-utils portal-page.component.scss
  // (var() is not valid in media queries, browsers drop the rule). Recover by dropping the rule as browsers do.
  // Remove once the stylesheet is fixed.
  viteFinal: (config) => ({
    ...config,
    css: { ...config.css, lightningcss: { ...config.css?.lightningcss, errorRecovery: true } },
    // The library has its own package.json, so Vite only serves files below it. Allow the workspace root for the
    // assets of the root node_modules (e.g. the @openng/icons fonts).
    server: {
      ...config.server,
      fs: { ...config.server?.fs, allow: [...(config.server?.fs?.allow ?? []), workspaceRoot] },
    },
  }),
}

export default config
