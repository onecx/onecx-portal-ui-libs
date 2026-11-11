import * as z from 'zod'
import { icon, withRef } from '../primitives'
import { stateContrast } from './data-table-base-tokens'

/** The sort/filter icon base: an `icon` block plus the icon-name string(s). */
const sortIconBaseShape = z.object({
  icon: icon.optional(),
  ascendingIcon: withRef(z.string()).optional(),
  descendingIcon: withRef(z.string()).optional(),
  defaultIcon: withRef(z.string()).optional(),
})

const filterIconBaseShape = z.object({
  icon: icon.optional(),
  onIcon: withRef(z.string()).optional(),
  offIcon: withRef(z.string()).optional(),
})

const iconStateShape = z.object({
  icon: icon.pick({ color: true }).prefault({}),
})

/** Sort-control icons (header only). */
export const dataTableSortIconsShape = z.object({
  defaultState: sortIconBaseShape.prefault({}),
  hover: iconStateShape.prefault({}),
  active: iconStateShape.prefault({}),
  focus: iconStateShape.prefault({}),
})

/** Filter-control icons (header only). */
export const dataTableFilterIconsShape = z.object({
  defaultState: filterIconBaseShape.prefault({}),
  hover: iconStateShape.prefault({}),
  active: iconStateShape.prefault({}),
  focus: iconStateShape.prefault({}),
})

const iconBaseTokens = {
  size: '{{primitives.icon.sm}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  content: '',
  url: '',
}

const iconStateTokens = (state: string) => ({
  icon: { color: stateContrast(state) },
})

/** Header sort-control icons. */
export const dataTableSortIconsDefaults = {
  defaultState: {
    icon: iconBaseTokens,
    ascendingIcon: 'onecx:sort-ascending',
    descendingIcon: 'onecx:sort-descending',
    defaultIcon: 'onecx:sort-default',
  },
  hover: iconStateTokens('hover'),
  active: iconStateTokens('active'),
  focus: iconStateTokens('focus'),
}

/** Header filter-control icons. */
export const dataTableFilterIconsDefaults = {
  defaultState: {
    icon: iconBaseTokens,
    onIcon: 'onecx:filter-on',
    offIcon: 'onecx:filter-off',
  },
  hover: iconStateTokens('hover'),
  active: iconStateTokens('active'),
  focus: iconStateTokens('focus'),
}
