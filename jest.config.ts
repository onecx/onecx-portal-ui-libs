import { getJestProjectsAsync } from '@nx/jest'

export default async () => {
  const projects = await getJestProjectsAsync()
  return {
    projects,
  }
}
