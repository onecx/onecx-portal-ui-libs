import { exec } from 'child_process'
import { promisify } from 'util'
import updateVersion from 'nx-release/src/executors/update-version/executor'
import npmPublish from '../npm-publish/executor'
// nx-release uses an older version of @nx/devkit
// --> Type has to be imported from modules of nx-release to avoid version conflicts and type errors
import { ExecutorContext } from 'nx-release/node_modules/@nx/devkit'
import { UpdateBuildPublishExecutorOptions } from './schema'

/**
 * A custom executor that replicates the behavior of `nx-release:build-update-publish` and adds the ability to specify a custom execution target other than `build`.
 *
 * @param options Configuration options that can be passed to the executor (defined in schema.json)
 * @param context Context that the executor is running in --> provided automatically by nx
 * @returns A promise that resolves to an object with a success indicator
 */
export default async function updateBuildPublishExecutor(
  options: UpdateBuildPublishExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const buildCommand = `nx ${options.buildTarget} --project ${context.projectName}`

  console.info(`Releasing library ${context.projectName}. Building with command:`)
  console.info(`  ${buildCommand}`)
  console.info()

  // Updates version in package.json based on the VERSION environment variable --> default behavior of nx-release
  await updateVersion({}, context)

  // Builds the project using the specified build target (defaults to build) --> this was not supported in nx-release
  // The specified target must be defined in the project.json file of the respective library
  const { stdout: buildOutput, stderr } = await promisify(exec)(buildCommand)

  if (buildOutput) {
    console.log(buildOutput)
  }

  if (stderr) {
    // stderr does not result in a script interruption here because @nx/angular:package seems to wrongfully output normal logs as stderr in some cases
    // --> led to the wrongful early termination of our script
    // Instead we rely on exceptions that are being thrown by subprocesses to interrupt the script execution
    console.log('stderr', stderr)
  }

  // Publish the package to npm using additional configuration values from environment variables
  await npmPublish({}, context)

  // We can always return success from executor, because exceptions in commands leads to script interruption
  return { success: true }
}
