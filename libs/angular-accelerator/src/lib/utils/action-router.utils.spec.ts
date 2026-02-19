import { Router } from '@angular/router'
import { handleAction, handleActionSync, resolveRouterLink } from './action-router.utils'
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

  describe('handleAction', () => {
    it('should navigate when DataAction has routerLink', async () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        routerLink: '/test-route',
        callback: jest.fn()
      }

      await handleAction(mockRouter, action, 'testData')

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route'])
    })

    it('should call callback when DataAction has no routerLink', async () => {
      const callbackFn = jest.fn()
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        callback: callbackFn
      }

      await handleAction(mockRouter, action, 'testData')

      expect(callbackFn).toHaveBeenCalledWith('testData')
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should not call callback when DataAction has callback that is not a function', async () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        callback: 'not-a-function' as any
      }

      await handleAction(mockRouter, action, 'testData')

      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should do nothing when DataAction has no routerLink and no valid callback', async () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST',
        callback: undefined as any
      }

      await handleAction(mockRouter, action, 'testData')

      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should navigate when Action has routerLink', async () => {
      const action: Action = {
        id: 'test',
        routerLink: '/test-route',
        actionCallback: jest.fn()
      }

      await handleAction(mockRouter, action)

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route'])
    })

    it('should call actionCallback when Action has no routerLink', async () => {
      const actionCallbackFn = jest.fn()
      const action: Action = {
        id: 'test',
        actionCallback: actionCallbackFn
      }

      await handleAction(mockRouter, action)

      expect(actionCallbackFn).toHaveBeenCalled()
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })
  })

  describe('handleActionSync', () => {

    it('should call callback when DataAction has no routerLink', () => {
      const callbackFn = jest.fn()
      const action: DataAction = {
        id: 'test',
        permission: 'TEST_PERMISSION',
        callback: callbackFn
      }
      const testData = { id: 1, name: 'test' }

      handleActionSync(mockRouter, action, testData)

      expect(callbackFn).toHaveBeenCalledWith(testData)
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should not call callback when DataAction has callback that is not a function', () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST_PERMISSION',
        callback: 'not-a-function' as any
      }

      handleActionSync(mockRouter, action, 'testData')

      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should do nothing when DataAction has no routerLink and no valid callback', () => {
      const action: DataAction = {
        id: 'test',
        permission: 'TEST_PERMISSION',
        callback: undefined as any
      }

      handleActionSync(mockRouter, action, 'testData')

      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })

    it('should call actionCallback when Action has no routerLink', () => {
      const actionCallbackFn = jest.fn()
      const action: Action = {
        id: 'test',
        actionCallback: actionCallbackFn
      }

      handleActionSync(mockRouter, action)

      expect(actionCallbackFn).toHaveBeenCalled()
      expect(mockRouter.navigate).not.toHaveBeenCalled()
    })
  })
})
