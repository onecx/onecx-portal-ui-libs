import { SimpleChange } from '@angular/core'
import { ThemePropertiesV2 } from '@onecx/integration-interface'

/**
 * Minimal lifecycle surface required to patch a PrimeNG component instance and
 * react to explicit input changes plus component teardown.
 */
export type PrimeNgPatchableComponent = {
  onChanges?: (changes: Record<string, SimpleChange<any>>) => unknown
  onAfterContentInit?: () => unknown
  onDestroy?: () => unknown
}

/**
 * Constructor-like shape used to access the component prototype for runtime patching.
 */
export type PrimeNgComponentType<TComponent extends PrimeNgPatchableComponent> = {
  prototype: TComponent
}

/**
 * Configuration required to connect resolved theme settings to a specific PrimeNG component type.
 *
 * @template TComponent PrimeNG component instance type being patched.
 * @template TDefaults Object shape of theme-mapped input defaults.
 */
export interface PrimeNgComponentSettingsRuntimeConfig<
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
export class PrimeNgComponentSettingsRuntime<
  TComponent extends PrimeNgPatchableComponent,
  TDefaults extends object,
> {
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
  constructor(private readonly config: PrimeNgComponentSettingsRuntimeConfig<TComponent, TDefaults>) {
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
   * @returns No return value.
   */
  private patchRuntime(): void {
    if (this.state.patched) {
      return
    }

    const { componentType } = this.config
    const originalOnChanges = componentType.prototype.onChanges
    const originalOnAfterContentInit = componentType.prototype.onAfterContentInit
    const originalOnDestroy = componentType.prototype.onDestroy
    const runtime = this

    componentType.prototype.onChanges = function (changes: Record<string, SimpleChange<any>>) {
      runtime.recordExplicitInputs(this as TComponent, changes)
      return originalOnChanges?.call(this, changes)
    }

    componentType.prototype.onAfterContentInit = function () {
      runtime.registerInstance(this as TComponent)
      runtime.applySettings(this as TComponent)
      return originalOnAfterContentInit?.call(this)
    }

    componentType.prototype.onDestroy = function () {
      runtime.unregisterInstance(this as TComponent)
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
   * @param instance Component instance whose inputs changed.
   * @param changes Angular simple-change map passed to `onChanges`.
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