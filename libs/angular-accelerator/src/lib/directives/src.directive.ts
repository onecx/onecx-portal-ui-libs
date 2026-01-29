import { HttpClient, HttpResponse } from '@angular/common/http'
import { Directive, ElementRef, EventEmitter, Input, Output, effect, inject, input } from '@angular/core'
import { take } from 'rxjs'

@Directive({ selector: '[ocxSrc]', standalone: false })
export class SrcDirective {
  private readonly el = inject(ElementRef)
  private readonly httpClient = inject(HttpClient)
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() error = new EventEmitter<void>()

  ocxSrc = input<string | undefined>(undefined, { alias: 'ocxSrc' })

  constructor() {
    effect(() => {
      const src = this.ocxSrc()
      if (src && globalThis.location.hostname) {
        try {
          if (new URL(src, globalThis.location.origin).hostname === globalThis.location.hostname) {
            this.httpClient
              .get(src, { observe: 'response', responseType: 'blob' })
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
            this.el.nativeElement.src = src
            this.el.nativeElement.style.visibility = 'initial'
          }
        } catch (error) {
          console.error('Cannot parse URL ', src, error)
          this.el.nativeElement.src = src
          this.el.nativeElement.style.visibility = 'initial'
        }
      }
    })
    this.el.nativeElement.style.visibility = 'hidden'
  }
}
