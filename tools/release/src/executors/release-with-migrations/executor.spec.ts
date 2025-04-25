import { ExecutorContext } from 'nx-release/node_modules/@nx/devkit'

import executor from './executor'
import { ReleaseWithMigrationsExecutorOptions } from './schema'

const options: ReleaseWithMigrationsExecutorOptions = {
  buildWithMigrationsTarget: "build-with-migrations",
}
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
}

describe(' Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context)
    expect(output.success).toBe(true)
  })
})
