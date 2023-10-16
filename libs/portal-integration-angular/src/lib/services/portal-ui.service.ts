import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'
import { Translations } from '../api/translations'

@Injectable({ providedIn: 'root' })
export class PortalUIService {
  menuHoverActive = false
  isSlim = false
  isHorizontal = false
  isStatic = false
  menuActive = false
  mobileMenuActive = false
  isDesktop = false
  isMobile = false
  fixedHeader = true
  private translation: Translations = {}

  activeMenuItemId: Subject<string> = new BehaviorSubject<string>('')

  private translationSource = new Subject<any>()

  translationObserver = this.translationSource.asObservable()

  getTranslation(key: keyof Translations) {
    return this.translation[key]
  }

  setTranslation(value: Translations) {
    this.translation = { ...this.translation, ...value }
    this.translationSource.next(this.translation)
  }
}
