import { Injectable, OnDestroy, Provider, inject } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { RouterStateSnapshot, TitleStrategy } from '@angular/router'
import { ShellCapabilityService } from '@onecx/angular-integration-interface'
import { DocumentTitleTopic, ShellCapability } from '@onecx/integration-interface'

/**
 * Title strategy for microfrontends that hands the document title of the active route to the shell.
 *
 * If the shell provides the {@link ShellCapability.DOCUMENT_TITLE_TOPIC} capability, the resolved route title is
 * published on the {@link DocumentTitleTopic} together with the current `document.location.pathname`, and the shell
 * stays the single writer of `document.title`. Otherwise the title is written directly, like Angular's default
 * title strategy does, so microfrontends running in older shells behave as before.
 *
 * Register it with {@link provideMfeTitleStrategy}.
 */
@Injectable()
export class MfeTitleStrategy extends TitleStrategy implements OnDestroy {
  private readonly title = inject(Title)
  private readonly shellCapabilityService = inject(ShellCapabilityService)
  private documentTitleTopic?: DocumentTitleTopic

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot)
    if (this.shellCapabilityService.hasCapability(ShellCapability.DOCUMENT_TITLE_TOPIC)) {
      this.getDocumentTitleTopic().publish({ title, path: document.location.pathname })
    } else if (title !== undefined) {
      this.title.setTitle(title)
    }
  }

  ngOnDestroy(): void {
    this.documentTitleTopic?.destroy()
  }

  private getDocumentTitleTopic(): DocumentTitleTopic {
    this.documentTitleTopic ??= new DocumentTitleTopic()
    return this.documentTitleTopic
  }
}

/**
 * Provides the {@link MfeTitleStrategy} as the router's `TitleStrategy` of a microfrontend.
 *
 * @returns providers replacing the default `TitleStrategy`.
 *
 * @example
 * ```ts
 * @NgModule({
 *   providers: [provideMfeTitleStrategy()],
 * })
 * export class AppModule {}
 * ```
 */
export function provideMfeTitleStrategy(): Provider[] {
  return [{ provide: TitleStrategy, useClass: MfeTitleStrategy }]
}
