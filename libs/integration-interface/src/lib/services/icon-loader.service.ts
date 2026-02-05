import { IconLoaderTopic } from '../topics/icons/v1/icons.topic'
import { IconClassType } from '../topics/icons/v1/icon-type'
import { ensureIconCache, generateClassName } from './icon-cache.service'

const DEFAULT_CLASS_TYPE: IconClassType = 'background-before'

export class IconLoader {
  private _iconLoaderTopic$: IconLoaderTopic | undefined;
  get iconLoaderTopic() {
    this._iconLoaderTopic$ ??= new IconLoaderTopic()
    return this._iconLoaderTopic$
  }
  set iconLoaderTopic(source: IconLoaderTopic) {
    this._iconLoaderTopic$ = source
  }

  constructor() {
    ensureIconCache()
  }

  getIconClass(name: string, classType: IconClassType = DEFAULT_CLASS_TYPE): string {
    const className =  generateClassName(name, classType)

    if (!(name in window.onecxIcons)) {
      window.onecxIcons[name] = undefined
    }
    
    this.iconLoaderTopic.publish({ type: 'IconRequested', name, classType })
    return className;
  }

  async getIconClassAsync(
    name: string,
    classType: IconClassType = DEFAULT_CLASS_TYPE
  ): Promise<string | null> {
    const className = this.getIconClass(name, classType)

    const cached = window.onecxIcons[name]
    if (cached === null) return null
    if (cached) return className

    return new Promise((resolve) => {
      const sub = this.iconLoaderTopic.subscribe((e) => {
        if (e.type !== 'IconsReceived') return
        const v = window.onecxIcons[name]
        if (v !== undefined) {
          sub.unsubscribe()
          resolve(v ? className : null)
        }
      })
    })
  }

  destroy(): void {
    this.iconLoaderTopic.destroy()
  }
}