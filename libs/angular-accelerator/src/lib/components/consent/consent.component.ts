import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'

const STORAGE_KEY = 'onecx-consent'
let nextConsentComponentId = 0

type ConsentStorage = string[]

/**
 * Payload emitted by {@link ConsentComponent.consentChanged}.
 *
 * Notes for GDPR/ePrivacy implementations:
 * - `hasConsent=true` indicates that the user has explicitly opted in for the given `url` (and optional `purpose`).
 * - `hasConsent=false` indicates that the previously stored consent was withdrawn via {@link ConsentComponent.resetConsent}.
 * - `purpose` is echoed back so consumers can handle multiple consent purposes (e.g. `maps`, `analytics`).
 */
export type ConsentChangedEvent = {
  url: string
  hasConsent: boolean
  purpose?: string
}

@Component({
  selector: 'ocx-consent',
  standalone: false,
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * UI component to gate projected content behind explicit user consent.
 *
 * Intended GDPR/ePrivacy usage (example: Leaflet + OpenStreetMap tiles):
 * - Put the map component (and any code that triggers network requests) inside the projected content.
 * - Do not instantiate/load third-party resources before consent, otherwise requests may be sent pre-consent.
 * - Provide sufficient information to the user (provider name, privacy policy) via the optional
 *   `[ocx-consent-info]` projection slot.
 * - Enable withdrawal with `[showWithdraw]="true"` and handle `consentChanged` with `hasConsent=false`.
 *
 * Example:
 * ```html
 * <ocx-consent
 *   [url]="tileServerUrl"
 *   purpose="maps"
 *   [showWithdraw]="true"
 *   (consentChanged)="onMapConsentChanged($event)"
 * >
 *   <a ocx-consent-info href="/privacy">Privacy policy</a>
 *
 *   <!-- Only render/init Leaflet after consent. -->
 *   <app-leaflet-map *ngIf="mapConsentGranted" [tileUrl]="tileServerUrl" />
 * </ocx-consent>
 * ```
 *
 * ```ts
 * import type { ConsentChangedEvent } from './consent.component'
 *
 * tileServerUrl = 'https://tile.openstreetmap.org'
 * mapConsentGranted = false
 *
 * onMapConsentChanged(e: ConsentChangedEvent) {
 *   if (e.purpose !== 'maps') return
 *   this.mapConsentGranted = e.hasConsent
 * }
 * ```
 *
 * Storage:
 * - Uses `localStorage` key `onecx-consent`.
 * - The stored JSON is a string array.
 * - Entries are either `<normalizedUrl>` (no purpose) or `<normalizedUrl>::<purpose>`.
 */
export class ConsentComponent {
  protected readonly titleId = `ocx-consent-title-${++nextConsentComponentId}`
  protected readonly messageId = `ocx-consent-message-${nextConsentComponentId}`

  /**
   * Target URL that the gated content will contact (e.g. the tile server URL).
   * Used for display and for consent matching.
   */
  url = input.required<string>()

  /**
   * Optional purpose scope for consent (e.g. `maps`, `analytics`).
   * When set, consent is stored and matched as `<url>::<purpose>`.
   */
  purpose = input<string | undefined>(undefined)

  /** Translation key for the consent dialog title. */
  titleKey = input<string>('OCX_CONSENT.TITLE')
  /** Translation key for the consent dialog message (receives `{ url }`). */
  messageKey = input<string>('OCX_CONSENT.MESSAGE')
  /** Translation key for the agree button. */
  agreeKey = input<string>('OCX_CONSENT.AGREE')
  /** Translation key for the withdraw button. */
  withdrawKey = input<string>('OCX_CONSENT.WITHDRAW')

  /**
   * When enabled, shows a withdraw button that removes the stored consent.
   * This helps meeting the requirement that withdrawal should be as easy as opt-in.
   */
  showWithdraw = input<boolean>(true)

  /**
   * Emits whenever consent is granted or withdrawn.
   * Consumers should only render/initialize third-party code after receiving `hasConsent=true`.
   */
  consentChanged = output<ConsentChangedEvent>()

  localStorageUpdatedTimestamp = signal<number>(0)

  protected normalizedUrl = computed(() => this.normalizeUrl(this.url()))

  protected hasConsent = computed(() => {
    // Manually call localStorageUpdatedTimestamp signal so that computation re-runs on each localStorage change
    this.localStorageUpdatedTimestamp()
    const normalized = this.normalizedUrl()
    if (!normalized) return false

    return this.hasStoredConsent(normalized)
  })

  protected giveConsent(): void {
    const normalized = this.normalizedUrl()
    if (!normalized) return

    const current = this.readConsents()
    const alreadyPresent = this.hasStoredConsent(normalized, current)
    if (!alreadyPresent) {
      const entry = this.toStorageEntry(normalized, this.purpose())
      const updated = entry ? [...current, entry] : [...current]
      this.writeConsents(updated)
      this.consentChanged.emit({ url: normalized, hasConsent: true, purpose: this.purpose() })
    }
  }

  protected resetConsent(): void {
    const normalized = this.normalizedUrl()
    if (!normalized) return

    const purpose = this.purpose()
    const updated = this.readConsents().filter((stored) => {
      const parsed = this.fromStorageEntry(stored)
      if (this.normalizeUrl(parsed.url) !== normalized) return true
      if (purpose === undefined) return false
      return parsed.purpose !== purpose
    })

    this.writeConsents(updated)
    this.consentChanged.emit({ url: normalized, hasConsent: false, purpose })
  }

  private safeJsonParse(value: string): unknown {
    try {
      return JSON.parse(value)
    } catch {
      return undefined
    }
  }

  private readConsents(): ConsentStorage {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = this.safeJsonParse(raw)
    return Array.isArray(parsed) && parsed.every((x) => typeof x === 'string') ? (parsed as string[]) : []
  }

  private writeConsents(value: ConsentStorage): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    // Trigger re-computation of hasConsent
    this.localStorageUpdatedTimestamp.set(Date.now())
  }

  private hasStoredConsent(normalizedUrl: string, storage: ConsentStorage = this.readConsents()): boolean {
    const purpose = this.purpose()

    return storage.some((stored) => {
      const parsed = this.fromStorageEntry(stored)
      if (this.normalizeUrl(parsed.url) !== normalizedUrl) return false
      if (purpose === undefined) return true
      return parsed.purpose === purpose
    })
  }

  private toStorageEntry(url: string, purpose?: string): string {
    const normalized = this.normalizeUrl(url)
    if (!normalized) return ''
    return purpose ? `${normalized}::${purpose}` : normalized
  }

  private fromStorageEntry(entry: string): { url: string; purpose?: string } {
    const parts = entry.split('::')
    const url = parts[0] ?? ''
    const purpose = parts.length > 1 ? parts.slice(1).join('::') : undefined
    return { url, purpose }
  }

  private normalizeUrl(raw: string): string {
    const trimmed = raw.trim()
    if (!trimmed) return ''

    try {
      const url = new URL(trimmed)
      url.hash = ''
      url.search = ''
      url.hostname = url.hostname.toLowerCase()
      return url.toString().replace(/\/$/, '')
    } catch {
      return trimmed.replace(/\/$/, '')
    }
  }
}
