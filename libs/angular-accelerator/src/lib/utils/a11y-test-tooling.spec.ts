import { expectNoAxeViolations } from '@onecx/angular-testing'
import userEvent from '@testing-library/user-event'

/**
 * Smoke tests for the a11y test tooling on the happy-dom environment used by this library.
 * Verifies that `@testing-library/user-event` is available and performs the native activation behavior
 * (Enter/Space on a focused button dispatches a click), which `dispatchEvent(new KeyboardEvent(...))` does not.
 */
describe('user-event keyboard interaction', () => {
  let button: HTMLButtonElement
  let onClick: jest.Mock

  beforeEach(() => {
    onClick = jest.fn()
    button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Save'
    button.addEventListener('click', onClick)
    document.body.appendChild(button)
  })

  afterEach(() => button.remove())

  it('clicks a button on Enter', async () => {
    const user = userEvent.setup()
    button.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('clicks a button on Space', async () => {
    const user = userEvent.setup()
    button.focus()
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not click when a synthetic KeyboardEvent is dispatched', () => {
    button.focus()
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('expectNoAxeViolations (happy-dom)', () => {
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

  it('accepts a known violation on the allow-list', async () => {
    container.innerHTML = '<button type="button"></button>'
    await expectNoAxeViolations(container, { allow: ['button-name'] })
  })

  it('fails for a stale allow-list entry', async () => {
    container.innerHTML = '<button type="button">Save</button>'
    await expect(expectNoAxeViolations(container, { allow: ['button-name'] })).rejects.toThrow(/no longer produce/)
  })
})
