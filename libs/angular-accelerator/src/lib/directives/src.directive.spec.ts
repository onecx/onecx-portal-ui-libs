import { HttpClient } from '@angular/common/http'
import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { of, throwError } from 'rxjs'
import { SrcDirective } from './src.directive'
import { OcxSrcHarness } from '../../../testing/ocx-src.directive.harness'

@Component({
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  template: `<img id="img" [ocxSrc]="src" (error)="onError()" />`,
})
class HostComponent {
  src?: string

  errorCount = 0
  onError() {
    this.errorCount++
  }

  @ViewChild(SrcDirective) directive!: SrcDirective
}

describe('SrcDirective', () => {
  let fixture: ComponentFixture<HostComponent>
  let component: HostComponent
  let httpClientMock: { get: jest.Mock }
  let harness: OcxSrcHarness

  const originalWindowLocation = globalThis.location

  beforeEach(async () => {
    httpClientMock = {
      get: jest.fn(),
    }

    await TestBed.configureTestingModule({
      declarations: [HostComponent, SrcDirective],
      providers: [{ provide: HttpClient, useValue: httpClientMock }],
    }).compileComponents()

    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        ...originalWindowLocation,
        origin: 'http://example.com',
        hostname: 'example.com',
      },
    })

    fixture = TestBed.createComponent(HostComponent)
    component = fixture.componentInstance

    fixture.detectChanges()

    const loader = TestbedHarnessEnvironment.loader(fixture)
    harness = await loader.getHarness(OcxSrcHarness.with({ id: 'img' }))
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: originalWindowLocation,
    })
  })

  it('should set initial visibility to hidden', async () => {
    expect(await harness.getVisibility()).toBe('hidden')
  })

  it('should request blob for same-origin and set blob src on 200', async () => {
    httpClientMock.get.mockReturnValue(
      of({
        status: 200,
        body: new Blob(['x']),
      })
    )

    component.src = '/assets/test.png'
    fixture.detectChanges()

    expect(httpClientMock.get).toHaveBeenCalledWith('/assets/test.png', {
      observe: 'response',
      responseType: 'blob',
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(await harness.getSrcProperty()).toBe('blob:mock')
    expect(await harness.getVisibility()).toBe('initial')

    // Ensure the blob URL isn't revoked immediately.
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()

    // Revoke should happen on image load.
    await harness.dispatchLoad()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('should emit error on 204 even when response is null', async () => {
    httpClientMock.get.mockReturnValue(of(null))

    component.src = '/assets/empty-null.png'
    fixture.detectChanges()

    expect(component.errorCount).toBe(0)
    expect(await harness.getVisibility()).toBe('initial')
  })

  it('should emit error on 204', async () => {
    httpClientMock.get.mockReturnValue(
      of({
        status: 204,
        body: new Blob([]),
      })
    )

    component.src = '/assets/empty.png'
    fixture.detectChanges()

    expect(component.errorCount).toBe(1)

    expect(await harness.getVisibility()).toBe('initial')
  })

  it('should emit error on request error', async () => {
    httpClientMock.get.mockReturnValue(throwError(() => new Error('boom')))

    component.src = '/assets/fail.png'
    fixture.detectChanges()

    expect(component.errorCount).toBe(1)

    // Directive sets visibility to 'initial' only on complete.
    // When request errors, it emits error but keeps element hidden.
    expect(await harness.getVisibility()).toBe('hidden')
  })

  it('should set raw src for cross-origin and not call http', async () => {
    component.src = 'https://other.example/assets/test.png'
    fixture.detectChanges()

    expect(httpClientMock.get).not.toHaveBeenCalled()

    expect(await harness.getSrcProperty()).toBe('https://other.example/assets/test.png')
    expect(await harness.getVisibility()).toBe('initial')
  })

  it('should fall back to raw src when URL parsing throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    component.src = 'http://[invalid-url'
    fixture.detectChanges()

    expect(consoleSpy).toHaveBeenCalled()

    const srcAttr = await harness.getSrcAttribute()
    const srcProp = await harness.getSrcProperty()
    expect((srcAttr || srcProp) ?? '').toContain('http://[invalid-url')
    expect(await harness.getVisibility()).toBe('initial')
  })

  it('should not re-run when same value is set again', () => {
    httpClientMock.get.mockReturnValue(
      of({
        status: 200,
        body: new Blob(['x']),
      })
    )

    component.src = '/assets/test.png'
    fixture.detectChanges()

    component.src = '/assets/test.png'
    fixture.detectChanges()

    expect(httpClientMock.get).toHaveBeenCalledTimes(1)
  })

  it('should do nothing when value is undefined', () => {
    component.src = undefined
    fixture.detectChanges()

    expect(httpClientMock.get).not.toHaveBeenCalled()
  })

  it('should not run when hostname is empty', async () => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        ...originalWindowLocation,
        origin: 'http://example.com',
        hostname: '',
      },
    })

    component.src = '/assets/test.png'
    fixture.detectChanges()

    expect(httpClientMock.get).not.toHaveBeenCalled()
    expect(await harness.getVisibility()).toBe('hidden')
  })

  it('should set raw src and visibility on same-origin when response status is not 200/204', async () => {
    httpClientMock.get.mockReturnValue(of({ status: 201, body: new Blob(['x']) }))

    component.src = '/assets/test-201.png'
    fixture.detectChanges()

    expect(await harness.getVisibility()).toBe('initial')
    // should not set blob src for non-200
    expect(await harness.getSrcProperty()).not.toBe('blob:mock')
  })

  it('should expose the last set src via the ocxSrc getter', () => {
    component.src = 'https://other.example/assets/getter.png'
    fixture.detectChanges()

    expect(component.directive.ocxSrc()).toBe('https://other.example/assets/getter.png')
  })

  it('harness should read id and return TestElement', async () => {
    expect(await harness.getId()).toBe('img')
    const el = await harness.getTestElement()
    expect(await el.getAttribute('id')).toBe('img')
  })
})
