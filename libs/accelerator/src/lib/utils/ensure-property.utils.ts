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
 * @template T - The object type
 * @template Path - The path as a tuple of keys
 * @template Value - The type of the value to set
 * @param obj - The object to modify
 * @param path - An array representing the path to the property (e.g., ['user', 'profile', 'name'])
 * @param initialValue - The value to set if the property is currently null or undefined
 *
 * @example
 * // Ensure a global debug flag exists
 * ensureProperty(globalThis, ['myApp', 'config', 'debug'], false);
 * // Access it safely:
 * if (globalThis.myApp.config.debug) {
 *   console.log('Debug mode enabled');
 * }
 *
 * @example
 * // Initialize nested configuration
 * const config = {};
 * ensureProperty(config, ['database', 'host'], 'localhost');
 * ensureProperty(config, ['database', 'port'], 5432);
 * // config is now { database: { host: 'localhost', port: 5432 } }
 *
 * @example
 * // Won't overwrite existing values
 * const obj = { name: 'John' };
 * ensureProperty(obj, ['name'], 'Jane');
 * // obj.name remains 'John'
 *
 * @example
 * // Replaces null values
 * const obj = { name: null };
 * ensureProperty(obj, ['name'], 'Default');
 * // obj.name is now 'Default'
 */
export function ensureProperty<
    const Path extends ReadonlyArray<string | number>,
    Value
>(
    obj: typeof globalThis,
    path: Path,
    initialValue: Value
): asserts obj is typeof globalThis & SetPathTuple<typeof globalThis, Path, Value>;

export function ensureProperty<
    T extends object,
    const Path extends ValidPaths<T>,
    Value
>(
    obj: T,
    path: Path,
    initialValue: Value
): asserts obj is T & SetPathTuple<T, Path, Value>;

export function ensureProperty<
    T extends object,
    const Path extends ReadonlyArray<string | number>,
    Value
>(
    obj: T,
    path: Path,
    initialValue: Value
): asserts obj is T & SetPathTuple<T, Path, Value>;

export function ensureProperty<T extends object, Path extends ReadonlyArray<string | number>, Value>(
    obj: T,
    path: Path,
    initialValue: Value
): asserts obj is T & SetPathTuple<T, Path, Value> {
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
        return;
    }
    current[lastKey] ??= initialValue;
}