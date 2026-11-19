export default {
  extends: ['stylelint-config-recommended'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/reports/**',
    '**/tmp/**',
    '**/.angular/**',
    '**/.nx/**',
    'libs/*/assets/tailwind.css',
  ],
  overrides: [
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-recommended-scss'],
      rules: {
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['host', 'host-context'] }],
        'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
      },
    },
    {
      files: ['libs/*/tailwind.css'],
      rules: {
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'apply',
              'config',
              'custom-variant',
              'plugin',
              'reference',
              'source',
              'theme',
              'utility',
              'variant',
            ],
          },
        ],
      },
    },
  ],
}
