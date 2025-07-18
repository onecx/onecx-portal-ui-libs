import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import * as path from 'path'

export class ImportManagerContainer extends GenericContainer {
  private containerName = 'importManager'

  constructor(image: string) {
    super(image)
    this.withNetworkAliases(this.containerName).withCopyDirectoriesToContainer([
      {
        source: path.resolve('libs/integration-tests/src/imports'),
        target: '/app',
      },
    ])
  }

  withContainerName(containerName: string): this {
    this.containerName = containerName
    return this
  }

  override async start(): Promise<StartedImportManagerContainer> {
    this.withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.containerName}: `, line))
      stream.on('err', (line) => console.error(`${this.containerName}: `, line))
      stream.on('end', () => console.log(`${this.containerName}: Stream closed`))
    }).withCommand([
      'sh',
      '-c',
      `
      cd app &&
      npm install ts-node typescript @types/node axios && 
      npx ts-node import-runner.ts`,
    ])
    return new StartedImportManagerContainer(await super.start())
  }
}

export class StartedImportManagerContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer)
  }
}
