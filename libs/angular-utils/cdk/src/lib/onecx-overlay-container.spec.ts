import { TestBed } from '@angular/core/testing'
import { OverlayContainer } from '@angular/cdk/overlay'
import { OnecxOverlayContainer } from './onecx-overlay-container'
import { DYNAMIC_CONTAINER } from '@onecx/angular-integration-interface'

describe('OnecxOverlayContainer', () => {
  let container: OnecxOverlayContainer
  let dynamicContainerElement: HTMLElement

  describe('without DYNAMIC_CONTAINER', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: OverlayContainer, useClass: OnecxOverlayContainer }],
      })
      container = TestBed.inject(OverlayContainer) as OnecxOverlayContainer
    })

    afterEach(() => {
      container.ngOnDestroy()
      TestBed.resetTestingModule()
    })

    it('should be instantiated', () => {
      expect(container).toBeTruthy()
    })

    it('should fall back to body when DYNAMIC_CONTAINER is not provided', () => {
      const containerEl = container.getContainerElement()

      expect(containerEl).toBeTruthy()
      expect(document.body.contains(containerEl)).toBe(true)
      expect(containerEl.id).toBe('')
    })

    it('should apply the cdk-overlay-container class', () => {
      const containerEl = container.getContainerElement()

      expect(containerEl.classList.contains('cdk-overlay-container')).toBe(true)
    })
  })

  describe('with DYNAMIC_CONTAINER', () => {
    beforeEach(() => {
      dynamicContainerElement = document.createElement('div')
      dynamicContainerElement.id = 'dynamic-container'
      document.body.appendChild(dynamicContainerElement)

      TestBed.configureTestingModule({
        providers: [
          { provide: OverlayContainer, useClass: OnecxOverlayContainer },
          { provide: DYNAMIC_CONTAINER, useValue: () => dynamicContainerElement },
        ],
      })
      container = TestBed.inject(OverlayContainer) as OnecxOverlayContainer
    })

    afterEach(() => {
      container.ngOnDestroy()
      dynamicContainerElement.remove()
      TestBed.resetTestingModule()
    })

    it('should use the dynamic container', () => {
      const containerEl = container.getContainerElement()

      expect(containerEl).toEqual(dynamicContainerElement)
      expect(containerEl.id).toBe('dynamic-container')
      expect(document.body.contains(containerEl)).toBe(true)
    })

    it('should apply the cdk-overlay-container class', () => {
      const containerEl = container.getContainerElement()

      expect(containerEl.classList.contains('cdk-overlay-container')).toBe(true)
    })

    it('should return the same container element on subsequent calls', () => {
      const containerEl1 = container.getContainerElement()
      const containerEl2 = container.getContainerElement()

      expect(containerEl1).toBe(containerEl2)
    })
  })
})
