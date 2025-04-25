import { exec } from 'child_process'
import { promisify } from 'util'
import updateVersion from 'nx-release/src/executors/update-version/executor'
import npmPublish from 'nx-release/src/executors/npm-publish/executor'
// nx-release uses an older version of @nx/devkit 
// --> Type has to be imported from modules of nx-release to avoid version conflicts and type errors
import { ExecutorContext } from 'nx-release/node_modules/@nx/devkit'
import { ReleaseWithMigrationsExecutorOptions } from './schema'

/**
 * A custom executor that replicates the behavior of `nx-release:build-update-publish` and adds the ability to specify a custom execution target other than `build`.
 * 
 * @param options Configuration options that can be passed to the executor (defined in schema.json)
 * @param context Context that the executor is running in --> provided automatically by nx
 * @returns A promise that resolves to an object with a success indicator
 */
export default async function releaseWithMigrationsExecutor(
  options: ReleaseWithMigrationsExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`Releasing library ${context.projectName} with build command:`)
  console.info(`nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`)
  console.info()

  // Updates version in package.json based on the VERSION environment variable --> default behavior of nx-release
  await updateVersion({}, context)

  // Builds the project using the specified build target (defaults to build-migrations) --> this was not supported in nx-release
  // The specified target must be defined in the project.json file of the respective library
  // The specified target must take care of building the migrations and the library itself (e.g. by using "dependsOn": ["build"])
  const { stdout: buildOutput, stderr: buildError } = await promisify(exec)(
    `nx ${options.buildWithMigrationsTarget} --project ${context.projectName}`
  )

  if (buildOutput) {
    console.log(buildOutput)
  }

  // If the build command fails, abort the release process
  if (buildError) {
    console.error(buildError)
  } else {
    // Publish the package to npm using additional configuration values from environment variables --> default behavior of nx-release
    await npmPublish({}, context)
  }

  return { success: !buildError }
}
