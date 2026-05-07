import { Injectable, OnDestroy } from '@angular/core'
import { IconService as IconServiceInterface, IconClassType, IconTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class IconService implements OnDestroy {
  private readonly iconServiceInterface = new IconServiceInterface()

  get iconTopic(): IconTopic {
    return this.iconServiceInterface.iconTopic;
  }

  requestIcon(name: string, type?: IconClassType): string {
    return this.iconServiceInterface.requestIcon(name, type)
  }

  requestIconAsync(name: string, type?: IconClassType): Promise<string | null>
  requestIconAsync(name: string, type: IconClassType, fallbackClass: string): Promise<string>
  requestIconAsync(name: string, type?: IconClassType, fallbackClass?: string): Promise<string | null> {
    return this.iconServiceInterface.requestIconAsync(name, type, fallbackClass)
  }

  ngOnDestroy(): void {
    this.iconServiceInterface.destroy();
  }
}