import { primeReactStyleReusePlugin } from './primeReactStyleReusePlugin'

const SAMPLE_CODE = `
var existingStyle = styleContainer.querySelector('style[data-primereact-style-id="'.concat(name, '"]'));
styleRef.current.setAttribute('data-primereact-style-id', name);
`

const DOUBLE_QUOTED_SAMPLE_CODE =
  'var existingStyle = styleContainer.querySelector("style[data-primereact-style-id=\\"".concat(name, "\\"]"));'

describe('primeReactStyleReusePlugin', () => {
  it('patches PrimeReact lookup and style-id assignment with app-specific id', () => {
    const plugin = primeReactStyleReusePlugin({ appId: 'demo|app' })
    const transform = plugin.transform as (code: string, id: string) => { code: string; map: null } | null

    const result = transform(SAMPLE_CODE, '/workspace/node_modules/primereact/core/core.js')

    expect(result).not.toBeNull()
    expect(result?.code).toContain(`querySelector('style[data-primereact-style-id="'.concat(name,'-demo|app"]'))`)
    expect(result?.code).toContain(`setAttribute('data-primereact-style-id', "".concat(name, "-demo|app"))`)
  })

  it('does not patch files outside PrimeReact', () => {
    const plugin = primeReactStyleReusePlugin({ appId: 'demo|app' })
    const transform = plugin.transform as (code: string, id: string) => { code: string; map: null } | null

    const result = transform(SAMPLE_CODE, '/workspace/src/App.tsx')

    expect(result).toBeNull()
  })

  it('patches double-quoted PrimeReact selector variant', () => {
    const plugin = primeReactStyleReusePlugin({ appId: 'demo|app' })
    const transform = plugin.transform as (code: string, id: string) => { code: string; map: null } | null

    const result = transform(DOUBLE_QUOTED_SAMPLE_CODE, '/workspace/node_modules/primereact/core/core.js')

    expect(result).not.toBeNull()
    expect(result?.code).toContain('querySelector("style[data-primereact-style-id=\\"".concat(name, "-demo|app\\"]"))')
  })

  it('warns once and disables patching when appId is empty', () => {
    const warn = jest.fn()
    const plugin = primeReactStyleReusePlugin({ appId: '   ', warn })
    const transform = plugin.transform as (code: string, id: string) => { code: string; map: null } | null

    expect(transform(SAMPLE_CODE, '/workspace/node_modules/primereact/core/core.js')).toBeNull()
    expect(transform(SAMPLE_CODE, '/workspace/node_modules/primereact/hooks/hooks.js')).toBeNull()

    expect(warn).toHaveBeenCalledTimes(1)
  })
})
