import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OcxSkeletonComponent } from './skeleton.component'

describe('OcxSkeletonComponent', () => {
  let component: OcxSkeletonComponent
  let fixture: ComponentFixture<OcxSkeletonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OcxSkeletonComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(OcxSkeletonComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should default to a 100% wide, 1rem tall, animated rectangle', () => {
    fixture.detectChanges()
    const host: HTMLElement = fixture.nativeElement

    expect(component.width).toEqual('100%')
    expect(component.height).toEqual('1rem')
    expect(component.shape).toEqual('rectangle')
    expect(component.animated).toEqual(true)
    expect(host.style.width).toEqual('100%')
    expect(host.style.height).toEqual('1rem')
    expect(host.classList.contains('ocx-skeleton-circle')).toEqual(false)
    expect(host.classList.contains('ocx-skeleton-animated')).toEqual(true)
  })

  it('should apply width, height and borderRadius inputs to the host element', () => {
    component.width = '3rem'
    component.height = '2rem'
    component.borderRadius = '8px'
    fixture.detectChanges()
    const host: HTMLElement = fixture.nativeElement

    expect(host.style.width).toEqual('3rem')
    expect(host.style.height).toEqual('2rem')
    expect(host.style.borderRadius).toEqual('8px')
  })

  it('should apply the circle class when shape is set to circle', () => {
    component.shape = 'circle'
    fixture.detectChanges()
    const host: HTMLElement = fixture.nativeElement

    expect(host.classList.contains('ocx-skeleton-circle')).toEqual(true)
  })

  it('should not apply the animated class when animated is set to false', () => {
    component.animated = false
    fixture.detectChanges()
    const host: HTMLElement = fixture.nativeElement

    expect(host.classList.contains('ocx-skeleton-animated')).toEqual(false)
  })

  it('should mark the host as aria-hidden', () => {
    fixture.detectChanges()
    const host: HTMLElement = fixture.nativeElement

    expect(host.getAttribute('aria-hidden')).toEqual('true')
  })
})
