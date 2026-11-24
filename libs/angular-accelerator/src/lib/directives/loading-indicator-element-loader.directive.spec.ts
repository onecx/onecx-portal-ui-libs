import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { LoadingIndicatorDirective } from './loading-indicator.directive'

@Component({
  selector: 'ocx-test-element-size',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div [ocxLoadingIndicator]="isLoading" [overlayFullPage]="false" [isLoaderSmall]="isSmall">Content</div>
  `,
})
class TestElementSizeComponent {
  isLoading = false
  isSmall = true
}

describe('LoadingIndicatorDirective element loader', () => {
  let fixture: ComponentFixture<TestElementSizeComponent>
  let nativeElement: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingIndicatorDirective, TestElementSizeComponent],
    })
    fixture = TestBed.createComponent(TestElementSizeComponent)
    nativeElement = fixture.debugElement.query(By.directive(LoadingIndicatorDirective)).nativeElement
  })

  it('given the element loader is shown while loading, when isLoaderSmall changes, then exactly one loader exists with the matching size', () => {
    fixture.componentInstance.isLoading = true
    fixture.detectChanges()

    fixture.componentInstance.isSmall = false
    fixture.detectChanges()

    const loaders = nativeElement.querySelectorAll('.loader')
    expect(loaders.length).toBe(1)
    expect(loaders[0].classList.contains('loader-small')).toBe(false)
  })

  it('given the element loader is shown while loading, when isLoaderSmall changes to small, then exactly one small loader exists', () => {
    fixture.componentInstance.isLoading = true
    fixture.componentInstance.isSmall = false
    fixture.detectChanges()

    fixture.componentInstance.isSmall = true
    fixture.detectChanges()

    const loaders = nativeElement.querySelectorAll('.loader')
    expect(loaders.length).toBe(1)
    expect(loaders[0].classList.contains('loader-small')).toBe(true)
  })

  it('given the element loader is shown after isLoaderSmall changed, when loading stops, then no loader and no element-overlay class remain', () => {
    fixture.componentInstance.isLoading = true
    fixture.detectChanges()

    fixture.componentInstance.isSmall = false
    fixture.detectChanges()

    fixture.componentInstance.isLoading = false
    fixture.detectChanges()

    expect(nativeElement.querySelector('.loader')).toBeNull()
    expect(nativeElement.classList.contains('element-overlay')).toBe(false)
  })
})
