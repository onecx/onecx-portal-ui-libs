import { Injectable, OnDestroy } from '@angular/core'
import { IconService as IconServiceInterface, IconClassType, IconTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class IconService implements OnDestroy {
  private readonly iconServiceInterface = new IconServiceInterface()

  get iconTopic() {
    return this.iconServiceInterface.iconTopic;
  }
  set iconTopic(source: IconTopic) {
    this.iconServiceInterface.iconTopic = source;
  }

  requestIcon(name: string, type?: IconClassType): string {
    return this.iconServiceInterface.requestIcon(name, type)
  }

  requestIconAsync(name: string, type?: IconClassType): Promise<string | null> {
    return this.iconServiceInterface.requestIconAsync(name, type)
  }

  ngOnDestroy(): void {
    this.iconServiceInterface.destroy();
  }

  destroy() {
    this.ngOnDestroy();
  }
}