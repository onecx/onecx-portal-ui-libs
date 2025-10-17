import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import * as path from 'path'
import { HealthCheckableContainer } from '../../models/health-checkable-container.interface'
import { HealthCheckExecutor } from '../../models/health-check-executor.interface'
import { SkipHealthCheckExecutor } from '../../utils/health-check-executor'

export class ImportManagerContainer extends GenericContainer {
  private containerName = 'importManager'
  private importScript = 'import-runner.ts' // Default import script
  protected loggingEnabled = false

  constructor(
    image: string,
    private readonly containerInfoPath: string
  ) {
    super(image)
    this.withNetworkAliases(this.containerName)
  }

  withContainerName(containerName: string): this {
    this.containerName = containerName
    return this
  }

  withImportScript(scriptName: string): this {
    this.importScript = scriptName
    return this
  }

  enableLogging(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  override async start(): Promise<StartedImportManagerContainer> {
    this.withCopyFilesToContainer([
      {
        source: this.containerInfoPath,
        target: '/app/container-info.json',
      },
    ])
      .withCopyDirectoriesToContainer([
        {
          source: path.resolve('libs/integration-tests/src/imports'),
          target: '/app',
        },
      ])
      .withCommand([
        'sh',
        '-c',
        `cd app && npm install --no-audit --no-fund --prefer-offline ts-node typescript @types/node axios && npx ts-node ${this.importScript}`,
      ])
    if (this.loggingEnabled) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.containerName}: `, line))
        stream.on('err', (line) => console.error(`${this.containerName}: `, line))
        stream.on('end', () => console.log(`${this.containerName}: Stream closed`))
      })
    }

    return new StartedImportManagerContainer(await super.start())
  }
}

export class StartedImportManagerContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer)
  }

  /**
   * Import manager container doesn't need health checks - it runs to completion
   */
  getHealthCheckExecutor(): HealthCheckExecutor {
    return new SkipHealthCheckExecutor('Import Manager')
  }
}
