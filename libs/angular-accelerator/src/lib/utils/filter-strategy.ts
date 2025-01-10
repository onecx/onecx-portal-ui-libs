import { FilterObject } from '../model/filter.model'

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class FilterStrategy {
  endsWith(value: unknown, target: unknown): boolean {
    console.error('endsWith method not implemented')
    return true
  }

  startsWith(value: unknown, target: unknown): boolean {
    console.error('startsWith method not implemented')
    return true
  }

  contains(value: unknown, target: unknown): boolean {
    console.error('contains method not implemented')
    return true
  }

  notContains(value: unknown, target: unknown): boolean {
    console.error('notContains method not implemented')
    return true
  }

  equals(value: unknown, target: unknown): boolean {
    console.error('equals method not implemented')
    return true
  }

  notEquals(value: unknown, target: unknown): boolean {
    console.error('notEquals method not implemented')
    return true
  }

  lessThan(value: unknown, target: unknown): boolean {
    console.error('lessThan method not implemented')
    return true
  }

  greaterThan(value: unknown, target: unknown): boolean {
    console.error('greaterThan method not implemented')
    return true
  }

  lessThanOrEqual(value: unknown, target: unknown): boolean {
    console.error('lessThanOrEqual method not implemented')
    return true
  }

  greaterThanOrEqual(value: unknown, target: unknown): boolean {
    console.error('greaterThanOrEqual method not implemented')
    return true
  }

  isEmpty(value: unknown): boolean {
    console.error('isEmpty method not implemented')
    return true
  }

  isNotEmpty(value: unknown): boolean {
    console.error('isNotEmpty method not implemented')
    return true
  }

  compare(a: unknown, b: unknown): number {
    console.error('compare method not implemented')
    return 0
  }

  filter(hayStack: unknown[], filterObject: FilterObject): unknown[] {
    const { type, ...rest } = filterObject
    return hayStack.filter((item) => this[type](item, rest))
  }
}
