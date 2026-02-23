import { filter, firstValueFrom, map } from 'rxjs';
import { IconClassType } from '../topics/icons/v1/icon.model';
import { IconTopic } from '../topics/icons/v1/icon.topic';
import { ensureProperty } from '@onecx/accelerator';
import '../declarations';

const DEFAULT_CLASS_TYPE: IconClassType = 'background-before'


export function ensureIconCache(): void {
  ensureProperty(globalThis, ['onecxIcons'], {})
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
    const className = generateClassName(name, classType)

    if (globalThis.onecxIcons && !(name in globalThis.onecxIcons)) {
      ensureProperty(globalThis, ['onecxIcons', name], undefined)
      this.iconTopic.publish({ type: 'IconRequested', name })
    }
    return className;
  }

  async requestIconAsync(
    name: string,
    classType: IconClassType = DEFAULT_CLASS_TYPE
  ): Promise<string | null> {
    const className = this.requestIcon(name, classType)

    const cached = globalThis.onecxIcons?.[name]
    if (cached === null) return null
    if (cached) return className

    await firstValueFrom(
      this.iconTopic.pipe(
        filter(e => e.type === 'IconsReceived'),
        map(() => globalThis.onecxIcons?.[name]),
        filter(v => v !== undefined),
      )
    )
      
    return globalThis.onecxIcons?.[name] ? className : null
  }

  destroy(): void {
    this.iconTopic.destroy()
  }
}