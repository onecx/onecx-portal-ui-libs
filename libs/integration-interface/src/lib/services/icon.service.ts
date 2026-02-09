import { filter, firstValueFrom, map } from 'rxjs';
import { IconCache, IconClassType } from '../topics/icons/v1/icon.model';
import { IconTopic } from '../topics/icons/v1/icon.topic'

const DEFAULT_CLASS_TYPE: IconClassType = 'background-before'

declare global {
    interface Window {
        onecxIcons: Record<string, IconCache | null | undefined>
    }
}

export function ensureIconCache(): void {
    window.onecxIcons ??= {} 
}

export function generateClassName(name: string, classType: IconClassType): string {
    const safeName = normalizeIconName(name)
    return `onecx-theme-icon-${classType}-${safeName}`
}

export function normalizeIconName(name: string): string {
    return name.replaceAll(/[^a-zA-Z0-9_-]+/g, '-')
}


export class IconService {

  private _iconTopic$: IconTopic | undefined;
  get iconTopic() {
    this._iconTopic$ ??= new IconTopic()
    return this._iconTopic$
  }
  set iconTopic(source: IconTopic) {
    this._iconTopic$ = source
  }

  constructor() {
    ensureIconCache()
  }

  requestIcon(name: string, classType: IconClassType = DEFAULT_CLASS_TYPE): string {
    const className =  generateClassName(name, classType)

    if (!(name in window.onecxIcons)) {
      window.onecxIcons[name] = undefined
    }
    
    this.iconTopic.publish({ type: 'IconRequested', name, classType })
    return className;
  }

  async requestIconAsync(
    name: string,
    classType: IconClassType = DEFAULT_CLASS_TYPE
  ): Promise<string | null> {
    const className = this.requestIcon(name, classType)

    const cached = window.onecxIcons[name]
    if (cached === null) return null
    if (cached) return className

    await firstValueFrom(
      this.iconTopic.pipe(
        filter(e => e.type === 'IconsReceived'),
        map(() => window.onecxIcons[name]),
        filter(v => v !== undefined),
      )
    )

    const resolved = window.onecxIcons[name]
    return resolved ? className : null
  }

  destroy(): void {
    this.iconTopic.destroy()
  }
}