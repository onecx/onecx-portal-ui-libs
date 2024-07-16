import { TestBed } from '@angular/core/testing'
import * as router_utils from './webcomponent-router.utils'

describe('webcomponent router utils', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents()

    jest.clearAllMocks()
  })

  describe('startsWith', () => {
    it('should consume base href and prefix only', () => {
      const emptyMatcher = router_utils.startsWith('')
      expect(
        emptyMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [{ path: 'admin' } as any, { path: 'help' } as any],
      })
      expect(
        emptyMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'item' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [{ path: 'admin' }, { path: 'help' }],
      })

      const singlePathMatcher = router_utils.startsWith('subPath')
      expect(
        singlePathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toBeNull()
      expect(
        singlePathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'item' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toBeNull()
      expect(
        singlePathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'subPath' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'subPath' } as any],
      })
      expect(
        singlePathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'subPath' } as any, { path: 'nested' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'subPath' } as any],
      })

      const complexPathMatcher = router_utils.startsWith('my/nested/subPath')
      expect(
        complexPathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toBeNull()
      expect(
        complexPathMatcher(
          [{ path: 'admin' } as any, { path: 'help' } as any, { path: 'item' } as any],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toBeNull()
      expect(
        complexPathMatcher(
          [
            { path: 'admin' } as any,
            { path: 'help' } as any,
            { path: 'my' } as any,
            { path: 'nested' } as any,
            { path: 'subPath' } as any,
          ],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [
          { path: 'admin' } as any,
          { path: 'help' } as any,
          { path: 'my' } as any,
          { path: 'nested' } as any,
          { path: 'subPath' } as any,
        ],
      })
      expect(
        complexPathMatcher(
          [
            { path: 'admin' } as any,
            { path: 'help' } as any,
            { path: 'my' } as any,
            { path: 'nested' } as any,
            { path: 'subPath' } as any,
            { path: 'nested2' } as any,
          ],
          {} as any,
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any
        )
      ).toEqual({
        consumed: [
          { path: 'admin' } as any,
          { path: 'help' } as any,
          { path: 'my' } as any,
          { path: 'nested' } as any,
          { path: 'subPath' } as any,
        ],
      })
    })
  })

  describe('sliceBaseHref', () => {
    it('should remove base href from url', () => {
      expect(
        router_utils.sliceBaseHref(
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any,
          ['admin' as any, 'help' as any]
        )
      ).toEqual([])
      expect(
        router_utils.sliceBaseHref(
          {
            data: {
              mfeInfo: {
                baseHref: '/admin/help',
              },
            },
          } as any,
          ['admin' as any, 'help' as any, 'item' as any]
        )
      ).toEqual(['item' as any])
      expect(
        router_utils.sliceBaseHref(
          {
            data: {
              mfeInfo: {
                baseHref: 'admin/help',
              },
            },
          } as any,
          ['admin' as any, 'help' as any, 'item' as any]
        )
      ).toEqual(['item' as any])
      expect(
        router_utils.sliceBaseHref(
          {
            data: {
              mfeInfo: {
                baseHref: 'admin/help/',
              },
            },
          } as any,
          ['admin' as any, 'help' as any, 'item' as any]
        )
      ).toEqual(['item' as any])
    })

    it('should warn if base href is not defined', () => {
      expect(router_utils.sliceBaseHref({} as any, ['admin' as any, 'help' as any])).toEqual([
        'admin' as any,
        'help' as any,
      ])
    })
  })

  describe('baseHrefSegmentAmount', () => {
    it('should return correct base href segment amount', () => {
      expect(router_utils.baseHrefSegmentAmount(['admin' as any, 'help' as any], [])).toEqual(2)
      expect(router_utils.baseHrefSegmentAmount([], [])).toEqual(0)
      expect(
        router_utils.baseHrefSegmentAmount(['admin' as any, 'help' as any, 'item' as any], ['item' as any])
      ).toEqual(2)
    })
  })
})
