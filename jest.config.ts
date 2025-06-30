import { getJestProjects } from '@nx/jest'

export default {
  projects: getJestProjects(),
  testPathIgnorePatterns: ['<rootDir>/libs/integration-tests/'],
}
