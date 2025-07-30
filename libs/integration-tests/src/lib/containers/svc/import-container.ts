import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import * as path from 'path'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { AllowedContainerTypes } from '../../model/allowed-container.types'
import { CONTAINER } from '../../model/container.enum'

export class ImportManagerContainer extends GenericContainer {
  private containerName = 'importManager'

  constructor(
    image: string,
    private readonly startedContainers: Map<CONTAINER, AllowedContainerTypes>
  ) {
    super(image)
    this.withNetworkAliases(this.containerName)
  }

  withContainerName(containerName: string): this {
    this.containerName = containerName
    return this
  }

  private isKeycloakContainer(container: AllowedContainerTypes): container is StartedOnecxKeycloakContainer {
    return 'getRealm' in container && typeof container.getRealm === 'function'
  }

  override async start(): Promise<StartedImportManagerContainer> {
    const keycloakContainer = this.startedContainers.get(CONTAINER.KEYCLOAK)
    if (!keycloakContainer || !this.isKeycloakContainer(keycloakContainer)) {
      throw new Error('Keycloak container not found or invalid type in started containers')
    }

    const containerInfo = {
      keycloak: {
        realm: keycloakContainer.getRealm(),
        alias: keycloakContainer.getNetworkAliases()[0],
        port: keycloakContainer.getPort(),
      },
      services: {} as Record<string, { alias: string; port: number }>,
    }

    const relevantServices = [
      CONTAINER.WORKSPACE_SVC,
      CONTAINER.THEME_SVC,
      CONTAINER.TENANT_SVC,
      CONTAINER.PRODUCT_STORE_SVC,
      CONTAINER.PERMISSION_SVC,
    ]

    for (const [name, container] of this.startedContainers.entries()) {
      if (relevantServices.includes(name) && 'getPort' in container && 'getNetworkAliases' in container) {
        containerInfo.services[name] = {
          alias: container.getNetworkAliases()[0],
          port: container.getPort(),
        }
      }
    }

    const containerInfoPath = path.resolve('libs/integration-tests/src/imports/container-info.json')
    const fs = await import('fs/promises')
    await fs.writeFile(containerInfoPath, JSON.stringify(containerInfo, null, 2))

    this.withEnvironment({})
      .withCopyDirectoriesToContainer([
        {
          source: path.resolve('libs/integration-tests/src/imports'),
          target: '/app',
        },
      ])
      .withCommand([
        'sh',
        '-c',
        'cd app && npm install --no-audit --no-fund --prefer-offline ts-node typescript @types/node axios && npx ts-node import-runner.ts',
      ])
      .withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.containerName}: `, line))
        stream.on('err', (line) => console.error(`${this.containerName}: `, line))
        stream.on('end', () => console.log(`${this.containerName}: Stream closed`))
      })

    return new StartedImportManagerContainer(await super.start())
  }
}

export class StartedImportManagerContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer)
  }
}
