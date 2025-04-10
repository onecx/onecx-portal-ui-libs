import { AfterContentInit, Component, ElementRef, Input, inject } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-standalone-shell-viewport',
  template: `<ng-content><router-outlet></router-outlet></ng-content>`,
  styleUrls: ['./standalone-shell-viewport.component.scss'],
})
export class StandaloneShellViewportComponent implements AfterContentInit {
  private el = inject(ElementRef)

  ngAfterContentInit(): void {
    if (!this.isRouterDefined()) {
      console.warn(
        'RouterOutlet component was not found in the content. If you are using content projection, please make sure that RouterOutlet is in your template.'
      )
    }
  }
  // TODO: Enable by default once we know how to move forward with standalone styling
  @Input()
  set displayOneCXShellLayout(value: boolean) {
    console.warn('The displayOneCXShellLayout input is not implemented yet.')
  }

  private isRouterDefined() {
    const nodes = Array.from(this.el.nativeElement.childNodes as NodeList)
    while (nodes.length > 0) {
      const child = nodes.shift()
      if (child && child.nodeName === 'ROUTER-OUTLET') return true
      if (child && child.childNodes.length > 0) nodes.push(...Array.from(child.childNodes))
    }
    return false
  }
}
