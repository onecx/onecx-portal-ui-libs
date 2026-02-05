import { RuleTester } from '@typescript-eslint/rule-tester'
import { noSubscribeAssignment } from './no-subscribe-assignment.rule'

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

const messageId = 'assignmentOutside'

ruleTester.run('no-subscribe-assignment', noSubscribeAssignment, {
  valid: [
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        of(1).subscribe((value) => {
          const local = value
          console.log(local)
        })
      }
      `,
    },
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        let outer = 0
        of(1).subscribe((value) => {
          const outer = value
          console.log(outer)
        })
        console.log(outer)
      }
      `,
    },
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        of({ a: 1 }).subscribe((value) => {
          const { a } = value
          console.log(a)
        })
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        let outer: number | undefined
        of(1).subscribe((value) => {
          outer = value
        })
        console.log(outer)
      }
      `,
      errors: [{ messageId }],
    },
    {
      code: `
      import { of } from 'rxjs'

      class A {
        value?: number
        test() {
          of(1).subscribe((value) => {
            this.value = value
          })
        }
      }
      `,
      errors: [{ messageId }],
    },
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        let outer = 0
        of(1).subscribe(function (value) {
          outer++
        })
        console.log(outer)
      }
      `,
      errors: [{ messageId }],
    },
    {
      code: `
      import { of } from 'rxjs'

      function test() {
        let outer = 0
        of(1).subscribe((value) => {
          ;({ outer } = { outer: value })
        })
        console.log(outer)
      }
      `,
      errors: [{ messageId }],
    },
  ],
})
