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
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]' })
export class IfPermissionDirective implements OnInit {
  @Input('ocxIfPermission') permission: string | string[] | undefined
  @Input('ocxIfNotPermission') set notPermission(value: string | string[] | undefined) {
    this.permission = value
    this.negate = true
  }

  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'

  @Input() ocxIfPermissionPermissions: string[] | undefined
  @Input()
  set ocxIfNotPermissionPermissions(value: string[] | undefined) {
    this.ocxIfPermissionPermissions = value
  }

  @Input()
  ocxIfPermissionElseTemplate: TemplateRef<any> | undefined
  @Input()
  set ocxIfNotPermissionElseTemplate(value: TemplateRef<any> | undefined) {
    this.ocxIfPermissionElseTemplate = value
  }

  private permissionChecker: HasPermissionChecker | undefined
  negate = false

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    @Optional()
    @Inject(HAS_PERMISSION_CHECKER)
    private hasPermissionChecker?: HasPermissionChecker,
    @Optional() private templateRef?: TemplateRef<any>,
    @Optional() private userService?: UserService
  ) {
    if (!(hasPermissionChecker || userService)) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    this.permissionChecker = hasPermissionChecker ?? userService
  }

  ngOnInit() {
    if (
      (this.permission &&
        this.negate === this.hasPermission(Array.isArray(this.permission) ? this.permission : [this.permission])) ||
      !this.permission
    ) {
      if (this.ocxIfPermissionElseTemplate) {
        this.viewContainer.createEmbeddedView(this.ocxIfPermissionElseTemplate)
      } else {
        if (this.onMissingPermission === 'disable') {
          this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'disabled')
        } else {
          this.viewContainer.clear()
        }
      }
    } else {
      if (this.templateRef) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    }
  }

  hasPermission(permission: string[]) {
    if (this.ocxIfPermissionPermissions) {
      const result = permission.every((p) => this.ocxIfPermissionPermissions?.includes(p))
      if (!result) {
        console.log('👮‍♀️ No permission in overwrites for: `', permission)
      }
      return result
    }
    return permission.every((p) => this.permissionChecker?.hasPermission(p))
  }
}
