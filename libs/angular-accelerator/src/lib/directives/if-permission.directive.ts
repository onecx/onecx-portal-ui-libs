import {
  Directive,
  EmbeddedViewRef,
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
import { Observable, of, BehaviorSubject } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]' })
export class IfPermissionDirective implements OnInit {
  @Input('ocxIfPermission') set permission(value: string | string[] | undefined) {
    this.permissionSubject.next(value)
  }

  @Input('ocxIfNotPermission') set notPermission(value: string | string[] | undefined) {
    this.permissionSubject.next(value)
    this.negate = true
  }

  @Input() ocxIfPermissionOnMissingPermission: 'hide' | 'disable' = 'hide'
  @Input() set ocxIfNotPermissionOnMissingPermission(value: 'hide' | 'disable') {
    this.ocxIfPermissionOnMissingPermission = value
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

  private permissionChecker: HasPermissionChecker
  private permissionSubject$ = new BehaviorSubject<string | string[] | undefined>(undefined)
  private isDisabled = false
  private directiveContentRef: EmbeddedViewRef<any> | undefined
  negate = false

  constructor(
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef,
    @Optional()
    @Inject(HAS_PERMISSION_CHECKER)
    private hasPermissionChecker?: HasPermissionChecker,
    @Optional() private templateRef?: TemplateRef<any>,
    @Optional() private userService?: UserService
  ) {
    const validChecker = hasPermissionChecker || userService
    if (!validChecker) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    this.permissionChecker = validChecker
  }

  ngOnInit() {
    this.permissionSubject
      .pipe(
        switchMap((permission) => {
          if (!permission) {
            return of(false)
          }
          const permissionsArray = Array.isArray(permission) ? permission : [permission]
          return this.hasPermission(permissionsArray)
        })
      )
      .subscribe((hasPermission) => {
        const shouldShowTemplate = this.negate ? !hasPermission : hasPermission
        if (shouldShowTemplate) {
          return this.showTemplateOrClear()
        }

        return this.showElseTemplateOrDefaultView()
      })
  }

  private hasPermission(permission: string[]): Observable<boolean> {
    if (this.ocxIfPermissionPermissions) {
      const result = permission.every((p) => this.ocxIfPermissionPermissions?.includes(p))
      if (!result) {
        console.log('👮‍♀️ No permission in overwrites for: `', permission)
      }
      return of(result)
    }

    if (this.permissionChecker.getPermissions) {
      return this.permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            console.log('👮‍♀️ No permission from permission checker for: `', permission)
          }
          return of(result)
        })
      )
    }

    return of(this.permissionChecker.hasPermission(permission))
  }

  private showTemplateOrClear() {
    this.resetView()

    if (this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

  private showElseTemplateOrDefaultView() {
    this.resetView()
    if (this.ocxIfPermissionElseTemplate) {
      this.viewContainer.createEmbeddedView(this.ocxIfPermissionElseTemplate)
      return
    }

    if (this.ocxIfPermissionOnMissingPermission === 'disable' && this.templateRef) {
      this.directiveContentRef = this.viewContainer.createEmbeddedView(this.templateRef)

      const el = this.getElement()
      el && this.renderer.setAttribute(el, 'disabled', 'disabled')
      this.isDisabled = true
    }
  }

  private resetView() {
    this.viewContainer.clear()
    if (this.isDisabled) {
      this.isDisabled = false
      const el = this.getElement()
      el && this.renderer.removeAttribute(el, 'disabled')
    }
  }

  private getElement(): Node | undefined {
    return this.directiveContentRef?.rootNodes[0]
  }
}
