import { flattenObject } from './flatten-object'

describe('FlattenObject', () => {
  interface TestInterface {
    test1: number
    test2: string
    test3: Date
    test4: string[]
    'test5.test6': number
    'test5.test7': string
    'test5.test8': Date
    'test5.test9': string[]
  }

  it('moves all members to the top level', () => {
    const input = {
      test1: 5,
      test2: 'test1',
      test3: new Date(),
      test4: ['test3'],
      test5: {
        test6: 23,
        test7: 'test2',
        test8: new Date(),
        test9: ['test4'],
      },
    }
    const result: TestInterface = flattenObject(input)

    expect(result).toEqual({
      test1: input.test1,
      test2: input.test2,
      test3: input.test3,
      test4: input.test4,
      'test5.test6': input.test5.test6,
      'test5.test7': input.test5.test7,
      'test5.test8': input.test5.test8,
      'test5.test9': input.test5.test9,
    })
  })
})
