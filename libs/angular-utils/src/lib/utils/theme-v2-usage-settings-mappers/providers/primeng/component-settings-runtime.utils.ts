import { SimpleChange } from '@angular/core'
import { ThemePropertiesV2 } from '@onecx/integration-interface'
import { createLogger } from '../../../logger.utils'

/**
 * Lifecycle surface the runtime bridge wraps on a PrimeNG component instance.
 *
 * The three methods correspond to the points at which themed defaults are applied and the
 * instance's membership is managed:
 *
 * - `ngOnChanges`        records which tracked inputs were bound explicitly and re-applies
 *                        themed defaults when inputs change at runtime.
 * - `ngAfterContentInit` registers a newly created instance and applies themed defaults to it
 *                        for the first time.
 * - `ngOnDestroy`        removes the instance so subsequent theme changes no longer target it.
 *
 * Every member is optional because the bridge wraps whatever is present through optional
 * chaining (`originalOnX?.call(...)`). A component that extends PrimeNG's `BaseComponent`
 * inherits all three methods, so the complete surface is available in practice. The type is
 * deliberately structural and does not require inheriting `BaseComponent`, which lets the
 * bridge wrap non-Angular PrimeNG component types and keeps working if a future PrimeNG
 * version reorganises the base class.
 */
export type PrimeNgPatchableComponent = {
  ngOnChanges?: (changes: Record<string, SimpleChange<any>>) => unknown
  ngAfterContentInit?: () => unknown
  ngOnDestroy?: () => unknown
}

/**
 * Constructor-like shape used to access the component prototype for runtime patching.
 * `name` is the constructor's runtime name, used only for diagnostic messages.
 */
export type PrimeNgComponentType<TComponent extends PrimeNgPatchableComponent> = {
  prototype: TComponent
  name?: string
}

/**
 * Configuration required to connect resolved theme settings to a specific PrimeNG component type.
 *
 * @template TComponent PrimeNG component instance type being patched.
 * @template TDefaults Object shape of theme-mapped input defaults.
 */
export interface PrimeNgComponentThemingSettingsRuntimeConfig<
  TComponent extends PrimeNgPatchableComponent,
  TDefaults extends object,
> {
  /** PrimeNG component class whose prototype should be patched. */
  componentType: PrimeNgComponentType<TComponent>
  /** Input keys tracked for explicit instance overrides and theme default application. */
  trackedKeys: readonly (keyof TDefaults)[]
  /** Resolves theme properties into component input defaults. */
  resolveDefaults: (properties: ThemePropertiesV2) => Partial<TDefaults>
  /** Recomputes any component internals that depend on the patched inputs. */
  refreshInstance: (instance: TComponent) => void
}

type RuntimeState<TComponent extends PrimeNgPatchableComponent, TDefaults extends object> = {
  patched: boolean
  activeInstances: Set<TComponent>
  explicitInputs: WeakMap<TComponent, Set<keyof TDefaults>>
}

/**
 * Reusable runtime bridge that applies theme-mapped defaults to PrimeNG component instances.
 *
 * It patches the component lifecycle once, tracks explicit instance inputs, and
 * applies only those theme defaults that were not explicitly provided.
 *
 * @template TComponent PrimeNG component instance type being patched.
 * @template TDefaults Object shape of theme-mapped input defaults.
 */
export class PrimeNgComponentThemingSettingsRuntime<
  TComponent extends PrimeNgPatchableComponent,
  TDefaults extends object,
> {
  private readonly logger = createLogger('PrimeNgComponentThemingSettingsRuntime')
  private currentDefaults: Partial<TDefaults> = {}
  private readonly state: RuntimeState<TComponent, TDefaults> = {
    patched: false,
    activeInstances: new Set<TComponent>(),
    explicitInputs: new WeakMap<TComponent, Set<keyof TDefaults>>(),
  }

  /**
   * Creates a runtime bridge for one PrimeNG component type and patches its prototype.
   *
   * @param config Runtime configuration describing how theme defaults map onto component instances.
   */
  constructor(private readonly config: PrimeNgComponentThemingSettingsRuntimeConfig<TComponent, TDefaults>) {
    this.patchRuntime()
  }

  /**
   * Resolves the current theme properties into component defaults and reapplies them
   * to all active component instances.
   *
   * @param properties Resolved V2 theme properties for the current runtime context.
   * @returns No return value.
   */
  applyThemeProperties(properties: ThemePropertiesV2): void {
    this.currentDefaults = this.config.resolveDefaults(properties)

    for (const instance of this.state.activeInstances) {
      this.applySettings(instance, true)
    }
  }

  /**
   * Patches the component prototype exactly once to observe explicit inputs and lifecycle events.
   *
   * ### Approach
   *
   * The bridge wraps the three Angular lifecycle methods the framework calls on the instance,
   * because it cannot reach into PrimeNG to alter its internals. Each original method is preserved
   * and invoked by the wrapper, so PrimeNG's own behaviour is fully retained.
   *
   * ### Guard condition
   *
   * A guard is applied to `ngAfterContentInit` only, because it is the hook that carries the core
   * function of the bridge: registering a newly created instance and applying themed defaults to it
   * for the first time. If that hook does not fire, instances receive no themed defaults at all,
   * which is the silent failure mode the bridge is intended to avoid.
   *
   * The check is performed on the unprefixed `onAfterContentInit` member of the prototype rather
   * than on the `ng*` method. The `ng*` methods are declared on `BaseComponent` and inherited by
   * every PrimeNG component, so testing for them would always pass and provide no signal. The
   * unprefixed `onAfterContentInit` is the observable marker that the component participates in the
   * `BaseComponent` on* hook convention that wires `ngAfterContentInit` into the component, and its
   * absence is the structural signal that the component no longer follows that convention. The
   * warning is emitted once per component type at patch time, so a future PrimeNG release that
   * renames or removes the convention is reported in the log rather than theming nothing silently.
   *
   * `ngOnChanges` is intentionally not guarded. It is inherited from `BaseComponent` and invoked by
   * Angular whenever any `@Input` changes, so it fires for all PrimeNG components in practice. An
   * absent `ngOnChanges` degrades only live-update fidelity rather than disabling the feature: the
   * instance still receives themed defaults once at `ngAfterContentInit`, but is no longer refreshed
   * as inputs change and loses the explicit-input tracking that protects consumer-bound inputs from
   * later theme overrides. That outcome is a partial degradation, so it does not warrant a warning in
   * the same way a broken `ngAfterContentInit` does.
   *
   * @returns No return value.
   */
  private patchRuntime(): void {
    if (this.state.patched) {
      return
    }

    const { componentType } = this.config

    if (typeof (componentType.prototype as Record<string, unknown>)['onAfterContentInit'] !== 'function') {
      this.logger.warn(
        `${componentType.name ?? 'component'} does not define an ` +
          'onAfterContentInit hook, so theme-mapped input defaults will not be applied to it. This ' +
          'usually means the component no longer follows PrimeNG BaseComponent hook conventions.'
      )
    }

    const originalOnChanges = componentType.prototype.ngOnChanges
    const originalOnAfterContentInit = componentType.prototype.ngAfterContentInit
    const originalOnDestroy = componentType.prototype.ngOnDestroy
    const recordExplicitInputs = (instance: TComponent, changes: Record<string, SimpleChange<any>>) =>
      this.recordExplicitInputs(instance, changes)
    const registerInstance = (instance: TComponent) => this.registerInstance(instance)
    const applySettings = (instance: TComponent) => this.applySettings(instance)
    const unregisterInstance = (instance: TComponent) => this.unregisterInstance(instance)

    componentType.prototype.ngOnChanges = function (changes: Record<string, SimpleChange<any>>) {
      recordExplicitInputs(this as TComponent, changes)
      return originalOnChanges?.call(this, changes)
    }

    componentType.prototype.ngAfterContentInit = function () {
      registerInstance(this as TComponent)
      applySettings(this as TComponent)
      return originalOnAfterContentInit?.call(this)
    }

    componentType.prototype.ngOnDestroy = function () {
      unregisterInstance(this as TComponent)
      return originalOnDestroy?.call(this)
    }

    this.state.patched = true
  }

  /**
   * Tracks a live component instance so future theme changes can update it.
   *
   * @param instance Component instance entering its active lifecycle.
   * @returns No return value.
   */
  private registerInstance(instance: TComponent): void {
    this.state.activeInstances.add(instance)
  }

  /**
   * Removes a component instance from runtime tracking and clears explicit-input metadata.
   *
   * @param instance Component instance leaving its active lifecycle.
   * @returns No return value.
   */
  private unregisterInstance(instance: TComponent): void {
    this.state.activeInstances.delete(instance)
    this.state.explicitInputs.delete(instance)
  }

  /**
   * Records which tracked inputs were explicitly provided on a component instance.
   * Explicit inputs take precedence over theme defaults.
   *
   * An input becomes explicit the moment it appears in a `changes` map and stays explicit for the
   * instance's lifetime: the set is additive-only and is never shrunk. So once a consumer binds an
   * input even once (e.g. `[circular]="x"`), later removing the binding or letting the bound value
   * become `undefined` will not restore theme defaults for that instance. This is intentional —
   * "explicit is sticky" — so a deliberate override is never clobbered by a transient `undefined`.
   *
   * @param instance Component instance whose inputs changed.
  * @param changes Angular simple-change map passed to `ngOnChanges`.
   * @returns No return value.
   */
  private recordExplicitInputs(instance: TComponent, changes: Record<string, unknown>): void {
    const explicitInputs = this.state.explicitInputs.get(instance) ?? new Set<keyof TDefaults>()

    for (const key of Object.keys(changes)) {
      if (this.config.trackedKeys.includes(key as keyof TDefaults)) {
        explicitInputs.add(key as keyof TDefaults)
      }
    }

    this.state.explicitInputs.set(instance, explicitInputs)
  }

  /**
   * Applies unresolved theme defaults to a component instance when that input was not explicitly set.
   *
   * @param instance Component instance receiving theme defaults.
   * @param refreshAfterApply When true, refreshes component internals if at least one value changed.
   * @returns No return value.
   */
  private applySettings(instance: TComponent, refreshAfterApply = false): void {
    const explicitInputs = this.state.explicitInputs.get(instance) ?? new Set<keyof TDefaults>()
    let hasChanges = false

    for (const key of this.config.trackedKeys) {
      const value = this.currentDefaults[key]

      if (value === undefined || explicitInputs.has(key) || (instance as Record<string, unknown>)[key as string] === value) {
        continue
      }

      ;(instance as Record<string, unknown>)[key as string] = value
      hasChanges = true
    }

    if (refreshAfterApply && hasChanges) {
      this.config.refreshInstance(instance)
    }
  }
}