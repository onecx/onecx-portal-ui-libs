/**
 * Recursively removes all values from an object, array, or string that contain a specific reference string.
 * - Strings containing the reference are removed.
 * - Arrays are filtered to exclude elements with the reference.
 * - Objects are deeply traversed and cleaned of any values containing the reference.
 *
 * @param obj - The input object, array, or string to process.
 * @param reference - The reference string to remove.
 * @returns A new object, array, or string with all matching references removed.
 */
export function removeReferences(obj: any, reference: string): any {
  if (typeof obj === 'string') {
    return obj.includes(reference) ? undefined : obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeReferences(item, reference)).filter((item) => item !== undefined)
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {}
    for (const key in obj) {
      const value = removeReferences(obj[key], reference)
      if (value !== undefined) {
        newObj[key] = value
      }
    }
    return newObj
  }

  // return type is always object (modified source object with removed reference)
  return obj
}
