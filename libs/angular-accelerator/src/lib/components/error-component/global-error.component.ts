import { Component, effect, inject, Input, input, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  standalone: false,
  selector: 'ocx-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss'],
})
export class GlobalErrorComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  _effectiveErrCode = signal<string | undefined>(undefined)
  errCode = input<string | undefined>(undefined)
  backUrl = signal<string | undefined>(undefined)

  constructor() {
    effect(() => {
      const errCode = this.errCode()
      if (errCode) {
        this._effectiveErrCode.set(errCode)
      }
    })
    this._effectiveErrCode.set(this.route.snapshot.queryParamMap.get('err') || 'E1001_FAILED_START')
    this.backUrl.set(this.route.snapshot.queryParamMap.get('return') || '/')
  }

  onGoBack() {
    const backUrl = this.backUrl()
    if (backUrl) {
      this.router.navigateByUrl(backUrl)
    }
  }

  reload() {
    window.location.reload()
  }
}
