import { RuleTester } from '@typescript-eslint/rule-tester'
import { httpCallsOnlyInEffects } from './http-calls-only-in-effects.rule'

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

const messageId = 'httpCallsOnlyInEffects'

ruleTester.run('http-calls-only-in-effects', httpCallsOnlyInEffects, {
  valid: [
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/effects.ts`,
      code: `
        import { createEffect } from '@ngrx/effects'

        export class Effects {
          effect$ = createEffect(() => {
            return this.http.get('/api');
          })
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component.ts`,
      code: `
        import { Component } from '@angular/core'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          constructor(private readonly x: any) {}
          ngOnInit() {
            this.x.doSomething();
          }
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component.spec.ts`,
      code: `
        import { Component } from '@angular/core'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          ngOnInit() {
            this.http.get('/api')
          }
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/generated/component3.ts`,
      code: `
        import { Component } from '@angular/core'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          ngOnInit() {
            return this.userControllerApiService.getUser({})
          }
        }
      `,
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component-model.ts`,
      code: `
        import { Component } from '@angular/core'
        import { User } from './generated/user.model'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          user: User | null = null
          ngOnInit() {
            this.user = { } as User
          }
        }
      `,
    },
  ],
  invalid: [
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component.ts`,
      code: `
        import { Component } from '@angular/core'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          ngOnInit() {
            this.http.get('/api')
          }
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component3.ts`,
      code: `
        import { Component } from '@angular/core'
        import { UserControllerService } from './generated/user-controller.service'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          constructor(private readonly api: UserControllerService) {}
          ngOnInit() {
            return this.api.getUser({})
          }
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: `${process.cwd()}/libs/ngrx-linter-rules/src/app/component4.ts`,
      code: `
        import { Component, inject } from '@angular/core'
        import { UserControllerService } from './generated/user-controller.service'

        @Component({ selector: 'x', template: '' })
        export class Cmp {
          private readonly api = inject(UserControllerService)

          ngOnInit() {
            return this.api.getUser({})
          }
        }
      `,
      errors: [{ messageId }],
    },
  ],
})
