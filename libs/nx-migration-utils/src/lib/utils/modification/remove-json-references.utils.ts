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
