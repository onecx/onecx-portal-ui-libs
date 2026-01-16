import { FormControl, FormGroup } from '@angular/forms'

import { atLeastOneFieldFilledValidator } from './at-least-one-field-filled-validator'

describe('atLeastOneFieldFilledValidator', () => {
  it('returns error when all fields are null/undefined/empty string', () => {
    const form = new FormGroup({
      a: new FormControl(null),
      b: new FormControl(undefined),
      c: new FormControl(''),
    })

    expect(atLeastOneFieldFilledValidator(form)).toEqual({ allFieldsEmpty: true })
  })

  it('returns null when at least one field is a non-empty string', () => {
    const form = new FormGroup({
      a: new FormControl(''),
      b: new FormControl('x'),
      c: new FormControl(null),
    })

    expect(atLeastOneFieldFilledValidator(form)).toBeNull()
  })

  it('returns null when at least one field is 0', () => {
    const form = new FormGroup({
      a: new FormControl(''),
      b: new FormControl(0),
    })

    expect(atLeastOneFieldFilledValidator(form)).toBeNull()
  })

  it('returns null when at least one field is false', () => {
    const form = new FormGroup({
      a: new FormControl(''),
      b: new FormControl(false),
    })

    expect(atLeastOneFieldFilledValidator(form)).toBeNull()
  })
})
