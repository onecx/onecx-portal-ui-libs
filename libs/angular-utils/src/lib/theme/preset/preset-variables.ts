import { createPalette, standardColorAdjustment } from '../../utils/create-color-palette'

import defaultVariables from './default-theme-variables'
import breadcrumb from './component-presets/breadcrumb'
import autocomplete from './component-presets/autocomplete'
import button from './component-presets/button'
import datatable from './component-presets/datatable'
import dialog from './component-presets/dialog'
import fieldset from './component-presets/fieldset'
import floatlabel from './component-presets/floatlabel'
import inputtext from './component-presets/inputtext'
import paginator from './component-presets/paginator'
import fileupload from './component-presets/fileupload'

// Structure of this object has to match https://github.com/primefaces/primeuix/tree/main/packages/themes/src/presets/aura
export default {
  components: {
    ...autocomplete,
    ...breadcrumb,
    ...button,
    ...datatable,
    ...dialog,
    ...fieldset,
    ...fileupload,
    ...floatlabel,
    ...inputtext,
    ...paginator,
  },
  semantic: {
    // OneCX semantic variables extension
    extend: {
      onecx: {
        ...defaultVariables.font,
        ...defaultVariables.topbar,
        ...defaultVariables.sidebar,
        ...defaultVariables.general,
        errorColor: '#b00020',
        animationDuration: '0.2s',
      },
    },
    transitionDuration: '0.2s',
    focusRing: {
      width: '1px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
      shadow: 'none',
    },
    disabledOpacity: '0.6',
    iconSize: '1rem',
    anchorGutter: '2px',
    primary: {
      ...createPalette(defaultVariables.general.primaryColor, standardColorAdjustment),
    },
    formField: {
      // INFO: --input-padding from dev env has equal values 0.75rem 0.75rem
      paddingX: '0.75rem',
      // paddingY: '0.5rem',
      paddingY: '0.75rem', // equal to paddingX
      // INFO: Tokens for new small form fields
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        // paddingY: '0.375rem',
        paddingY: '0.625rem', // equal to paddingX
      },
      // INFO: Tokens for new large form fields
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        // paddingY: '0.625rem',
        paddingY: '0.875rem', // equal to paddingX
      },
      borderRadius: '{border.radius.md}',
      focusRing: {
        width: '0',
        style: 'none',
        color: 'transparent',
        offset: '0',
        shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
    // INFO: Lists in all select and list components (except for tree select and menus)
    list: {
      // INFO: List container doesn't seem to have padding in our apps
      // padding: '0.25rem 0.25rem',
      // TODO: Do we set a padding here and reduce the padding of the individual items?
      padding: '0',
      // INFO: new variable, gap between each item in list
      gap: '2px',
      header: {
        // INFO: --input-list-header-padding used
        //padding: '0.5rem 1rem 0.25rem 1rem',
        padding: '0.75rem',
      },
      option: {
        // INFO: --input-list-item-padding used
        // padding: '0.25rem 0.25rem',
        // TODO: Do we reduce this because of the newly introduced gap?
        padding: '0.75rem 0.75rem',
        // INFO: --input-list-item-border-radius used
        // borderRadius: '{border.radius.sm}',
        // TODO: If we decide to add padding to list container, a little bit of border radius would look great
        borderRadius: 0,
      },
      optionGroup: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used (400) -> no difference to weight of normal list item
        // TODO: Decide if we want to keep 600 or revert back to 400
        fontWeight: '600',
      },
    },
    mask: {
      // INFO: No variable for this, so probably was default PrimeNG value
      transitionDuration: '0.15s',
    },
    content: {
      // INFO: --border-radius is used
      borderRadius: '{border.radius.md}',
    },
    // INFO: All menu components
    navigation: {
      list: {
        // INFO: --vertical-menu-padding used
        // padding: '0.25rem 0.25rem',
        padding: '0.5rem 1.25rem',
        // INFO: new variable, gap between each item in list
        gap: '2px',
      },
      item: {
        // INFO: --menuitem-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem 0.75rem',
        // INFO: --menuitem-border-radius used
        // borderRadius: '{border.radius.sm}',
        borderRadius: '0',
        // INFO: new variable, gap between items in a single item, e.g., icon and text
        gap: '0.5rem',
      },
      submenuLabel: {
        // INFO: --submenu-header-padding used
        // padding: '0.5rem 0.75rem',
        padding: '0.75rem',
        // INFO: --submenu-header-font-weight used
        // fontWeight: '600',
        fontWeight: '400',
      },
      submenuIcon: {
        // INFO: --menuitem-submenu-icon-font-size used
        size: '0.875rem',
      },
    },
    overlay: {
      // INFO: Components allowing selection
      select: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --input-overlay-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: Components that pop up (p-password, tooltip)
      popover: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: for tooltip its 0.5rem
        // INFO: for overlaypanel and password 0.75rem
        padding: '0.75rem',
        // INFO: --input-overlay-shadow used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
      // INFO: The only usage of this token is related to p-dialog
      modal: {
        // INFO: --border-radius is used
        // TODO: Can be borderRadius: 4px
        // borderRadius: '{border.radius.md}',
        borderRadius: '{border.radius.sm}',
        // INFO: --dialog-header-padding is used and --dialog-content-padding is used
        padding: '1.25rem',
        // INFO: --overlay-container-shadow is used
        // shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        shadow:
          '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
      },
      // INFO: All menu components
      navigation: {
        // INFO: --overlay-menu-shadow is used
        // shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        shadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
      },
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f7f8f9',
          100: '#dadee3',
          200: '#bcc3cd',
          300: '#9fa9b7',
          400: '#818ea1',
          500: '#64748b',
          600: '#556376',
          700: '#465161',
          800: '#37404c',
          900: '#282e38',
          950: '#191d23',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{onecx.button.hover.bg}', // button-hover-bg
          activeColor: '{onecx.button.active.bg}', // button-active-bg
          // if buttonActiveBg is not set, it should be primary.400
        },
        highlight: {
          // --highlight-bg is used, rgba($primaryColor, 0.12);
          background: '{primary.100}',
          // $highlightFocusBg is used, rgba($primaryColor, 0.24) !default;
          focusBackground: '{primary.200}',
          // primaryColor is used for highlightTextColor
          color: '{primary.color}',
          // textColor is used for $inputListItemTextFocusColor
          focusColor: '{text.color}',
        },
        mask: {
          // INFO: --maskbg used
          // INFO: Mask applied on image, speedDial with mask prop. Determines what color is the mask
          // background: 'rgba(0,0,0,0.4)',
          background: 'rgba(0, 0, 0, 0.32)',
          // INFO: Color of any text content inside a mask?
          color: '{surface.200}',
        },
        // TODO: Consider using theme variable for surface value so background and borders are set correctly
        formField: {
          // INFO: dev -> on focus primary color is used
          focusBorderColor: '{primary.color}',

          // TODO: When button is invalid, hover/focus is applied for border
          // INFO: $errorColor color is used for invalid border
          // invalidBorderColor: '{red.400}',
          invalidBorderColor: '{onecx.error.color}', // using $errorCode

          // INFO: $errorColor color is used for invalid border
          // invalidPlaceholderColor: '{red.600}',
          invalidPlaceholderColor: '{onecx.error.color}', // using $errorCode

          // INFO: --input-bg used input background
          // TODO: Check with surface value
          // TODO: Can be background: '#ffffff'
          background: '{surface.0}',
          // INFO: --input-filled-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledBackground: '#f5f5f5'
          filledBackground: '{surface.50}',
          // INFO: --input-filled-hover-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledHoverBackground: '#ececec'
          filledHoverBackground: '{surface.50}',
          // INFO: --input-filled-focus-bg used input background
          // TODO: Check with surface value
          // TODO: Can be filledFocusBackground: '#dcdcdc'
          filledFocusBackground: '{surface.50}',

          // INFO: no variable for disabled background of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledBackground: DECIDE_VALUE
          // disabledBackground: '{surface.200}',
          disabledBackground: '{surface.100}', // lighter color than default
          // INFO: no variable for disabled color of form fields, opacity for input is set, opacity: var(--disabled-opacity);
          // TODO: Check with surface value
          // TODO: Can be disabledColor: DECIDE_VALUE
          // disabledColor: '{surface.500}',
          disabledColor: '{surface.400}', // lighter color than default

          // INFO: --emphasis-low is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be borderColor: rgba(0, 0, 0, 0.38)
          // borderColor: '{surface.300}',
          borderColor: '{surface.200}', // lighter color than default
          // INFO: --emphasis-high is used for default input border color
          // TODO: Check with surface value
          // TODO: Can be hoverBorderColor: rgba(0, 0, 0, 0.87)
          hoverBorderColor: '{surface.400}',

          // INFO: --emphasis-high is used for default input text color
          // TODO: Check with surface value
          // TODO: Can be color: rgba(0, 0, 0, 0.87)
          color: '{surface.700}',
          // INFO: --emphasis-medium is used for placeholder text color
          // TODO: Check with surface value
          // TODO: Can be placeholderColor: rgba(0, 0, 0, 0.6)
          placeholderColor: '{surface.500}',
          // INFO: --emphasis-medium is used for icon color
          // TODO: Check with surface value
          // TODO: Can be iconColor: rgba(0, 0, 0, 0.6)
          iconColor: '{surface.400}',
          // INFO: no variable for shadow, no shadow seems to be there for form fields
          shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',

          // INFO: --emphasis-medium is used for float label text color
          // TODO: Check with surface value
          // TODO: Can be floatLabelColor: rgba(0, 0, 0, 0.6)
          floatLabelColor: '{surface.500}',
          // INFO: dev -> on focus primary color is used
          // floatLabelFocusColor: '{primary.600}',
          floatLabelFocusColor: '{primary.color}',
          // INFO: No clue what it is
          floatLabelActiveColor: '{surface.500}',
          // INFO: $errorColor color is used for invalid border
          floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
        },
        text: {
          color: '{onecx.text.color}',
          // INFO: textColor used for inplaceTextHoverColor, toggleButtonTextHoverColor
          hoverColor: '{onecx.text.secondary.color}',
          // mutedColor and hovermuted are not available in the theme
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },
        content: {
          background: '{onecx.content.bg.color}',
          hoverBackground: '{onecx.hover.bg.color}',
          borderColor: '{surface.100}',
          color: '{text.color}',
          hoverColor: '{text.hover.color}',
        },
        overlay: {
          select: {
            // INFO: --input-list-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --input-overlay-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          popover: {
            // INFO: --panel-content-bg used
            // TODO: Check with surface value
            // TODO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --panel-content-bg used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
          modal: {
            // INFO: --dialog-header-bg, dialog-content-bg used
            // INFO: Can be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --overlay-content-border used
            // INFO: border: 0 none
            // TODO: Should border be none or should overlay have a border?
            borderColor: '{surface.200}',
            // INFO: --text-color used
            color: '{text.color}',
          },
        },
        // INFO: Lists in all select and list components (except for tree select and menus)
        list: {
          option: {
            option: {
              selectedColor: '{primary.color}',
              selectedFocusColor: '{primary.color}',
            },
            // INFO: --input-list-item-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --highlight-bg used
            selectedBackground: '{highlight.background}',
            // INFO: --highlight-bg used
            selectedFocusBackground: '{highlight.focus.background}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --primary-color used
            selectedColor: '{highlight.color}',
            // INFO: --primary-color used
            selectedFocusColor: '{highlight.focus.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
            },
          },
          optionGroup: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: '{surface.0}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or text.muted
            color: '{text.muted.color}',
          },
        },
        // INFO: All menu components
        navigation: {
          item: {
            // INFO: --menuitem-focus-bg, --menuitem-hover-bg used
            // INFO: Could be focusBackground: 'rgba(0, 0, 0, 0.04)'
            focusBackground: '{surface.100}',
            // INFO: --menuitem-active-bg, --menuitem-active-focus-bg used
            // INFO: Could be activeBackground: 'rgba(0, 0, 0, 0.04)'
            activeBackground: '{surface.100}',
            // INFO: --text-color used
            color: '{text.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            focusColor: '{text.hover.color}',
            // INFO: --text-color used
            // TODO: Maybe it makes sense to leave hover color?
            activeColor: '{text.hover.color}',
            icon: {
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              color: '{surface.400}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              focusColor: '{surface.500}',
              // INFO: --text-secondary-color used
              // TODO: Decide on secondary color or surface
              activeColor: '{surface.500}',
            },
          },
          submenuLabel: {
            // INFO: --submenu-header-bg used
            // INFO: Could be background: '#ffffff'
            background: 'transparent',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{text.muted.color}',
          },
          submenuIcon: {
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            color: '{surface.400}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            focusColor: '{surface.500}',
            // INFO: --text-secondary-color used
            // TODO: Decide on secondary color or surface
            activeColor: '{surface.500}',
          },
        },
      },
    },
  },
}
