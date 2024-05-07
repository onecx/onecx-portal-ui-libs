import { HttpClient } from '@angular/common/http'
import { Directive, ElementRef, Input } from '@angular/core'

@Directive({ selector: '[ocxSrc]' })
export class SrcDirective {
  private _src: string | undefined

  @Input()
  get ocxSrc(): string | undefined {
    return this._src
  }
  set ocxSrc(value: string | undefined) {
    if (value && this._src !== value) {
      try {
        if (new URL(value, window.location.origin).hostname === window.location.hostname) {
          this.httpClient.get(value, { responseType: 'blob' }).subscribe({
            next: (blob) => {
              const url = URL.createObjectURL(blob)
              this.el.nativeElement.onload = () => {
                URL.revokeObjectURL(url)
              }
              this.el.nativeElement.src = url
            },
            error: () => {
              this.el.nativeElement.src = 'error'
            },
          })
        } else {
          this.el.nativeElement.src = value
        }
      } catch (error) {
        console.log('Cannot parse URL ', value, error)
        this.el.nativeElement.src = value
      }
      this._src = value
    }
  }

  constructor(private el: ElementRef, private httpClient: HttpClient) {}
}
