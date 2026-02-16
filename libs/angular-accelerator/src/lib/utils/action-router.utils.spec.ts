import { Router } from '@angular/router'
import { onActionClick, resolveRouterLink } from './action-router.utils'
import { DataAction } from '../model/data-action'
import { Action } from '../components/page-header/page-header.component'

describe('ActionRouterUtils', () => {
  let mockRouter: jest.Mocked<Router>

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    } as any
  })

  describe('resolveRouterLink', () => {
    it('should return string directly', async () => {
      const result = await resolveRouterLink('/test')
      expect(result).toBe('/test')
    })

    it('should call function and return string', async () => {
      const linkFunction = jest.fn().mockReturnValue('/function-link')
      const result = await resolveRouterLink(linkFunction)
      expect(result).toBe('/function-link')
      expect(linkFunction).toHaveBeenCalled()
    })

    it('should call function and await promise result', async () => {
      const linkFunction = jest.fn().mockReturnValue(Promise.resolve('/promise-function-link'))
      const result = await resolveRouterLink(linkFunction)
      expect(result).toBe('/promise-function-link')
      expect(linkFunction).toHaveBeenCalled()
    })

    it('should await promise directly', async () => {
      const linkPromise = Promise.resolve('/promise-link')
      const result = await resolveRouterLink(linkPromise)
      expect(result).toBe('/promise-link')
    })
  })

  describe('onActionClick', () => {
    it('should navigate when DataAction has routerLink', async () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        routerLink: '/test-route',
        callback: jest.fn()
      }

      await onActionClick(mockRouter, action, 'testData')

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route'])
    })

    it('should call callback when DataAction has no routerLink', async () => {
      const callbackFn = jest.fn()
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        callback: callbackFn
      }

      await onActionClick(mockRouter, action, 'testData')

      expect(callbackFn).toHaveBeenCalledWith('testData')
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should navigate when Action has routerLink', async () => {
      const action: Action = {
        id: 'test',
        routerLink: '/test-route',
        actionCallback: jest.fn()
      }

      await onActionClick(mockRouter, action)

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route'])
    })

    it('should call actionCallback when Action has no routerLink', async () => {
      const actionCallbackFn = jest.fn()
      const action: Action = {
        id: 'test',
        actionCallback: actionCallbackFn
      }

      await onActionClick(mockRouter, action)

      expect(actionCallbackFn).toHaveBeenCalled()
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })
  })
})
