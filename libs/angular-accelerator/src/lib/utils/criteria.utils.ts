import { QueryList } from '@angular/core'
import { getUTCDateWithoutTimezoneIssues, isValidDate } from '@onecx/accelerator'
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
 * @param formRawValue the raw value of the form to use
 * @param calendars a list of primeng calendars of the form (use `@ViewChildren(Calendar) calendars!: QueryList<Calendar>;`)
 * @param parameters {@link BuildSearchCriteriaParameters}  to use when building the search criteria
 * @returns the search criteria as a partial of T (T = type of the search criteria)
 */
export function buildSearchCriteria<T>(
  formRawValue: any,
  calendars: QueryList<Calendar>,
  { removeNullValues = false }: BuildSearchCriteriaParameters
) {
  return Object.entries(formRawValue).reduce((acc: Partial<T>, [key, value]) => {
    if (value == null && removeNullValues) {
      return acc
    }
    if (isValidDate(value) && !_hasShowTime(calendars, key)) {
      value = getUTCDateWithoutTimezoneIssues(value)
    }
    return {
      ...acc,
      [key]: value,
    }
  }, {})
}
