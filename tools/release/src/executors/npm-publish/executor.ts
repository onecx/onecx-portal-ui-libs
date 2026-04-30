import { execSync } from 'node:child_process'

import { NpmPublishExecutorSchema } from './schema'

interface ExecutorContextLike {
  projectName: string
  projectsConfigurations: { projects: Record<string, { root: string }> }
}

export default async function npmPublish(options: NpmPublishExecutorSchema, context: ExecutorContextLike) {
  const projectRoot = context.projectsConfigurations.projects[context.projectName].root;
  const sourceRoot = `./dist/${projectRoot}`
  
  const channel: string = process.env.CHANNEL || 'latest'
  execSync(`cd ${sourceRoot} && npm publish --tag=${channel}`)
  return {
    success: true,
  }
}
