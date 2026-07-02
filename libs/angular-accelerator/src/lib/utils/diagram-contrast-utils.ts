/* 
Query to check if the user has high contrast mode enabled.
To enable high contrast modes in Windows use left alt + left shift + print screen and confirm the pop-up.
For macOS use ctrl + option + command + 8 to toggle high contrast mode.
For more details refer to https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
*/
const highContrastSelector = globalThis.matchMedia('(forced-colors: active)')

/* Matches flag will return true when high contrast mode is enabled */
export function hasHighContrast(): boolean {
  return highContrastSelector.matches
}

/* This function returns the background color based on the high contrast mode.
When high contrast mode is enabled, all background colors are overidden to black and all text color are overriden to white,
In chart we need to add this behavior manually, so we explicitly return white for high contrast mode, 
otherwise it uses the CSS variable --text-color */
export function getLabelColor(highContrast: boolean): string {
  if (highContrast) return '#ffffff'
  return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
}

/* Add event listener on high contrast mode change */
export function addHighContrastListener(handler: () => void): void {
  highContrastSelector.addEventListener('change', handler)
}

/* Remove event listener on high contrast mode change */
export function removeHighContrastListener(handler: () => void): void {
  highContrastSelector.removeEventListener('change', handler)
}