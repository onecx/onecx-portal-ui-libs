import { RuleTester } from '@typescript-eslint/rule-tester'
import { preferTranslateParams } from './prefer-translate-params.rule'

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

const messageId = 'preferTranslateParams'

ruleTester.run('prefer-translate-params', preferTranslateParams, {
  valid: [
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/a.ts`,
      code: `
        function f(translate: any, name: string) {
          return translate.get('HELLO_NAME', { name })
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/b.ts`,
      code: `
        function f(translate: any, name: string) {
          return translate.get('HELLO_' + name)
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/b2.ts`,
      code: `
        function f(translate: any, name: string) {
          return translate.stream('HELLO_' + name)
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/http.ts`,
      code:
        `
        function f(response: any) {
          return new Error(` +
        '`' +
        "Unexpected content type: ${response.headers.get('Content-Type')}" +
        '`' +
        `)
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/keys.ts`,
      code: `
        import { map } from 'rxjs'
        function f(translateService: any, values: string[], prefix: string) {
          return translateService
            .get(values.map((v) => prefix + v))
            .pipe(map((translations: any) => values.map((v) => translations[prefix + v])))
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/some.spec.ts`,
      code: `
        function f(translate: any, name: string) {
          return translate.get('HELLO')
        }
      `,
    },
  ],
  invalid: [
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/d.ts`,
      code: `
        import { map } from 'rxjs'

        function f(translateService: any, name: string) {
          return translate.get('HELLO').pipe(map((t: string) => 'Hi ' + t))
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/rx.ts`,
      code: `
        import { map } from 'rxjs'

        function f(translate: any, name: string) {
          return translate.get('HELLO').pipe(map((t: string) => t + name))
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/rx2.ts`,
      code: `
        import { map } from 'rxjs'

        function f(translate: any, name: string) {
          return translate.stream('HELLO').pipe(map((t: string) => t + name))
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/e.ts`,
      code:
        `
        function f(translate: any, name: string) {
          return ` +
        '`' +
        "${translate.instant('HELLO')} ${name}" +
        '`' +
        `
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/angular-linter-rules/src/app/i18n.ts`,
      code: `
        class A {
          constructor(private i18n: any) {}
          label(name: string) {
            return this.i18n.instant('HELLO') + name
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
})
