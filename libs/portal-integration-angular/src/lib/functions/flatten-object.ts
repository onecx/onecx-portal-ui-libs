type Extend<TObj extends Record<string, unknown>, K extends string> = {
  [TKey in keyof TObj & string as `${K}${TKey}`]: TObj[TKey] extends Record<string, unknown>
    ? Extend<TObj[TKey], `${K}${TKey}.`>
    : TObj[TKey]
}

type NonObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : T[K] extends object ? (T[K] extends Date ? K : never) : K
}[keyof T]

type ObjectKeysOf<T> = {
  [K in keyof T]: T[K] extends Array<any> ? never : T[K] extends object ? K : never
}[keyof T]

type Filter<TObj extends object, TKey = keyof TObj> = TKey extends keyof TObj
  ? TObj[TKey] extends Array<any>
    ? TObj
    : TObj[TKey] extends object
    ? Filter<TObj[TKey]>
    : Pick<TObj, NonObjectKeysOf<TObj>> | Filter<Pick<TObj, ObjectKeysOf<TObj>>>
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type Result<TObj extends Record<string, unknown>> = UnionToIntersection<Filter<Extend<TObj, ''>>>

export function flattenObject<O extends Record<string, unknown>>(ob: O): Result<O> {
  const toReturn: Record<string, unknown> = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if (!!ob[i] && typeof ob[i] == 'object' && !(ob[i] instanceof Date) && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i] as Record<string, unknown>)
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = (flatObject as any)[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn as Result<O>
}
