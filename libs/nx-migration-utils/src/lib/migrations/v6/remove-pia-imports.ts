import { Tree, visitNotIgnoredFiles } from '@nx/devkit';
import { printWarnings } from '../../utils/print-warnings.utils';
import { removeImportSpecifierFromImport } from '../../utils/modification/remove-import-specifier.utils';
import { isImportSpecifierInContent } from '../../utils/validation/is-import-in-file-content.utils';
import { removeImportsByModuleSpecifier } from '../../utils/import-statements.utils';
import { importPattern } from '../../utils/patterns.utils';
import { query, ast } from '@phenomnomnominal/tsquery';

const IMPORT_PATH = '@onecx/portal-integration-angular';
const COMPONENTS_TO_REMOVE = [
  {
    importName: 'DataViewControlsComponent',
    warning:
      'DataViewControlsComponent is no longer available. Consider using the InteractiveDataViewComponent (ocx-interactive-data-view) from @onecx/angular-accelerator instead.'
  },
  {
    importName: 'PageContentComponent',
    warning:
      'PageContentComponent is no longer available. Consider using OcxContentComponent (ocx-content) or OcxContentContainerComponent (ocx-content-container) from @onecx/angular-accelerator instead.'
  },
  {
    importName: 'CriteriaTemplateComponent',
    warning:
      'CriteriaTemplateComponent is no longer available. Consider using the SearchHeaderComponent (ocx-search-header) from @onecx/angular-accelerator instead.'
  },
  {
    importName: 'standaloneInitializer',
    warning:
      'standaloneInitializer is no longer available. Please use standalone mode instead.'
  },
  {
    importName: 'ButtonDialogComponent',
    warning:
      'ButtonDialogComponent is no longer available and can be replaced by DialogInlineComponent (ocx-dialog-inline) in @onecx/angular-accelerator.'
  },
  {
    importName: 'MenuService',
    warning:
      'MenuService is no longer available. If you want to load menu items, please create an endpoint in the BFF of your app and implement your own function.'
  },
  {
    importName: 'PortalMenuComponent',
    warning:
      'PortalMenuComponent is no longer available. This is now a remote component in onecx-workspace-ui.'
  },
  {
    importName: 'PortalMenuHorizontalComponent',
    warning:
      'PortalMenuHorizontalComponent is no longer available. This is now a remote component in onecx-workspace-ui.'
  },
  {
    importName: 'AppInlineProfileComponent',
    warning:
      'AppInlineProfileComponent is no longer available. This is now a remote component in onecx-workspace-ui.'
  },
  {
    importName: 'AnnouncementBannerComponent',
    warning:
      'AnnouncementBannerComponent is no longer available. This is now a remote component in onecx-announcement-ui.'
  },
  {
    importName: 'AnnouncementsApiService',
    warning:
      'AnnouncementsApiService is no longer available. This is now a remote component in onecx-announcement-ui.'
  },
  {
    importName: 'HelpItemEditorComponent',
    warning:
      'HelpItemEditorComponent is no longer available. This is now a remote component in onecx-help-ui.'
  },
  {
    importName: 'NoHelpItemComponent',
    warning:
      'NoHelpItemComponent is no longer available. This is now a remote component in onecx-help-ui.'
  },
  {
    importName: 'HelpPageAPIService',
    warning:
      'HelpPageAPIService is no longer available. This is now a remote component in onecx-help-ui.'
  },
  {
    importName: 'UserAvatarComponent',
    warning:
      'UserAvatarComponent is no longer available. This is now a remote component in onecx-user-profile-ui.'
  },
  {
    importName: 'UserProfileAPIService',
    warning:
      'UserProfileAPIService is no longer available. This is now a remote component in onecx-user-profile-ui.'
  },
  {
    importName: 'PortalFooterComponent',
    warning:
      'PortalFooterComponent is no longer available. Please adapt the code accordingly.'
  },
  {
    importName: 'PortalHeaderComponent',
    warning:
      'PortalHeaderComponent is no longer available. Please adapt the code accordingly.'
  },
  {
    importName: 'PortalViewportComponent',
    warning:
      'PortalViewportComponent is no longer available. Please adapt the code accordingly.'
  }
];

export default async function removePortalIntegrationAngularImports(tree: Tree, srcDirectoryPath: string) {
  const affectedFilesMap = new Map<string, Set<string>>();
  COMPONENTS_TO_REMOVE.forEach(({ importName }) => {
    affectedFilesMap.set(importName, new Set<string>());
  });

  const remainingFiles = new Set<string>();

  visitNotIgnoredFiles(tree, srcDirectoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;
    COMPONENTS_TO_REMOVE.forEach(({ importName }) => {
      if (isImportSpecifierInContent(fileContent, IMPORT_PATH, importName)) {
        removeImportSpecifierFromImport(tree, filePath, IMPORT_PATH, importName);
        affectedFilesMap.get(importName)?.add(filePath);
      }
    });
    // If there are still imports from the module after specific removals, remove all other imports from portal-integration-angular
    const contentAst = ast(fileContent);
    if (query(contentAst, importPattern(IMPORT_PATH)).length > 0) {
      remainingFiles.add(filePath);
    }
  });

  COMPONENTS_TO_REMOVE.forEach(({ importName, warning }) => {
    printWarnings(warning, Array.from(affectedFilesMap.get(importName) ?? []));
  });

  if (remainingFiles.size > 0) {
    removeImportsByModuleSpecifier(tree, srcDirectoryPath, IMPORT_PATH);
    printWarnings(
      '@onecx/portal-integration-angular was removed. Please adapt the code accordingly.',
      Array.from(remainingFiles)
    );
  }
}