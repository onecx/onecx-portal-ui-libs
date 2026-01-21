import { HttpClient, HttpResponse } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core'
import { take } from 'rxjs'

@Directive({ selector: '[ocxSrc]', standalone: false })
export class SrcDirective {
  private readonly el = inject(ElementRef)
  private readonly httpClient = inject(HttpClient)

  private _src: string | undefined

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

  @Input()
  get ocxSrc(): string | undefined {
    return this._src
  }
  set ocxSrc(value: string | undefined) {
    if (value && this._src !== value && globalThis.location.hostname) {
      try {
        if (new URL(value, globalThis.location.origin).hostname === globalThis.location.hostname) {
          this.httpClient
            .get(value, { observe: 'response', responseType: 'blob' })
            .pipe(take(1))
            .subscribe({
              next: (response: HttpResponse<Blob>) => {
                // ok with content
                if (response?.status === 200) {
                  const url = URL.createObjectURL(response.body as Blob)
                  const onLoad = () => {
                    URL.revokeObjectURL(url)
                    this.el.nativeElement.removeEventListener('load', onLoad)
                  }
                  this.el.nativeElement.addEventListener('load', onLoad)
                  this.el.nativeElement.src = url
                }
                // no content
                if (response?.status === 204) {
                  this.error.emit()
                }
              },
              error: () => {
                // on error
                this.error.emit()
              },
              complete: () => {
                // on complete
                this.el.nativeElement.style.visibility = 'initial'
              },
            })
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
