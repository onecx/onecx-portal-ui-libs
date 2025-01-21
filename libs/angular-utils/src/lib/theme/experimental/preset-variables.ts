import themevariables from '../default-theme-variables'

export default {
  semantic: {
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
  },
}
