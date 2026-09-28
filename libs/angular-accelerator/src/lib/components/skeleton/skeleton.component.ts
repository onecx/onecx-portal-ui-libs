import { Component, Input } from '@angular/core'

/**
 * Lightweight, theme-aware skeleton placeholder used while content is loading.
 *
 * The colors used for the base and the shimmer highlight are controlled via CSS custom
 * properties rather than inputs/outputs, so consumers can restyle the placeholder without
 * touching the component API:
 * - `--ocx-skeleton-background` (falls back to `var(--p-surface-200)`)
 * - `--ocx-skeleton-highlight` (falls back to `rgba(255, 255, 255, 0.4)`)
 *
 * These variables are not set by default and can be redefined on any ancestor element
 * (e.g. on `ocx-data-table`, `ocx-data-list-grid`, or `:root`) to override the appearance.
 */
@Component({
  standalone: false,
  selector: 'ocx-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  host: {
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.border-radius]': 'borderRadius',
    '[class.ocx-skeleton-circle]': "shape === 'circle'",
    '[class.ocx-skeleton-animated]': 'animated',
    'aria-hidden': 'true',
  },
})
export class OcxSkeletonComponent {
  /**
   * Width of the skeleton placeholder. Accepts any valid CSS width value.
   */
  @Input() width = '100%'

  /**
   * Height of the skeleton placeholder. Accepts any valid CSS height value.
   */
  @Input() height = '1rem'

  /**
   * Shape of the skeleton placeholder.
   */
  @Input() shape: 'rectangle' | 'circle' = 'rectangle'

  /**
   * Border radius of the skeleton placeholder. Defaults to the PrimeNG content border radius theme token.
   */
  @Input() borderRadius: string | undefined

  /**
   * Whether the shimmer animation should be shown.
   */
  @Input() animated = true
}
