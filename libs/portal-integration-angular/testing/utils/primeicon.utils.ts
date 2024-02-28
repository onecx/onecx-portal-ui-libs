import { PrimeIcons } from 'primeng/api'

export type PrimeIcon = (typeof PrimeIcons)[keyof Omit<typeof PrimeIcons, 'prototype'>]
