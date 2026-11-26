import { Injectable, OnDestroy, Provider, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterStateSnapshot, TitleStrategy } from '@angular/router'
import { ShellCapabilityService } from '@onecx/angular-integration-interface'
import { DocumentTitleTopic, ShellCapability } from '@onecx/integration-interface'

/**
 * Title strategy for microfrontends that are bootstrapped as web components with their own router.
 *
 * If the shell supports the {@link ShellCapability.DOCUMENT_TITLE_TOPIC} capability, the title of the
 * activated route is handed over to the shell via the {@link DocumentTitleTopic} together with the
 * current `document.location.pathname`, so the shell stays the single writer of `document.title`.
 * Otherwise the title is written to the document like Angular's default title strategy does.
 *
 * @example
 * ```ts
 * @NgModule({
 *   imports: [RouterModule.forRoot(routes)],
 *   providers: [provideMfeTitleStrategy()],
 * })
 * export class OneCXMyAppModule {}
 * ```
 */
@Injectable()
export class MfeTitleStrategy extends TitleStrategy implements OnDestroy {
  private readonly title = inject(Title)
  private readonly shellCapabilityService = inject(ShellCapabilityService)
  private documentTitleTopic: DocumentTitleTopic | undefined

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot)
    if (this.shellCapabilityService.hasCapability(ShellCapability.DOCUMENT_TITLE_TOPIC)) {
      this.documentTitleTopic ??= new DocumentTitleTopic()
      void this.documentTitleTopic.publish({ title, path: document.location.pathname })
    } else if (title !== undefined) {
      this.title.setTitle(title)
    }
  }

  ngOnDestroy(): void {
    this.documentTitleTopic?.destroy()
  }
}

/**
 * Provides the {@link MfeTitleStrategy} as the router's `TitleStrategy` of a microfrontend.
 *
 * @returns providers replacing Angular's default title strategy
 *
 * @example
 * ```ts
 * @NgModule({
 *   imports: [RouterModule.forRoot(routes)],
 *   providers: [provideMfeTitleStrategy()],
 * })
 * export class OneCXMyAppModule {}
 * ```
 */
export function provideMfeTitleStrategy(): Provider[] {
  return [{ provide: TitleStrategy, useClass: MfeTitleStrategy }]
}
