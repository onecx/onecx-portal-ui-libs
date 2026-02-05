import { Injectable, OnDestroy } from '@angular/core'
import { IconLoader, IconClassType, IconLoaderTopic } from '@onecx/integration-interface'


@Injectable({ providedIn: 'root' })
export class IconService implements OnDestroy {
  private readonly iconLoaderService = new IconLoader()

  get iconLoaderTopic() {
    return this.iconLoaderService.iconLoaderTopic;
  }
  set iconLoaderTopic(source: IconLoaderTopic) {
    this.iconLoaderService.iconLoaderTopic = source;
  }

  getIcon(name: string, type?: IconClassType): string {
    return this.iconLoaderService.getIconClass(name, type)
  }

  getIconAsync(name: string, type?: IconClassType): Promise<string | null> {
    return this.iconLoaderService.getIconClassAsync(name, type)
  }

  ngOnDestroy(): void {
    this.iconLoaderService.destroy();
  }

  destroy() {
    this.ngOnDestroy();
  }
}