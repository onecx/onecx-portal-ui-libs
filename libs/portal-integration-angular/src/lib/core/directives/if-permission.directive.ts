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
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    @Optional() private templateRef?: TemplateRef<any>
  ) {}

  ngOnInit() {
    if (this.permission) {
      if (this.negate === this.authService.hasPermission(this.permission)) {
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
