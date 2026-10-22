import userEvent from '@testing-library/user-event'

/**
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
