import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs'
import { createLogger } from '../utils/logger.utils'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]', standalone: false })
export class IfPermissionDirective implements OnInit {
  private readonly logger = createLogger('IfPermissionDirective')
  private renderer = inject(Renderer2)
  private el = inject(ElementRef)
  private viewContainer = inject(ViewContainerRef)
  private hasPermissionChecker = inject<HasPermissionChecker>(HAS_PERMISSION_CHECKER, { optional: true })
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private userService = inject(UserService, { optional: true })

  @Input('ocxIfPermission') set permission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
  }
  @Input('ocxIfNotPermission') set notPermission(value: string | string[] | undefined) {
    this.permissionSubject$.next(value)
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

  constructor() {
    const validChecker = this.hasPermissionChecker || this.userService
    if (!validChecker) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    this.permissionChecker = validChecker
  }

  ngOnInit() {
    this.permissionSubject$
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
        this.logger.debug('No permission in overwrites for:', permission)
      }
      return of(result)
    }

    if (this.permissionChecker.getPermissions) {
      return this.permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            this.logger.debug('No permission from permission checker for:', permission)
          }
          return of(result)
        })
      )
    }

    return from(this.permissionChecker.hasPermission(permission))
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
      if (el) {
        this.renderer.setAttribute(el, 'disabled', 'disabled')
      }
      this.isDisabled = true
    }
  }

  private resetView() {
    this.viewContainer.clear()
    if (this.isDisabled) {
      this.isDisabled = false
      const el = this.getElement()
      if (el) {
        this.renderer.removeAttribute(el, 'disabled')
      }
    }
  }

  private getElement(): Node | undefined {
    return this.directiveContentRef?.rootNodes[0]
  }
}
