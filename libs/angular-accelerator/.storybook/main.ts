import type { StorybookConfig } from '@storybook/angular'
import type { Configuration } from 'webpack'

const config: StorybookConfig = {
  staticDirs: [{ from: '../assets', to: '/assets' }],
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (webpackConfig): Promise<Configuration> => {
    // The workspace uses NodeNext-style import specifiers (e.g. `./foo.js`) in TS sources.
    // TypeScript can resolve these to `./foo.ts`, but webpack needs extension aliasing too.
    webpackConfig.resolve ??= {}
    webpackConfig.resolve.extensionAlias = {
      ...(webpackConfig.resolve.extensionAlias ?? {}),
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    }
    webpackConfig.resolve.extensions = Array.from(
      new Set([...(webpackConfig.resolve.extensions ?? []), '.ts', '.mts', '.js', '.mjs'])
    )

    return webpackConfig
  },
}

export default config

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
