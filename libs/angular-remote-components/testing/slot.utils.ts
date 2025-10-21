/**
 * Represents the different types of class inputs supported by Angular components.
 */
export type ClassInput = string | string[] | Set<string> | { [key: string]: any }

/**
 * Normalizes different class input types into a string array.
 * Handles string (space-separated), string[], Set<string>, and object formats.
 * @param classes The classes input in any supported format.
 * @returns Array of class names.
 */
export function normalizeClasses(classes: ClassInput): string[] {
  if (typeof classes === 'string') {
    return classes.trim() === '' ? [] : classes.trim().split(/\s+/)
  }

  if (Array.isArray(classes)) {
    return classes
  }

  if (classes instanceof Set) {
    return Array.from(classes)
  }

  if (typeof classes === 'object' && classes !== null) {
    return Object.entries(classes)
      .filter(([_, value]) => Boolean(value))
      .map(([key, _]) => key)
  }

  return []
}
