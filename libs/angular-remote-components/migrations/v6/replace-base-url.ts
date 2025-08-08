import { Tree } from "@nx/devkit";
import { replaceImportValuesAndModule } from "@onecx/nx-migration-utils";
import { replaceInFiles } from "@onecx/nx-migration-utils/angular";

export default async function replaceBaseUrlWithRemoteComponentConfig(tree: Tree) {
    const srcDirectoryPath = 'src';
    const filterQuery = `ImportDeclaration:has(StringLiteral[value='@onecx/angular-remote-components']) ImportSpecifier:has(Identifier[name='BASE_URL'])`;

    // Replace providers using BASE_URL Injection Token with REMOTE_COMPONENT_CONFIG provider
    // Done only in files that import BASE_URL from @onecx/angular-remote-components
    replaceInFiles(
        tree,
        srcDirectoryPath,
        `ObjectLiteralExpression > PropertyAssignment:has(Identifier[name="providers"]) > ArrayLiteralExpression ObjectLiteralExpression:has(PropertyAssignment[name.name="provide"] > Identifier[name="BASE_URL"])`,
        '{ provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) }',
        filterQuery
    );

    // Replace all occurrences of BASE_URL Injection Token in the constructor with REMOTE_COMPONENT_CONFIG Injection Token
    // Done only in files that import BASE_URL from @onecx/angular-remote-components
    replaceInFiles(
        tree,
        srcDirectoryPath,
        `Constructor > Parameter:has(Identifier[name="BASE_URL"])`,
        '@Inject(REMOTE_COMPONENT_CONFIG) private readonly baseUrl: ReplaySubject<RemoteComponentConfig>',
        filterQuery
    );

    // Replace import of BASE_URL from @onecx/angular-remote-components with REMOTE_COMPONENT_CONFIG and RemoteComponentConfig from @onecx/angular-utils
    replaceImportValuesAndModule(tree, srcDirectoryPath, [
        {
          oldModuleSpecifier: '@onecx/angular-remote-components',
          newModuleSpecifier: '@onecx/angular-utils',
          valueReplacements: [
            {
              oldValue: 'BASE_URL',
              newValue: 'REMOTE_COMPONENT_CONFIG, RemoteComponentConfig',
            }
          ]
        }
    ]);
}

