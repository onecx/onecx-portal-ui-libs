export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any)
}

/**
 * This function removes time info from a JS DateTime Object and returns
 * the local date as a correct UTC Date
 * @param date a date-time Date object
 * @returns the date without time / timezone issues
 */
export function getUTCDateWithoutTimezoneIssues(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
}
