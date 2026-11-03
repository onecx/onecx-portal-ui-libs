import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
]
