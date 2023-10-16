import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Optional,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { IAuthService } from '../../api/iauth.service'
import { AUTH_SERVICE } from '../../api/injection-tokens'

@Directive({ selector: '[ocxIfPermission]' })
export class IfPermissionDirective implements OnInit {
  @Input('ocxIfPermission') permission: string | undefined
  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Optional() private templateRef?: TemplateRef<any>
  ) {}

  ngOnInit() {
    if (this.permission) {
      if (!this.authService.hasPermission(this.permission)) {
        console.log(`Permission check failed: ${this.permission}`)
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
