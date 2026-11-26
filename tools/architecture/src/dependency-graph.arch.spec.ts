import { extractGraph } from 'archunit'
import { dependenciesOf, dependencyGraph } from './dependency-graph'
import { libraryOf, tsConfig } from './workspace'

// The rules look up the dependencies of each ArchUnitTS file in this graph, a file missing here would pass every rule.
describe('Dependency graph', () => {
  it('should contain every library file that ArchUnitTS checks', async () => {
    const archUnitFiles = new Set((await extractGraph(tsConfig)).map((edge) => edge.source))
    const libraryFiles = [...archUnitFiles].filter((file) => libraryOf(file) && /\.tsx?$/.test(file))

    expect(libraryFiles.length).toBeGreaterThan(0)
    expect(libraryFiles.filter((file) => !dependencyGraph().has(file))).toEqual([])
  })

  it('should contain re-exports as dependencies', () => {
    expect(dependenciesOf('libs/accelerator/src/index.ts').files).toContain('libs/accelerator/src/lib/topic/topic.ts')
  })

  it('should resolve the @onecx path aliases to the entry points', () => {
    expect(dependenciesOf('libs/integration-interface/src/index.ts').files.length).toBeGreaterThan(0)
    const usesAccelerator = [...dependencyGraph().entries()].some(
      ([file, { files }]) =>
        file.startsWith('libs/integration-interface/') && files.includes('libs/accelerator/src/index.ts')
    )
    expect(usesAccelerator).toBe(true)
  })
})
