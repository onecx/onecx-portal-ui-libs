import { RuleTester } from '@typescript-eslint/rule-tester'
import { noTranslateInstant } from './no-translate-instant.rule'

RuleTester.afterAll = afterAll

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
} as unknown as any)

const messageId = 'noTranslateInstant'

ruleTester.run('no-translate-instant', noTranslateInstant, {
  valid: [
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/some.spec.ts`,
      code: `
      class A {
        constructor(private translate: any) {}
        test() {
          return this.translate.instant('KEY')
        }
      }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/testing/test-helper.ts`,
      code: `
      const translateService: any = { instant: (k: string) => k }
      translateService.instant('KEY')
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/mocks/translate.mock.ts`,
      code: `
      const translate: any = { instant: (k: string) => k }
      translate.instant('KEY')
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/a.ts`,
      code: `
      const other = { instant: (k: string) => k }
      other.instant('KEY')
      `,
    },
  ],
  invalid: [
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/a.ts`,
      code: `
      class A {
        constructor(private translate: any) {}
        test() {
          return this.translate.instant('KEY')
        }
      }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/b.ts`,
      code: `
      function f(translate: any) {
        return translate.instant('KEY')
      }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/c.ts`,
      code: `
      function f(translateService: any) {
        return translateService.instant('KEY')
      }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/d.ts`,
      code: `
      class A {
        private translateService: any
        test() {
          return this.translateService.instant('KEY')
        }
      }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/e.ts`,
      code: `
      import { TranslateService } from '@ngx-translate/core'

      class A {
        constructor(private translate: TranslateService) {}
        test() {
          return this.translate.instant('KEY')
        }
      }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/f.ts`,
      code: `
      import { TranslateService } from '@ngx-translate/core'

      function f(translateService: TranslateService) {
        return translateService.instant('KEY')
      }
      `,
      errors: [{ messageId }],
    },
  ],
})
