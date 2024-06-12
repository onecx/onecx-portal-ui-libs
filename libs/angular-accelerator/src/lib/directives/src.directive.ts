import { HttpClient } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core'

@Directive({ selector: '[ocxSrc]' })
export class SrcDirective {
  private _src: string | undefined

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

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
              this.el.nativeElement.style.visibility = 'initial'
            },
            error: () => {
              this.error.emit()
              this.el.nativeElement.style.visibility = 'initial'
            },
          })
        } else {
          this.el.nativeElement.src = value
          this.el.nativeElement.style.visibility = 'initial'
        }
      } catch (error) {
        console.log('Cannot parse URL ', value, error)
        this.el.nativeElement.src = value
        this.el.nativeElement.style.visibility = 'initial'
      }
      this._src = value
    }
  }

  constructor(private el: ElementRef, private httpClient: HttpClient) {
    this.el.nativeElement.style.visibility = 'hidden'
  }
}
