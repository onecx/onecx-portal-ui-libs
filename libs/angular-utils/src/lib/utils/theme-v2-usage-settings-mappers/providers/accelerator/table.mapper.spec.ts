import { acceleratorTableSettingsMapper, mapAcceleratorTableSettings } from './table.mapper'

describe('mapAcceleratorTableSettings', () => {
  it('should map table usage settings to accelerator table input defaults', () => {
    expect(
      mapAcceleratorTableSettings({
        actionColumnSticky: true,
        actionColumnPosition: 'start',
      })
    ).toEqual({
      frozenActionColumn: true,
      actionColumnPosition: 'left',
    })
  })

  it('should ignore unresolved or incompatible values', () => {
    expect(
      mapAcceleratorTableSettings({
        actionColumnSticky: '{{primitives.boolean}}',
        actionColumnPosition: '{{primitives.position}}',
      } as never)
    ).toEqual({
      frozenActionColumn: undefined,
      actionColumnPosition: undefined,
    })
  })

  it('should expose the same mapper through the provider registry alias', () => {
    expect(acceleratorTableSettingsMapper).toBe(mapAcceleratorTableSettings)
  })
})