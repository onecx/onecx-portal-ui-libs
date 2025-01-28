import themevariables from './default-theme-variables'
export default {
  semantic: {
    // OneCX semantic variables extension
    extend: {
      errorColor: '#b00020',
      backgroundColor: '#ffffff',
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
      500: themevariables.general.primaryColor,
      600: themevariables.general.secondaryColor,
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
          // TODO: Consider using theme variable for surface value so background and borders are set correctly
        },
        formField: {
          // INFO: dev -> on focus primary color is used
          focusBorderColor: '{primary.color}',

          // TODO: When button is invalid, hover/focus is applied for border
          // INFO: $errorColor color is used for invalid border
          // invalidBorderColor: '{red.400}',
          invalidBorderColor: '{error.color}', // using $errorCode

          // INFO: $errorColor color is used for invalid border
          // invalidPlaceholderColor: '{red.600}',
          invalidPlaceholderColor: '{error.color}', // using $errorCode

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
      },
    },
  },
}
