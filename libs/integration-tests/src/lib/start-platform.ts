import { PlatformManager } from './platform/platform-manager'
import { Logger } from './utils/logger'

const logger = new Logger('StartPlatform')

/**
 * Custom error for timeout scenarios
 */
class TimeoutError extends Error {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    public readonly context?: string
  ) {
    super(message)
    this.name = 'TimeoutError'
  }
}

async function runAllContainers() {
  const manager = new PlatformManager()
  let shuttingDown = false

  const shutdown = async () => {
    if (!shuttingDown) {
      shuttingDown = true
      logger.info('PLATFORM_STOP')
      try {
        await manager.stopAllContainers()
        logger.success('PLATFORM_SHUTDOWN')
      } catch (error) {
        // Log network cleanup errors as warnings, not errors
        if (error instanceof Error && error.message.includes('no such network')) {
          logger.warn('NETWORK_DESTROY', 'Network already destroyed')
        } else {
          logger.error('PLATFORM_SHUTDOWN', undefined, error)
        }
      } finally {
        process.exit(0)
      }
    }
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  process.on('SIGHUP', shutdown)

  try {
    logger.info('PLATFORM_START')
    const startTime = Date.now()

    const startPromise = manager.startContainers()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new TimeoutError('Container startup timed out after 3 minutes', 300000, 'Platform startup')),
        300_000
      )
    )
    await Promise.race([startPromise, timeoutPromise])

    const duration = Date.now() - startTime
    logger.logDuration('STARTUP_SUCCESS', duration, 'All containers')

    // Note: Heartbeat monitoring is now handled automatically by the PlatformManager
    // based on the health check configuration. To enable it, use a JSON configuration
    // file with healthCheck.enabled = true or use the new PlatformLauncher.
  } catch (error) {
    if (error instanceof TimeoutError) {
      logger.error('STARTUP_TIMEOUT', error.context, error)
    } else {
      logger.error('STARTUP_FAILED', undefined, error)
    }
    await shutdown()
    process.exit(1)
  }
}

runAllContainers()
