import { Directive, ElementRef, Input, OnInit, Optional, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core'
import { UserService } from '../services/user.service'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]' })
export class IfPermissionDirective implements OnInit {
  @Input('ocxIfPermission') permission: string | undefined
  @Input('ocxIfNotPermission') set notPermission(value: string | undefined) {
    this.permission = value
    this.negate = true
  }

  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'
  negate = false

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
    @Optional() private templateRef?: TemplateRef<any>
  ) {}

  ngOnInit() {
    if (this.permission) {
      if (this.negate === this.userService.hasPermission(this.permission)) {
        if (this.onMissingPermission === 'disable') {
          this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'disabled')
        } else {
          this.viewContainer.clear()
        }
      } else {
        if (this.templateRef) {
          this.viewContainer.createEmbeddedView(this.templateRef)
        }
      }
    }
  }
}
