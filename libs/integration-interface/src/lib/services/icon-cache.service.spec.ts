/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import {
  ensureIconCache,
  generateClassName,
  normalizeIconName
} from './icon-cache.service'
import { OnecxIcon } from '../topics/icons/v1/icons.model'

describe('icon-cache utilities', () => {
  beforeEach(() => {
    delete (window as any).onecxIcons
  })

  describe('ensureIconCache', () => {
    it('should initialize window.onecxIcons if not present', () => {
      expect(window.onecxIcons).toBeUndefined()

      ensureIconCache()

      expect(window.onecxIcons).toBeDefined()
      expect(window.onecxIcons).toEqual({})
    })

    it('should not overwrite existing icon cache', () => {
      const existing: Record<string, OnecxIcon | null | undefined> = {
        'mdi:home': undefined,
        'prime:user': null
      }

      window.onecxIcons = existing

      ensureIconCache()

      expect(window.onecxIcons).toBe(existing)
      expect(window.onecxIcons['mdi:home']).toBeUndefined()
      expect(window.onecxIcons['prime:user']).toBeNull()
    })
  })

  describe('generateClassName', () => {
    it('should generate correct class name for mdi icon (svg)', () => {
      const result = generateClassName('mdi:car-tire-alert', 'svg')

      expect(result).toBe(
        'onecx-theme-icon-svg-mdi-car-tire-alert'
      )
    })

    it('should generate correct class name for prime icon (background)', () => {
      const result = generateClassName('prime:check-circle', 'background')

      expect(result).toBe(
        'onecx-theme-icon-background-prime-check-circle'
      )
    })

    it('should generate correct class name for background-before', () => {
      const result = generateClassName(
        'mdi:settings-remote',
        'background-before'
      )

      expect(result).toBe(
        'onecx-theme-icon-background-before-mdi-settings-remote'
      )
    })

    it('should normalize icon name internally', () => {
      const result = generateClassName(
        'mdi:home@battery!',
        'svg'
      )

      expect(result).toBe(
        'onecx-theme-icon-svg-mdi-home-battery-'
      )
    })
  })
})
