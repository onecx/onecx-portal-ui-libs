export interface Options {
  serialize?: (state: any) => any
  deserialize?: (state: any) => any
  reviver?: (key: string, value: any) => any
  replacer?: ((key: string, value: any) => any) | string[]
  encrypt?: (message: string) => string
  decrypt?: (message: string) => string
  filter?: string[]
  space?: string | number
}

type CommonKeyConfigurationTypes = Options | ((key: string, value: any) => any)

export interface KeyConfiguration {
  [key: string]: string[] | number[] | KeyConfiguration[] | CommonKeyConfigurationTypes
}

export interface NestedKeyConfiguration {
    [key: string]: (string | number | NestedKeyConfiguration)[] | CommonKeyConfigurationTypes
  }

export function castToNestedKeyConfiguration(nestedKeyConfiguration: (string | NestedKeyConfiguration)[]): KeyConfiguration[] {
  return nestedKeyConfiguration as KeyConfiguration[]
}
