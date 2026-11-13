// INFO: All severities use the shared focus ring colour token (contrast checked, see utils/focus-ring.ts)
// instead of the severity colour, which does not reach 3:1 against the surface for every severity.
const severities = ['primary', 'secondary', 'info', 'success', 'warn', 'help', 'danger', 'contrast']
const focusRingColors = Object.fromEntries(
  severities.map((severity) => [severity, { focusRing: { color: '{focus.ring.color}' } }])
)

export default {
  button: {
    root: {
      paddingY: '0.643rem',
    },
    colorScheme: {
      light: { root: focusRingColors },
      dark: { root: focusRingColors },
    },
  },
}
