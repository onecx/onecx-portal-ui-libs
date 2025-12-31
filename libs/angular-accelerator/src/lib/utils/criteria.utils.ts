import { QueryList } from '@angular/core'
import { getUTCDateWithoutTimezoneIssues, isValidDate } from '@onecx/accelerator'
import { DatePicker } from 'primeng/datepicker'

export type hasShowTimeFunction = (key: string) => boolean
/**
 * removeNullValues: whether to remove entries from the search criteria where the value is null
 */
export interface BuildSearchCriteriaParameters {
  removeNullValues: boolean
}

function _hasShowTime(datePickers: QueryList<DatePicker>, formKey: string): boolean {
  return (
    datePickers.find((d) => {
      return d.name() === formKey
    })?.showTime === true
  )
}

/**
 * Safely builds the search criteria based on form values
 * @param formRawValue the raw value of the form to use
 * @param datePickers a list of primeng datePickers of the form (use `@ViewChildren(DatePicker) datePickers!: QueryList<DatePicker>;`)
 * @param parameters {@link BuildSearchCriteriaParameters}  to use when building the search criteria
 * @returns the search criteria as a partial of T (T = type of the search criteria)
 */
export function buildSearchCriteria<T>(
  formRawValue: any,
  datePickers: QueryList<DatePicker>,
  { removeNullValues = false }: BuildSearchCriteriaParameters
) {
  return Object.entries(formRawValue).reduce((acc: Partial<T>, [key, value]) => {
    if (value == null && removeNullValues) {
      return acc
    }
    if (isValidDate(value) && !_hasShowTime(datePickers, key)) {
      value = getUTCDateWithoutTimezoneIssues(value)
    }
    return {
      ...acc,
      [key]: value,
    }
  }, {})
}
