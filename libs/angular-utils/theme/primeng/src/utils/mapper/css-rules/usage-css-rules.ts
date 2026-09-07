import type { CssRule } from '../mapper.types'
import { badgeCssRules } from './usages/badge.rules'
import { carouselCssRules } from './usages/carousel.rules'
import { calendarCssRules } from './usages/calendar.rules'
import { datatableCssRules } from './usages/datatable.rules'
import { fieldsetCssRules } from './usages/fieldset.rules'
import { diagramCssRules } from './usages/diagram.rules'
import { dialogCssRules } from './usages/dialog.rules'
import { menubarCssRules } from './usages/menubar.rules'
import { toggleswitchCssRules } from './usages/toggleswitch.rules'
import { tabsCssRules } from './usages/tabs.rules'
import { dropdownCssRules } from './usages/dropdown.rules'
import { textareaCssRules } from './usages/textarea.rules'
import { picklistCssRules } from './usages/picklist.rules'
import { messageCssRules } from './usages/message.rules'
import { togglebuttonCssRules } from './usages/togglebutton.rules'
import { inputCssRules } from './usages/input.rules'
import { interactiveDataViewCssRules } from './usages/interactive-dataview.rules'
import { selectbuttonCssRules } from './usages/selectbutton.rules'
import { loadingIndicatorCssRules } from './usages/loading-indicator.rules'
import { panelmenuCssRules } from './usages/panelmenu.rules'
import { dataviewCssRules } from './usages/dataview.rules'

export const usageCssRules: CssRule[] = [
  ...carouselCssRules,
  ...calendarCssRules,
  ...datatableCssRules,
  ...fieldsetCssRules,
  ...diagramCssRules,
  ...dialogCssRules,
  ...tabsCssRules,
  ...dropdownCssRules,
  ...badgeCssRules,
  ...inputCssRules,
  ...menubarCssRules,
  ...toggleswitchCssRules,
  ...textareaCssRules,
  ...togglebuttonCssRules,
  ...picklistCssRules,
  ...interactiveDataViewCssRules,
  ...messageCssRules,
  ...selectbuttonCssRules,
  ...loadingIndicatorCssRules,
  ...panelmenuCssRules,
  ...dataviewCssRules,
]
