import { RuleTester } from '@typescript-eslint/rule-tester'
import { noStoreDispatchInEffect } from './no-store-dispatch-in-effect.rule'

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

const messageId = 'noStoreDispatchInEffect'

ruleTester.run('no-store-dispatch-in-effect', noStoreDispatchInEffect, {
  valid: [
    {
      filename: '/some/path/effects.ts',
      code: `
        class NotAnEffect {
          constructor(private store: any) {
            this.store.dispatch({ type: 'OK' })
          }
        }
      `,
    },
    {
      filename: '/some/path/not-effect.ts',
      code: `
        function fn(store: any) {
          store.dispatch({ type: 'OK' })
        }
      `,
    },
    {
      filename: '/some/path/effects.spec.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class AnyNameWorks {
          effect = createEffect(() => null as any)
          constructor(private store: any) {
            this.store.dispatch({ type: 'TEST' })
          }
        }
      `,
    },
  ],
  invalid: [
    {
      filename: '/some/path/effects.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class AnyNameWorks {
          effect = createEffect(() => null as any)
          constructor(private store: any) {
            this.store.dispatch({ type: 'X' })
          }
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: '/some/path/effects.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class AnyNameWorks {
          effect = createEffect(() => null as any)
          test() {
            const store: any = null as any
            store.dispatch({ type: 'Y' })
          }
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: '/some/path/effects.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class SomeEffect {
          effect = createEffect(() => null as any)
          store = { dispatch: (a: unknown) => a }

          test() {
            this.store.dispatch({ type: 'Z' })
          }
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: '/some/path/effects.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class TapEffect {
          effect = createEffect(() =>
            (null as any).pipe(
              tap(() => {
                this.store.dispatch({ type: 'TAP' })
              })
            )
          )

          constructor(private store: any) {}
        }
      `,
      errors: [{ messageId }],
    },
    {
      filename: '/some/path/effects.ts',
      code: `
        import { createEffect } from '@ngrx/effects'

        class MapEffect {
          effect = createEffect(() =>
            (null as any).pipe(
              map(() => {
                this.store.dispatch({ type: 'MAP' })
                return { type: 'OUT' }
              })
            )
          )

          constructor(private store: any) {}
        }
      `,
      errors: [{ messageId }],
    },
  ],
})
