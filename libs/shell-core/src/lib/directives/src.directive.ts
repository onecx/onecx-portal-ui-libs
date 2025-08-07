import { HttpClient, HttpResponse } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'

@Directive({ selector: '[ocxShellSrc]', standalone: false })
export class ShellSrcDirective {
  private el = inject(ElementRef)
  private httpClient = inject(HttpClient)

  private _src: string | undefined

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

  @Input()
  get ocxShellSrc(): string | undefined {
    return this._src
  }
  set ocxShellSrc(value: string | undefined) {
    if (value && this._src !== value && window.location.hostname) {
      try {
        if (new URL(value, window.location.origin).hostname === window.location.hostname) {
          this.httpClient.get(value, { observe: 'response', responseType: 'blob' }).subscribe(
            (response: HttpResponse<Blob>) => {
              // ok with content
              if (response?.status === 200) {
                const url = URL.createObjectURL(response.body as Blob)
                this.el.nativeElement.addEventListener('load', () => {
                  URL.revokeObjectURL(url)
                })
                this.el.nativeElement.src = url
              }
              // no content
              if (response?.status === 204) {
                this.error.emit()
              }
            },
            () => {
              // on error
              this.error.emit()
            },
            () => {
              // on complete
              this.el.nativeElement.style.visibility = 'initial'
            }
          )
        } else {
          this.el.nativeElement.src = value
          this.el.nativeElement.style.visibility = 'initial'
        }
      } catch (error) {
        console.error('Cannot parse URL ', value, error)
        this.el.nativeElement.src = value
        this.el.nativeElement.style.visibility = 'initial'
      }
      this._src = value
    }
  }

  constructor() {
    this.el.nativeElement.style.visibility = 'hidden'
  }
}
