import { OpenngIcons } from '@openng/optimus-ui/api'
/**
 * @example let myIcon : OptimusIcon = OpenngIcons.myIcon
 */
export type OptimusIcon = (typeof OpenngIcons)[keyof Omit<typeof OpenngIcons, 'prototype'>]
