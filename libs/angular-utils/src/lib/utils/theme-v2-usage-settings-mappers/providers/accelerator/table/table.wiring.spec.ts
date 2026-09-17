import { TestBed } from '@angular/core/testing'
import { ThemeService } from '@onecx/angular-integration-interface'
import { CurrentThemes } from '@onecx/integration-interface'
import { themeVersionAvailable } from '../../../../theme-version-available.utils'
import { BehaviorSubject } from 'rxjs'

import { useAcceleratorTableThemeDefaults } from './table.wiring'

jest.mock('../../../../theme-version-available.utils', () => ({
  themeVersionAvailable: jest.fn(),
}))

const themeVersionAvailableMock = jest.mocked(themeVersionAvailable)

describe('useAcceleratorTableThemeDefaults', () => {
  let currentThemes$!: BehaviorSubject<CurrentThemes>

  const publishTheme = (settings: Record<string, unknown>) =>
    currentThemes$.next({
      properties: {
        v2: {
          usages: {
            table: { settings },
          },
        },
      },
    } as CurrentThemes)

  const call = () => TestBed.runInInjectionContext(() => useAcceleratorTableThemeDefaults())

  beforeEach(() => {
    // Theme V2 unavailable by default -> no signal is ever set (stays undefined).
    themeVersionAvailableMock.mockResolvedValue(false)
    currentThemes$ = new BehaviorSubject<CurrentThemes>({} as CurrentThemes)

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ThemeService,
          useValue: { currentThemes$ },
        },
      ],
    })
  })

  it('leaves signals undefined when ThemeService is not provided', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      providers: [{ provide: ThemeService, useValue: null }],
    })
    const { checkboxColumnPositionThemeSetting, frozenActionColumnThemeSetting, actionColumnPositionThemeSetting } =
      call()

    expect(checkboxColumnPositionThemeSetting()).toBeUndefined()
    expect(frozenActionColumnThemeSetting()).toBeUndefined()
    expect(actionColumnPositionThemeSetting()).toBeUndefined()
  })

  it('does not apply any settings while theme V2 is unavailable', async () => {
    const result = call()
    publishTheme({ actionColumnSticky: true, actionColumnPosition: 'start', checkboxColumnPosition: 'end' })
    await flush()

    expect(result.frozenActionColumnThemeSetting()).toBeUndefined()
    expect(result.actionColumnPositionThemeSetting()).toBeUndefined()
    expect(result.checkboxColumnPositionThemeSetting()).toBeUndefined()
  })

  it('applies mapped table settings once theme V2 becomes available', async () => {
    themeVersionAvailableMock.mockResolvedValue(true)
    const result = call()
    publishTheme({ actionColumnSticky: true, actionColumnPosition: 'start', checkboxColumnPosition: 'end' })
    await flush()

    expect(result.frozenActionColumnThemeSetting()).toBe(true)
    expect(result.actionColumnPositionThemeSetting()).toBe('left')
    expect(result.checkboxColumnPositionThemeSetting()).toBe('right')
  })

  it('maps start/end to left/right and treats missing keys as undefined', async () => {
    themeVersionAvailableMock.mockResolvedValue(true)
    const result = call()
    publishTheme({ actionColumnSticky: false, actionColumnPosition: 'end' })
    await flush()

    expect(result.frozenActionColumnThemeSetting()).toBe(false)
    expect(result.actionColumnPositionThemeSetting()).toBe('right')
    expect(result.checkboxColumnPositionThemeSetting()).toBeUndefined()
  })

  it('ignores an older theme when its availability check resolves last', async () => {
    let resolveOlder!: (available: boolean) => void
    let resolveNewer!: (available: boolean) => void
    const older = new Promise<boolean>((r) => (resolveOlder = r))
    const newer = new Promise<boolean>((r) => (resolveNewer = r))
    themeVersionAvailableMock
      .mockReturnValueOnce(older)
      .mockReturnValueOnce(newer)

    // Publish the first theme before subscribing so the subscribe emits it as the first check;
    // the second publish then becomes the second (switchMap-cancelling) check.
    publishTheme({ actionColumnSticky: true, actionColumnPosition: 'start' })
    const result = call()
    publishTheme({ actionColumnSticky: false, actionColumnPosition: 'end' })

    resolveNewer(true)
    await flush()
    expect(result.frozenActionColumnThemeSetting()).toBe(false)
    expect(result.actionColumnPositionThemeSetting()).toBe('right')

    resolveOlder(true)
    await flush()
    expect(result.frozenActionColumnThemeSetting()).toBe(false)
    expect(result.actionColumnPositionThemeSetting()).toBe('right')
  })
})

async function flush(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
  }
}
