import { AfterContentInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PrimeNgComponentSettingsRuntime } from './component-settings-runtime.utils'

interface TestDefaults {
  themed: string
  explicit: string
}

describe('PrimeNgComponentSettingsRuntime', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('should apply initial defaults, preserve lifecycle hooks, and stop updating after teardown', async () => {
    const onChanges = jest.fn()
    const onAfterContentInit = jest.fn()
    const onDestroy = jest.fn()
    const refreshInstance = jest.fn()
    let defaults: Partial<TestDefaults> = { themed: 'initial-theme', explicit: 'theme-explicit' }

    @Component({
      selector: 'ocx-test-component',
      standalone: true,
      template: '',
    })
    class TestComponent implements OnChanges, AfterContentInit, OnDestroy {
      @Input() themed = 'component-default'
      @Input() explicit = 'component-default'

      ngOnChanges(changes: SimpleChanges): void {
        onChanges(changes)
      }

      ngAfterContentInit(): void {
        onAfterContentInit()
      }

      ngOnDestroy(): void {
        onDestroy()
      }
    }

    @Component({
      standalone: true,
      imports: [TestComponent],
      template: '<ocx-test-component explicit="provided" />',
    })
    class HostComponent {}

    const runtime = new PrimeNgComponentSettingsRuntime<TestComponent, TestDefaults>({
      componentType: TestComponent,
      trackedKeys: ['themed', 'explicit'],
      resolveDefaults: () => defaults,
      refreshInstance,
    })
    runtime.applyThemeProperties({})

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents()
    const fixture: ComponentFixture<HostComponent> = TestBed.createComponent(HostComponent)
    fixture.detectChanges()

    const instance = fixture.debugElement.children[0].componentInstance as TestComponent
    expect(instance.themed).toBe('initial-theme')
    expect(instance.explicit).toBe('provided')
    expect(onChanges).toHaveBeenCalledTimes(1)
    expect(onAfterContentInit).toHaveBeenCalledTimes(1)

    defaults = { themed: 'updated-theme', explicit: 'updated-explicit' }
    runtime.applyThemeProperties({})
    expect(instance.themed).toBe('updated-theme')
    expect(instance.explicit).toBe('provided')
    expect(refreshInstance).toHaveBeenCalledTimes(1)

    fixture.destroy()
    expect(onDestroy).toHaveBeenCalledTimes(1)

    defaults = { themed: 'theme-after-destroy' }
    runtime.applyThemeProperties({})
    expect(instance.themed).toBe('updated-theme')
    expect(refreshInstance).toHaveBeenCalledTimes(1)
  })

  it('should warn once when the component prototype does not follow the BaseComponent hook convention', () => {
    class BrokenComponent {
      ngOnChanges(): void {
        // PrimeNG base-class hook present, but no onAfterContentInit delegate.
      }
    }

    new PrimeNgComponentSettingsRuntime<BrokenComponent, TestDefaults>({
      componentType: BrokenComponent,
      trackedKeys: ['themed', 'explicit'],
      resolveDefaults: () => ({ themed: 'a', explicit: 'b' }),
      refreshInstance: () => undefined,
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('BrokenComponent')
  })

  it('should not warn when the component defines the onAfterContentInit hook', () => {
    class HookedComponent {
      onAfterContentInit(): void {
        // Declaring the PrimeNG hook signals the convention applies.
      }
    }

    new PrimeNgComponentSettingsRuntime<HookedComponent, TestDefaults>({
      componentType: HookedComponent,
      trackedKeys: ['themed', 'explicit'],
      resolveDefaults: () => ({ themed: 'a', explicit: 'b' }),
      refreshInstance: () => undefined,
    })

    expect(warnSpy).not.toHaveBeenCalled()
  })
})