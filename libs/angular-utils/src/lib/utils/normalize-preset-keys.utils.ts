import { isObject } from './deep-merge.utils'

const excludedKeyRegex =
  /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/i

function matchRegex(str: string, regex?: RegExp): boolean {
  if (regex) {
    const match = regex.test(str)

    regex.lastIndex = 0

    return match
  }
  return false
}

function splitCamelCase(key: string): string[] {
  return key
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .toLowerCase()
    .split('.')
}

export function normalizeKeys(obj: any, path: string[] = []): Record<string, any> {
  if (!isObject(obj)) return obj

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const isExcluded = matchRegex(key, excludedKeyRegex)

    if (isExcluded) {
      result[key] = normalizeKeys(value, [])
      continue
    }

    const decomposedKey = splitCamelCase(key)
    const fullPath = [...path, ...decomposedKey]

    let current = result

    for (let i = 0; i < fullPath.length; i++) {
      const segment = fullPath[i]

      if (i === fullPath.length - 1) {
        current[segment] = normalizeKeys(value, [])
      } else {
        current[segment] = current[segment] ?? {}
        current = current[segment]
      }
    }
  }

  return result
}
