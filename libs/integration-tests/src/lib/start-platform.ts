import { PlatformManager } from './platform-manager'

async function runAllContainers() {
  const manager = new PlatformManager()
  let shuttingDown = false

  const shutdown = async () => {
    if (!shuttingDown) {
      shuttingDown = true
      console.log('\nClosing all Containers...')
      try {
        await manager.stopAllServices()
        console.log('All Containers were stopped.')
      } catch (error) {
        console.error('Error during shutdown:', error)
      } finally {
        process.exit(0)
      }
    }
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  process.on('SIGHUP', shutdown)

  try {
    console.log('Starting all Containers...')
    const startPromise = manager.startAllServices()
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Container startup timed out')))
    )
    await Promise.race([startPromise, timeoutPromise])
    console.log('All Containers were started.')

    // Heartbeat
    setInterval(async () => {
      try {
        const healthStatus = await manager.checkAllHealthy()
        console.log('Container Health Status:', healthStatus)
        const unhealthyContainers = healthStatus.filter((c) => !c.healthy)
        if (unhealthyContainers.length > 0) {
          console.error('Unhealthy Containers detected:', unhealthyContainers)
        }
      } catch (error) {
        console.error('Error during health check:', error)
      }
    }, 10_000)
  } catch (error) {
    console.error('Error during startup:', error)
    await shutdown()
    process.exit(1)
  }
}

runAllContainers()
