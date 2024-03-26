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
      this._src = value
    }
  }

  constructor(private el: ElementRef, private httpClient: HttpClient) {}
}
