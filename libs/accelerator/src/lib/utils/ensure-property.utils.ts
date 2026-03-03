type PathKeys<T, Depth extends number = 5> = [Depth] extends [never]
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? T[K] extends object | undefined
        ? `${K}` | `${K}.${PathKeys<NonNullable<T[K]>, Prev[Depth]>}`
        : `${K}`
        : never
    }[keyof T]
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

type PathToTuple<S extends string> =
    S extends `${infer First}.${infer Rest}`
    ? [First, ...PathToTuple<Rest>]
    : [S];

type ValidPaths<T> = PathKeys<T> extends infer P
    ? P extends string
    ? PathToTuple<P>
    : never
    : never;

type SetPathTuple<T, Path extends ReadonlyArray<string | number>, Value> =
    Path extends readonly [infer Key, ...infer Rest]
    ? Key extends string | number
    ? Rest extends ReadonlyArray<string | number>
    ? Rest['length'] extends 0
    ? T & { [K in Key]: Value }
    : {
        [K in keyof T | Key]-?: K extends Key
        ? K extends keyof T
        ? SetPathTuple<NonNullable<T[K]>, Rest, Value>
        : SetPathTuple<object, Rest, Value>
        : K extends keyof T
        ? T[K]
        : never
    }
    : never
    : never
    : never;

/**
 * Ensures that a property exists at the specified path within an object.
 * Creates intermediate objects as needed and sets the final property to the initial value
 * only if the property is currently null or undefined.
 *
 * This function is useful for safely initializing deeply nested properties without worrying
 * about intermediate objects being missing. It will not overwrite existing values - only
 * null or undefined values are replaced.
 *
 * **Returns the typed object** - you should use the return value to access the properties
 * with full type safety.
 *
 * Supports property names with special characters that can only be accessed via bracket notation.
 *
 * @template T - The object type
 * @template Path - The path as a tuple of keys
 * @template Value - The type of the value to set
 * @param obj - The object to modify
 * @param path - An array representing the path to the property (e.g., ['user', 'profile', 'name'])
 * @param initialValue - The value to set if the property is currently null or undefined
 * @returns The same object with updated type information including the new property
 *
 * @example
 * // Recommended: Use the return value for full type safety
 * const g = ensureProperty(globalThis, ['myApp', 'config', 'debug'], false);
 * if (g.myApp.config.debug) {
 *   console.log('Debug mode enabled');
 * }
 *
 * @example
 * // For regular property names (no special chars), both ways work:
 * // 1. Using return value (recommended for consistency)
 * let config = {};
 * config = ensureProperty(config, ['database', 'host'], 'localhost');
 * console.log(config.database.host); // TypeScript knows about this
 *
 * // 2. Without using return value (works for non-special chars)
 * const settings = {};
 * ensureProperty(settings, ['server', 'port'], 3000);
 * console.log(settings.server.port); // Also works, but less type-safe
 *
 * @example
 * // For globalThis with regular names, you can declare it globally:
 * declare global {
 *   var myApp: { config: { debug: boolean } };
 * }
 * ensureProperty(globalThis, ['myApp', 'config', 'debug'], false);
 * if (globalThis.myApp.config.debug) { // Works without using return value
 *   console.log('Debug enabled');
 * }
 *
 * @example
 * // For special characters, MUST use return value:
 * const g = ensureProperty(globalThis, ['@onecx/accelerator', 'version'], '1.0.0');
 * console.log(g['@onecx/accelerator'].version); // TypeScript knows this exists
 * // globalThis['@onecx/accelerator'].version won't work without the return value
 *
 * @example
 * // Won't overwrite existing values
 * let obj = { name: 'John' };
 * obj = ensureProperty(obj, ['name'], 'Jane');
 * console.log(obj.name); // Still 'John'
 *
 * @example
 * // Replaces null values
 * let obj = { name: null };
 * obj = ensureProperty(obj, ['name'], 'Default');
 * console.log(obj.name); // Now 'Default'
 *
 * @example
 * // Nested paths with special characters
 * const g = ensureProperty(globalThis, ['@myapp/config', 'feature-flags', 'enabled'], true);
 * console.log(g['@myapp/config']['feature-flags'].enabled);
 */
export function ensureProperty<
    const Path extends ReadonlyArray<string | number>,
    Value
>(
    obj: typeof globalThis,
    path: Path,
    initialValue: Value
): typeof globalThis & SetPathTuple<typeof globalThis, Path, Value>;

export function ensureProperty<
    T extends object,
    const Path extends ValidPaths<T>,
    Value
>(
    obj: T,
    path: Path,
    initialValue: Value
): T & SetPathTuple<T, Path, Value>;

export function ensureProperty<
    T extends object,
    const Path extends ReadonlyArray<string | number>,
    Value
>(
    obj: T,
    path: Path,
    initialValue: Value
): T & SetPathTuple<T, Path, Value>;

export function ensureProperty<T extends object, Path extends ReadonlyArray<string | number>, Value>(
    obj: T,
    path: Path,
    initialValue: Value
): T & SetPathTuple<T, Path, Value> {
    let current: any = obj;

    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (current[key] == null || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    const lastKey = path.at(-1);
    if (lastKey === undefined) {
        return obj as T & SetPathTuple<T, Path, Value>;
    }
    current[lastKey] ??= initialValue;
    return obj as T & SetPathTuple<T, Path, Value>;
}