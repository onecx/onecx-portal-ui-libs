import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'

export const atLeastOneFieldFilledValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  if (Object.values(form.value).every((x) => x === null || x === undefined || x === '')) {
    return { allFieldsEmpty: true }
  }
  return null
}
