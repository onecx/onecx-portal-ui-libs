import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Carousel, CarouselModule } from 'primeng/carousel'
import { ThemePropertiesV2 } from '@onecx/integration-interface'
import { CarouselComponentSettingsService } from './carousel-component-settings.service'

describe('CarouselComponentSettingsService', () => {
  it('should apply carousel settings to real PrimeNG carousel instances', () => {
    TestBed.configureTestingModule({
      imports: [CarouselModule],
    })
    // Construct the service first so the Carousel prototype is patched before any instance is
    // created; instances created afterwards register themselves through the patched lifecycle.
    const service = new CarouselComponentSettingsService()

    const fixture = TestBed.createComponent(CarouselHostComponent)
    fixture.detectChanges()

    service.applyThemeProperties({
      usages: {
        carousel: {
          settings: {
            orientation: 'vertical',
            showIndicators: false,
            showNavigators: false,
            circular: true,
            autoplayInterval: 2500,
          },
        },
      },
    } as unknown as ThemePropertiesV2)

    fixture.detectChanges()

    const carousel = fixture.debugElement.query(By.directive(Carousel)).componentInstance as Carousel
    expect(carousel.orientation).toBe('vertical')
    expect(carousel.showIndicators).toBe(false)
    expect(carousel.showNavigators).toBe(false)
    expect(carousel.circular).toBe(true)
    expect(carousel.autoplayInterval).toBe(2500)
  })
})

@Component({
  standalone: true,
  imports: [CarouselModule],
  template: '<p-carousel [value]="items"></p-carousel>',
})
class CarouselHostComponent {
  items = [{ id: 1 }, { id: 2 }]
}
