import { Injectable, OnDestroy } from '@angular/core'
import { CurrentThemeTopic } from '@onecx/integration-interface'

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  currentTheme$ = new CurrentThemeTopic()

  ngOnDestroy(): void {
    this.currentTheme$.destroy()
  }
}
