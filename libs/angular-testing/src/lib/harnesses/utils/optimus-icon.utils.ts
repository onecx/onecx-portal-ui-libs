import { OpenngIcons } from '@openng/optimus-ui/api'

export type OptimusIcon = (typeof OpenngIcons)[keyof Omit<typeof OpenngIcons, 'prototype'>]
