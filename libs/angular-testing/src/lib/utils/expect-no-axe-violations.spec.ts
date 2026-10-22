import { expectNoAxeViolations } from './expect-no-axe-violations'

describe('expectNoAxeViolations', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => container.remove())

  it('passes for accessible markup', async () => {
    container.innerHTML = '<button type="button">Save</button>'
    await expectNoAxeViolations(container)
  })

  it('fails for a button without an accessible name', async () => {
    container.innerHTML = '<button type="button"></button>'
    await expect(expectNoAxeViolations(container)).rejects.toThrow(/button-name/)
  })

  it('ignores rules on the allow-list', async () => {
    container.innerHTML = '<button type="button"></button>'
    await expectNoAxeViolations(container, { allow: ['button-name'] })
  })

  it('still fails for other rules when one rule is allowed', async () => {
    container.innerHTML = '<button type="button"></button><input type="text" />'
    await expect(expectNoAxeViolations(container, { allow: ['button-name'] })).rejects.toThrow(/label/)
  })

  it('fails when an allow-list entry is stale', async () => {
    container.innerHTML = '<button type="button">Save</button>'
    await expect(expectNoAxeViolations(container, { allow: ['button-name'] })).rejects.toThrow(/no longer produce/)
  })
})
