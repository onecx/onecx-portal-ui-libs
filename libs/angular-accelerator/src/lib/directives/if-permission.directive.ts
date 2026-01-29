import {
  Directive,
  EmbeddedViewRef,
  OnInit,
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
import { from, Observable, of, switchMap, withLatestFrom } from 'rxjs'

@Directive({ selector: '[ocxIfPermission], [ocxIfNotPermission]', standalone: false })
export class IfPermissionDirective {
  private renderer = inject(Renderer2)
  private viewContainer = inject(ViewContainerRef)
  private hasPermissionChecker = inject<HasPermissionChecker>(HAS_PERMISSION_CHECKER, { optional: true })
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private userService = inject(UserService, { optional: true })
  private destroyRef = inject(DestroyRef)

  permission = input<string | string[] | undefined>(undefined, { alias: 'ocxIfPermission' })
  notPermission = input<string | string[] | undefined>(undefined, { alias: 'ocxIfNotPermission' })

  onMissingPermission = input<'hide' | 'disable'>('hide', { alias: 'ocxIfPermissionOnMissingPermission' })
  notOnMissingPermission = input<'hide' | 'disable'>('hide', { alias: 'ocxIfNotPermissionOnMissingPermission' })

  permissions = input<string[] | undefined>(undefined, { alias: 'ocxIfPermissionPermissions' })
  notPermissions = input<string[] | undefined>(undefined, { alias: 'ocxIfNotPermissionPermissions' })

  elseTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'ocxIfPermissionElseTemplate' })
  notElseTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'ocxIfNotPermissionElseTemplate' })

  private permissionChecker = computed<HasPermissionChecker | undefined>(() => {
    return this.hasPermissionChecker ?? this.userService ?? undefined
  })
  private isDisabled = signal<boolean>(false)
  private directiveContentRef = signal<EmbeddedViewRef<any> | undefined>(undefined)

  private permissionValidation = computed(() => {
    const positive = this.permission()
    const negative = this.notPermission()
    const negate = negative !== undefined

    const raw = negate ? negative : positive
    const permissions = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw]
    return {
      permissions,
      negate,
      onMissing: negate ? this.notOnMissingPermission() : this.onMissingPermission(),
      elseTemplate: negate ? this.notElseTemplate() : this.elseTemplate(),
      overridePermissions: negate ? this.notPermissions() : this.permissions(),
    }
  })

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
        console.log('👮‍♀️ No permission in overwrites for: `', permission)
      }
      return of(result)
    }

    const permissionChecker = this.permissionChecker()

    if (permissionChecker?.getPermissions) {
      return permissionChecker.getPermissions().pipe(
        switchMap((permissions) => {
          const result = permission.every((p) => permissions.includes(p))
          if (!result) {
            console.log('👮‍♀️ No permission from permission checker for: `', permission)
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
