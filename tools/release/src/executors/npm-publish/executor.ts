import { execSync } from 'child_process'
import { ExecutorContext } from 'nx-release/node_modules/@nx/devkit'

import { getRoot } from 'nx-release/src/executors/helpers/projects.helpers'

import { NpmPublishExecutorSchema } from './schema'

export default async function npmPublish(options: NpmPublishExecutorSchema, context: ExecutorContext) {
  const sourceRoot = `./dist/${getRoot(context)}`
  const channel: string = process.env.CHANNEL || 'latest'
  execSync(`cd ${sourceRoot} && npm publish --tag=${channel}`)
  return {
    success: true,
  }
}
