import {
  Directive,
  EmbeddedViewRef,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { from, Observable, of, switchMap } from 'rxjs'
import { createLogger } from '../utils/logger.utils'
import { OnMissingPermission, PermissionInput } from '../model/permission.model'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]', standalone: false })
export class IfPermissionDirective {
  private readonly logger = createLogger('IfPermissionDirective')
  private readonly renderer = inject(Renderer2)
  private readonly viewContainer = inject(ViewContainerRef)
  private readonly hasPermissionChecker = inject<HasPermissionChecker>(HAS_PERMISSION_CHECKER, { optional: true })
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private readonly userService = inject(UserService, { optional: true })
  private readonly destroyRef = inject(DestroyRef)

  ocxIfPermission = input<PermissionInput>(undefined)
  ocxIfNotPermission = input<PermissionInput>(undefined)

  ocxIfPermissionOnMissingPermission = input<OnMissingPermission>('hide')
  ocxIfNotPermissionOnMissingPermission = input<OnMissingPermission>('hide')

  ocxIfPermissionPermissions = input<string[] | undefined>(undefined)
  ocxIfNotPermissionPermissions = input<string[] | undefined>(undefined)

  ocxIfPermissionElseTemplate = input<TemplateRef<any> | undefined>(undefined)
  ocxIfNotPermissionElseTemplate = input<TemplateRef<any> | undefined>(undefined)

  private readonly permissionChecker = computed<HasPermissionChecker | undefined>(() => {
    return this.hasPermissionChecker ?? this.userService ?? undefined
  })
  private readonly isDisabled = signal<boolean>(false)
  private readonly directiveContentRef = signal<EmbeddedViewRef<any> | undefined>(undefined)

  private readonly permissionValidation = computed(() => {
    const positive = this.ocxIfPermission()
    const negative = this.ocxIfNotPermission()
    const negate = negative !== undefined

    const raw = negate ? negative : positive
    const permissions = this.normalizePermissions(raw)
    return {
      permissions,
      negate,
      onMissing: negate ? this.ocxIfNotPermissionOnMissingPermission() : this.ocxIfPermissionOnMissingPermission(),
      elseTemplate: negate ? this.ocxIfNotPermissionElseTemplate() : this.ocxIfPermissionElseTemplate(),
      overridePermissions: negate ? this.ocxIfNotPermissionPermissions() : this.ocxIfPermissionPermissions(),
    }
  })

  private normalizePermissions(raw: string | string[] | undefined): string[] {
    if (raw === undefined) {
      return []
    }
    if (Array.isArray(raw)) {
      return raw
    }
    return [raw]
  }

  constructor() {
    const validChecker = this.hasPermissionChecker || this.userService
    if (!validChecker) {
      throw 'IfPermission requires UserService or HasPermissionChecker to be provided!'
    }

    toObservable(this.permissionValidation)
      .pipe(
        switchMap((req) => {
          if (!req.permissions.length) {
            return of({ shouldShow: false, req })
          }
          return this.hasPermission(req.permissions, req.overridePermissions).pipe(
            switchMap((has) => of({ shouldShow: req.negate ? !has : has, req }))
          )
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ shouldShow, req }) => {
        if (shouldShow) {
          return this.showTemplateOrClear()
        }
        return this.showElseTemplateOrDefaultView(req.elseTemplate, req.onMissing)
      })
  }

  private hasPermission(permission: string[], overridePermissions?: string[]): Observable<boolean> {
    if (overridePermissions) {
      const result = permission.every((p) => overridePermissions?.includes(p))
      if (!result) {
        this.logger.debug('No permission in overwrites for:', permission)
      }
      return of(result)
    }

    const permissionChecker = this.permissionChecker()

    if (permissionChecker?.getPermissions) {
      return permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            this.logger.debug('No permission from permission checker for:', permission)
          }
          return of(result)
        })
      )
    }

    if (permissionChecker?.hasPermission) {
      return from(permissionChecker.hasPermission(permission))
    }

    return of(false)
  }

  private showTemplateOrClear() {
    this.resetView()

    if (this.templateRef) {
      this.directiveContentRef.set(this.viewContainer.createEmbeddedView(this.templateRef))
    }
  }

  private showElseTemplateOrDefaultView(elseTemplate?: TemplateRef<any>, onMissing: 'hide' | 'disable' = 'hide') {
    this.resetView()

    if (elseTemplate) {
      this.viewContainer.createEmbeddedView(elseTemplate)
      return
    }

    if (onMissing === 'disable' && this.templateRef) {
      this.directiveContentRef.set(this.viewContainer.createEmbeddedView(this.templateRef))

      const el = this.getElement()
      if (el) {
        this.renderer.setAttribute(el as any, 'disabled', 'disabled')
      }
      this.isDisabled.set(true)
    }
  }

  private resetView() {
    this.viewContainer.clear()
    if (this.isDisabled()) {
      this.isDisabled.set(false)
      const el = this.getElement()
      if (el) {
        this.renderer.removeAttribute(el as any, 'disabled')
      }
    }
  }

  private getElement(): Node | undefined {
    return this.directiveContentRef()?.rootNodes?.[0]
  }
}
