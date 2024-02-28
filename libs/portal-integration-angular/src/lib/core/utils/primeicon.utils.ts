import { PrimeIcons } from 'primeng/api'
/**
 * @example let myIcon : PrimeIcon = PrimeIcons.myIcon
 */
export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]
