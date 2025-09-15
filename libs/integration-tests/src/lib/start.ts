import { PlatformManager } from './platform/platform-manager'

async function runAllContainers() {
  const manager = new PlatformManager()
  await manager.startContainers()
}

runAllContainers()
