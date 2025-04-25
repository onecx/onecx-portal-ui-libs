import { ExecutorContext } from '@nx/devkit'

import executor, { ReleaseWithMigrationsExecutorOptions } from './executor'

const options: ReleaseWithMigrationsExecutorOptions = {
  libName: "test",
  buildWithMigrationsTarget: ""
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
