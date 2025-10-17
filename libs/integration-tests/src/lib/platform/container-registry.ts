import { CONTAINER } from '../models/container.enum'
import type { AllowedContainerTypes } from '../models/allowed-container.types'
import { Logger, LogMessages } from '../utils/logger'

const logger = new Logger('ContainerRegistry')

/**
 * Central registry for managing container lifecycle and access
 * Acts as an intermediary between PlatformManager and container starters
 */
export class ContainerRegistry {
  private containers: Map<string | CONTAINER, AllowedContainerTypes> = new Map()

  /**
   * Register a container in the registry
   */
  addContainer<T extends AllowedContainerTypes>(key: string | CONTAINER, container: T): void {
    this.containers.set(key, container)
    logger.success(LogMessages.CONTAINER_STARTED, this.getContainerKey(key))
  }

  /**
   * Get a container by key
   */
  getContainer<T extends AllowedContainerTypes>(key: string | CONTAINER): T | undefined {
    return this.containers.get(key) as T | undefined
  }

  /**
   * Check if a container exists in the registry
   */
  hasContainer(key: string | CONTAINER): boolean {
    return this.containers.has(key)
  }

  /**
   * Get all containers as a map
   */
  getAllContainers(): Map<string | CONTAINER, AllowedContainerTypes> {
    return new Map(this.containers)
  }

  /**
   * Get all container keys
   */
  getContainerKeys(): (string | CONTAINER)[] {
    return Array.from(this.containers.keys())
  }

  /**
   * Remove a container from the registry (useful for cleanup)
   */
  removeContainer(key: string | CONTAINER): boolean {
    const removed = this.containers.delete(key)
    if (removed) {
      logger.success(LogMessages.CONTAINER_STOPPED, this.getContainerKey(key))
    }
    return removed
  }

  /**
   * Clear all containers from the registry
   */
  clear(): void {
    this.containers.clear()
    logger.info(LogMessages.PLATFORM_SHUTDOWN, 'All containers removed from registry')
  }

  /**
   * Get the number of registered containers
   */
  size(): number {
    return this.containers.size
  }

  /**
   * Helper method to get a string representation of the container key
   */
  private getContainerKey(key: string | CONTAINER): string {
    return typeof key === 'string' ? key : String(key)
  }
}
