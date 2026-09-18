/**
 * Public entry point for the theme V2 usage-settings mapping feature.
 *
 * This is the single barrel the package re-exports from, so the feature's public surface stays
 * grouped here as new usages are added. Add a new provider mapper's exports here (next to the
 * `providers/*` leaves) rather than to the package barrel in `src/index.ts`.
 */

// Apply bridge — reads a usage's resolved settings and runs a mapper over them.
export * from './usage-settings.utils'

// Provider mappers.
export * from './providers/accelerator/table/table.mapper'
export * from './providers/accelerator/table/table.wiring'
export * from './providers/primeng/carousel.mapper'
