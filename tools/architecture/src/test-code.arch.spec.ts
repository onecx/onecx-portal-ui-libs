import { projectFiles } from 'archunit'
import { dependenciesOf } from './dependency-graph'
import { isTestCode, testCode, tsConfig } from './workspace'

/**
 * Test code that production code uses on purpose. FakeTopic and the BroadcastChannel mock are part of the public API of
 * @onecx/accelerator (consumers use them in their tests), removing the re-exports would be a breaking change.
 */
const allowedTestCodeDependencies: Record<string, string[]> = {
  'libs/accelerator/src/index.ts': [
    'libs/accelerator/src/lib/topic/mocks/fake-topic.ts',
    'libs/accelerator/src/lib/topic/mocks/broadcast-channel.mock.ts',
  ],
}

describe('Test code', () => {
  // Specs, stories, harnesses, mocks and the angular-testing library are not meant to end up in the runtime bundles of
  // the published libraries (the mocks/ and testing/ entry points are published separately for the consumers' tests).
  it('should not be used by production code', async () => {
    const rule = projectFiles(tsConfig)
      .inPath(/^libs\//, { except: { inPath: testCode } })
      .should()
      .adhereTo(
        (file) =>
          dependenciesOf(file.path).files.every(
            (target) => !isTestCode(target) || allowedTestCodeDependencies[file.path]?.includes(target)
          ),
        'must not import specs, stories, harnesses, mocks or testing utilities'
      )

    await expect(rule).toPassAsync()
  })
})
