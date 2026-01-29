import { AfterContentInit, Component, ElementRef, Input, inject } from '@angular/core'
import { Message, PortalMessageService } from '@onecx/angular-integration-interface'
import { MessageService } from 'primeng/api'
import { createLogger } from '../../utils/logger.utils'

@Component({
  standalone: false,
  selector: 'ocx-standalone-shell-viewport',
  template: `
    <ng-content>
      <router-outlet></router-outlet>
      <p-toast [style]="{ 'word-break': 'break-word' }"></p-toast>
    </ng-content>
  `,
  styleUrls: ['./standalone-shell-viewport.component.scss'],
})
export class StandaloneShellViewportComponent implements AfterContentInit {
  private readonly logger = createLogger('StandaloneShellViewportComponent')
  private el = inject(ElementRef)
  private messageService = inject(MessageService)
  private portalMessageService = inject(PortalMessageService)

  constructor() {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
  }

  ngAfterContentInit(): void {
    if (!this.isRouterDefined()) {
      this.logger.warn(
        'RouterOutlet component was not found in the content. If you are using content projection, please make sure that RouterOutlet is in your template.'
      )
    }
  }
  // TODO: Enable by default once we know how to move forward with standalone styling
  @Input()
  set displayOneCXShellLayout(value: boolean) {
    this.logger.warn('The displayOneCXShellLayout input is not implemented yet.')
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
