import type { ExecutorContext } from '@nx/devkit'
import { exec } from 'child_process'
import { promisify } from 'util'
import updateVersion from 'nx-release/src/executors/update-version/executor'
import npmPublish from 'nx-release/src/executors/npm-publish/executor'

export interface ReleaseWithMigrationsExecutorOptions {
  libName: string
  buildWithMigrationsTarget: string
}

export default async function releaseWithMigrationsExecutor(
  options: ReleaseWithMigrationsExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`Releasing library ${options.libName} with build command:`)
  console.info(`nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`)
  console.info()

  await updateVersion({}, context)

  const { stdout: buildOutput, stderr: buildError } = await promisify(exec)(
    `nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`
  );

  if(buildOutput) {
    console.log(buildOutput);
  }

  if(buildError) {
    console.log(buildError);
  }

  await npmPublish({}, context);

  return { success: !buildError }
}
