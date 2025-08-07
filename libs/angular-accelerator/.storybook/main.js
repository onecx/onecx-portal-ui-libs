const rootMain = require('../../../.storybook/main')

module.exports = {
  ...rootMain,
  staticDirs: [{ from: '../assets', to: '/assets' }],
  stories: [
    '../src/**/*.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [...rootMain.addons, '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType })
    }

    // add your own webpack tweaks if needed

    return config
  },
}
