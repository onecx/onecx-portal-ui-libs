import { isObject } from './deep-merge.utils'

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
 * Normalizes keys in an object by splitting camelCase keys into nested objects.
 * It also excludes certain keys based on a regex pattern.
 *
 * @param obj - The object to normalize.
 * @returns A new object with normalized keys.
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
 * Processes a key-value pair and if the key is excluded, skip it and continue with its children.
 * Otherwise, it splits the key into segments and inserts the value into the result object.
 *
 * @param result - The result object to insert into.
 * @param key - The key to process.
 * @param value - The value associated with the key.
 */
function processKey(result: Record<string, any>, key: string, value: any) {
  if (matchRegex(key, excludedKeyRegex)) {
    result[key] = normalizeKeys(value)
    return
  }

  const decomposedKey = splitCamelCase(key)
  insertValue(result, decomposedKey, value)
}

/**
 * Inserts a value into a nested object structure based on the decomposed key segments.
 * If the segment is the last one, it assigns the value directly; otherwise, it creates
 * nested objects as needed.
 *
 * @param result - The result object to insert into.
 * @param decomposedKey - An array of segments representing the key.
 * @param value - The value to insert.
 */
function insertValue(result: Record<string, any>, decomposedKey: string[], value: any) {
  let current = result

  for (let i = 0; i < decomposedKey.length; i++) {
    const segment = decomposedKey[i]

    if (i === decomposedKey.length - 1) {
      current[segment] = value
    } else {
      current[segment] = current[segment] ?? {}
      current = current[segment]
    }
  }
}
