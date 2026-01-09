import { execSync } from 'child_process'

import { ExecutorContext } from '@nx/devkit'
import { NpmPublishExecutorSchema } from './schema'

export default async function npmPublish(options: NpmPublishExecutorSchema, context: ExecutorContext) {
  const projectRoot = context.projectsConfigurations.projects[context.projectName].root;
  const sourceRoot = `./dist/${projectRoot}`
  
  const channel: string = process.env.CHANNEL || 'latest'
  execSync(`cd ${sourceRoot} && npm publish --tag=${channel}`)
  return {
    success: true,
  }
}
