import { debounceTime, fromEvent, map, Observable, startWith } from 'rxjs'

export function isMobile(): Observable<boolean> {
  const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
  const onResize$ = fromEvent(window, 'resize').pipe(debounceTime(100))

  return onResize$.pipe(
    map(() => window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches),
    // Important: Start with 2 initial values to trigger pairwise for mobile detection on load
    startWith(
      !window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches,
      window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    )
  )
}
