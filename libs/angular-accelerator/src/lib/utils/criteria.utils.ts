import { QueryList } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { isValidDate } from '@onecx/accelerator'
import { Calendar } from 'primeng/calendar'

export type hasShowTimeFunction = (key: string) => boolean
/**
 * removeNullValues: whether to remove entries from the search criteria where the value is null
 */
export interface BuildSearchCriteriaParameters {
  removeNullValues: boolean
}

function _hasShowTime(calendars: QueryList<Calendar>, formKey: string): boolean {
  return (
    calendars.find((c) => {
      return c.name === formKey
    })?.showTime === true
  )
}

/**
 * Safely builds the search criteria based on form values
 * @param formValues the form values to use
 * @param calendars a list of calendars of the form (use `@ViewChildren(Calendar) calendars!: QueryList<Calendar>;`)
 * @param parameters {@link BuildSearchCriteriaParameters}  to use when building the search criteria
 * @returns the search criteria as partial of T (T should be your search criteria type)
 */
export function buildSearchCriteria<T>(
  formValues: FormGroup<any>,
  calendars: QueryList<Calendar>,
  { removeNullValues = false }: BuildSearchCriteriaParameters
) {
  return Object.entries(formValues).reduce((acc: Partial<T>, [key, value]) => {
    if (value == null && removeNullValues) {
      return acc
    }
    if (isValidDate(value) && !_hasShowTime(calendars, key)) {
      value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0))
    }
    return {
      ...acc,
      [key]: value,
    }
  }, {})
}
