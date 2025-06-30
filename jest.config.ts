import { getJestProjects } from '@nx/jest'

export default {
  projects: getJestProjects(),
  //TODO: Remove this line once the Docker pull rate limit issue is resolved
  testPathIgnorePatterns: ['<rootDir>/libs/integration-tests/'],
}
