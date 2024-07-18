import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Optional,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'

export interface HasPermissionChecker {
  hasPermission(permissionKey: string): boolean
}

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 */
export class AlwaysGrantPermissionChecker implements HasPermissionChecker {
  hasPermission(_permissionKey: string): boolean {
    return true;
  }
}

export const HAS_PERMISSION_CHECKER = new InjectionToken<HasPermissionChecker>('hasPermission')

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]' })
export class IfPermissionDirective implements OnInit {
  @Input('ocxIfPermission') permission: string | undefined
  @Input('ocxIfNotPermission') set notPermission(value: string | undefined) {
    this.permission = value
    this.negate = true
  }

  @Input() onMissingPermission: 'hide' | 'disable' = 'hide'

  @Input() ocxIfPermissionPermissions: string[] | undefined
  @Input()
  set ocxIfNotPermissionPermissions(value: string[] | undefined) {
    this.ocxIfPermissionPermissions = value
  }

  negate = false

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    @Inject(HAS_PERMISSION_CHECKER)
    private permissionChecker: HasPermissionChecker,
    @Optional() private templateRef?: TemplateRef<any>
  ) {}

  ngOnInit() {
    if (this.permission) {
      if (this.negate === this.hasPermission(this.permission)) {
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

  hasPermission(permission: string) {
    if (this.ocxIfPermissionPermissions) {
      const result = this.ocxIfPermissionPermissions.includes(permission)
      if (!result) {
        console.log('👮‍♀️ No permission in overwrites for: `', permission)
      }
      return result
    }
    return this.permissionChecker.hasPermission(permission)
  }
}
