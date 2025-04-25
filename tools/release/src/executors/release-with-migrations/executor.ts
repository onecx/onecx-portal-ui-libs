import { exec } from 'child_process'
import { promisify } from 'util'
import updateVersion from 'nx-release/src/executors/update-version/executor'
import npmPublish from 'nx-release/src/executors/npm-publish/executor'
import { ExecutorContext } from 'nx-release/node_modules/@nx/devkit'
import { ReleaseWithMigrationsExecutorOptions } from './schema'

export default async function releaseWithMigrationsExecutor(
  options: ReleaseWithMigrationsExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`Releasing library ${context.projectName} with build command:`)
  console.info(`nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`)
  console.info()

  await updateVersion({}, context)

  const { stdout: buildOutput, stderr: buildError } = await promisify(exec)(
    `nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`
  )

  if (buildOutput) {
    console.log(buildOutput)
  }

  if (buildError) {
    console.error(buildError)
  } else {
    await npmPublish({}, context)
  }

  return { success: !buildError }
}
