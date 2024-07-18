import { QueryParamsHandling } from '@angular/router'
import { MenuItem } from 'primeng/api'
export interface BreadCrumbMenuItem {
  /** @deprecated use labelKey instead */
  label?: string
  labelKey?: string
  icon?: string
  command?: (event?: any) => void
  url?: string
  items?: MenuItem[]
  expanded?: boolean
  disabled?: boolean
  visible?: boolean
  target?: string
  escape?: boolean
  routerLinkActiveOptions?: any
  separator?: boolean
  badge?: string
  tooltip?: string
  tooltipPosition?: string
  badgeStyleClass?: string
  style?: any
  styleClass?: string
  /** @deprecated use titleKey instead */
  title?: string
  titleKey?: string
  id?: string
  automationId?: any
  tabindex?: string
  routerLink?: any
  queryParams?: {
    [k: string]: any
  }
  fragment?: string
  queryParamsHandling?: QueryParamsHandling
  preserveFragment?: boolean
  skipLocationChange?: boolean
  replaceUrl?: boolean
  iconStyle?: any
  iconClass?: string
  state?: {
    [k: string]: any
  }
  tooltipOptions?: {
    tooltipLabel?: string
    tooltipPosition?: 'right' | 'left' | 'top' | 'bottom'
    tooltipEvent?: 'hover' | 'focus'
    appendTo?: any
    positionStyle?: string
    tooltipStyleClass?: string
    tooltipZIndex?: string
    escape?: boolean
    disabled?: boolean
    positionTop?: number
    positionLeft?: number
    showDelay?: number
    hideDelay?: number
    life?: number
  }
}
