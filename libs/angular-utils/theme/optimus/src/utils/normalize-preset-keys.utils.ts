import { isObject } from '@onecx/angular-utils'

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/styled/src/config/index.ts#L9
const excludedKeyRegex =
  /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i

// taken from primeng https://github.com/primefaces/primeuix/blob/main/packages/utils/src/object/methods/matchRegex.ts
function matchRegex(str: string, regex?: RegExp): boolean {
  if (regex) {
    const match = regex.test(str)

    regex.lastIndex = 0

    return match
  }
  return false
}

/**
 * Splits a camelCase string into an array of lowercase segments.
 * For example, "hoverColor" becomes ["hover", "color"].
 *
 * @param key - The camelCase string to split.
 * @returns An array of lowercase segments.
 */
function splitCamelCase(key: string): string[] {
  return key
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .toLowerCase()
    .split('.')
}

/**
 * Recursively normalizes the keys of an object by converting camelCase keys into nested objects.
 * Keys matching an excluded pattern are preserved as-is.
 * Non-object values are returned unchanged.
 *
 * @param obj - The input object to normalize.
 * @returns A new object with normalized (nested) keys.
 */
export function normalizeKeys(obj: any): Record<string, any> {
  if (!isObject(obj)) return obj

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    processKey(result, key, value)
  }

  return result
}

/**
 * Processes a key-value pair by normalizing its value and inserting it into a nested object structure.
 * If the key matches an excluded pattern, it is added to the result as-is.
 * Otherwise, the camelCase key is split into segments and the value is inserted accordingly.
 *
 * @param result - The object to insert the processed key-value pair into.
 * @param key - The key to process, potentially in camelCase.
 * @param value - The value associated with the key, which may be recursively normalized.
 */
function processKey(result: Record<string, any>, key: string, value: any) {
  const normalizedValue = normalizeKeys(value)

  if (matchRegex(key, excludedKeyRegex)) {
    result[key] = normalizedValue
    return
  }

  const decomposedKey = splitCamelCase(key)
  insertNestedValue(result, decomposedKey, normalizedValue)
}

/**
 * Inserts a value into a nested object structure based on a path of key segments.
 * Creates intermediate objects as needed to ensure the full path exists.
 *
 * @param result - The object to insert the value into.
 * @param path - An array of strings representing the nested key path (e.g., ['item', 'hover', 'color']).
 * @param value - The value to assign at the final path segment.
 *
 * @example
 * const obj = {}
 * insertNestedValue(obj, ['item,', 'hover', 'color'], '#ff0000')
 * Result: { item: { hover: { color: '#ff0000' } } }
 */
function insertNestedValue(result: Record<string, any>, decomposedKey: string[], value: any) {
  let current = result

  decomposedKey.forEach((segment, index) => {
    const isLast = index === decomposedKey.length - 1

    if (isLast) {
      // If it's the last segment, assign the value directly: { key: value }
      current[segment] = value
    } else {
      // If the segment does not exist, create an empty object: { key: {} }
      current[segment] ??= {}
      // Move to the next level in the nested structure: {}
      current = current[segment]
    }
  })
}
