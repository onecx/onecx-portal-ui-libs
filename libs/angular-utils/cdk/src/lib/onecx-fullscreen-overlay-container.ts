import { inject, Injectable, OnDestroy } from '@angular/core'
import {} from './onecx-overlay-container'
import { FullscreenOverlayContainer } from '@angular/cdk/overlay'
import { DYNAMIC_CONTAINER } from '@onecx/angular-integration-interface'

/**
 * Custom Angular CDK FullscreenOverlayContainer that appends the fullscreen overlay container element
 * to the OneCX dynamic container instead of creating a new element.
 *
 * This allows all CDK fullscreen overlays (dialogs, tooltips, dropdowns, etc.) to be scoped
 * within the designated dynamic container element, which is required for
 * micro-frontend applications running as web components.
 *
 * @example
 * ```typescript
 * providers: [
 *   { provide: FullscreenOverlayContainer, useClass: OnecxFullscreenOverlayContainer }
 * ]
 * ```
 */
@Injectable()
export class OnecxFullscreenOverlayContainer extends FullscreenOverlayContainer implements OnDestroy {
  protected readonly _dynamicContainer = inject(DYNAMIC_CONTAINER, { optional: true })

  protected override _createContainer(): void {
    super._createContainer()
    if (this._containerElement && this._dynamicContainer) {
      const dynamicContainerElement = this._dynamicContainer()
      // Copy all classes and attributes from the default container to the dynamic container
      dynamicContainerElement.className = this._containerElement.className
      Array.from(this._containerElement.attributes).forEach((attr) => {
        dynamicContainerElement.setAttribute(attr.name, attr.value)
      })
      // Remove the default container from the body and replace it with the dynamic container
      this._containerElement.replaceWith(dynamicContainerElement)
      this._containerElement = dynamicContainerElement
    }
  }
}
