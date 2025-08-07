import { Tree } from "@nx/devkit";
import { replaceImportValuesAndModule } from '../../utils/import-statements.utils';

export default async function replacePortalIntegrationAngularImports(tree: Tree, srcDirectoryPath: string) {

  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/portal-integration-angular',
      newModuleSpecifier: '@onecx/angular-accelerator',
      valueReplacements: [
        {
          oldValue: 'ColumnGroupSelectionComponent',
          newValue: 'ColumnGroupSelectionComponent',
        },
        {
          oldValue: 'CustomGroupColumnSelectorComponent',
          newValue: 'CustomGroupColumnSelectorComponent',
        },
        {
          oldValue: 'DataLayoutSelectionComponent',
          newValue: 'DataLayoutSelectionComponent',
        },
        {
          oldValue: 'DataListGridComponent',
          newValue: 'DataListGridComponent',
        },
        {
          oldValue: 'DataListGridSortingComponent',
          newValue: 'DataListGridSortingComponent',
        },
        {
          oldValue: 'DataTableComponent',
          newValue: 'DataTableComponent',
        },
        {
          oldValue: 'DataViewComponent',
          newValue: 'DataViewComponent',
        },
        {
          oldValue: 'DiagramComponent',
          newValue: 'DiagramComponent',
        },
        {
          oldValue: 'FilterViewComponent',
          newValue: 'FilterViewComponent',
        },
        {
          oldValue: 'GroupByCountDiagramComponent',
          newValue: 'GroupByCountDiagramComponent',
        },
        {
          oldValue: 'InteractiveDataViewComponent',
          newValue: 'InteractiveDataViewComponent',
        },
        {
          oldValue: 'LifecycleComponent',
          newValue: 'LifecycleComponent',
        },
        {
          oldValue: 'PageHeaderComponent',
          newValue: 'PageHeaderComponent',
        }, 
        {
          oldValue: 'SearchHeaderComponent',
          newValue: 'SearchHeaderComponent',
        },
        {
          oldValue: 'DialogMessageContentComponent',
          newValue: 'DialogMessageContentComponent',
        },
        {
          oldValue: 'DialogInlineComponent',
          newValue: 'DialogInlineComponent',
        },
        {
          oldValue: 'DialogFooterComponent',
          newValue: 'DialogFooterComponent',
        },
        {
          oldValue: 'DialogContentComponent',
          newValue: 'DialogContentComponent',
        },
        {
          oldValue: 'GlobalErrorComponent',
          newValue: 'GlobalErrorComponent',
        },
        {
          oldValue: 'LoadingIndicatorComponent',
          newValue: 'LoadingIndicatorComponent',
        },
        {
          oldValue: 'LoadingIndicatorDirective',
          newValue: 'LoadingIndicatorDirective',
        },
        {
          oldValue: 'BasicDirective',
          newValue: 'BasicDirective',
        },
        {
          oldValue: 'RelativeDatePipe',
          newValue: 'RelativeDatePipe',
        },
        {
          oldValue: 'AdvancedDirective',
          newValue: 'AdvancedDirective',
        },
        {
          oldValue: 'OcxContentContainerDirective',
          newValue: 'OcxContentContainerDirective',
        },
        {
          oldValue: 'OcxContentDirective',
          newValue: 'OcxContentDirective',
        },
        {
          oldValue: 'IfBreakpointDirective',
          newValue: 'IfBreakpointDirective',
        },
        {
          oldValue: 'IfPermissionDirective',
          newValue: 'IfPermissionDirective',
        },
        {
          oldValue: 'SrcDirective',
          newValue: 'SrcDirective',
        },
        {
          oldValue: 'TooltipOnOverflowDirective',
          newValue: 'TooltipOnOverflowDirective',
        },
        {
          oldValue: 'ExportDataService',
          newValue: 'ExportDataService',
        },
        {
          oldValue: 'PortalDialogService',
          newValue: 'PortalDialogService',
        },
        {
          oldValue: 'ImageLogoUrlUtils',
          newValue: 'ImageLogoUrlUtils',
        },
        {
          oldValue: 'DialogContentHarness',
          newValue: 'DialogContentHarness',
        },
        {
          oldValue: 'DialogFooterHarness',
          newValue: 'DialogFooterHarness',
        },
        {
          oldValue: 'DialogInlineHarness',
          newValue: 'DialogInlineHarness',
        },
        {
          oldValue: 'DialogMessageContentHarness',
          newValue: 'DialogMessageContentHarness',
        },
      ],
    },
  ]);

  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/portal-integration-angular',
      newModuleSpecifier: '@onecx/angular-utils',
      valueReplacements: [
        {
          oldValue: 'PortalPageComponent',
          newValue: 'PortalPageComponent',
        },
        {
          oldValue: 'PortalApiConfiguration',
          newValue: 'PortalApiConfiguration',
        },
      ],
    },
  ]);

  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/portal-integration-angular',
      newModuleSpecifier: '@onecx/angular-integration-interface',
      valueReplacements: [
        {
          oldValue: 'AppConfigService',
          newValue: 'AppConfigService',
        },
        {
          oldValue: 'AppStateService',
          newValue: 'AppStateService',
        },
        {
          oldValue: 'ConfigurationService',
          newValue: 'ConfigurationService',
        },
        {
          oldValue: 'UserService',
          newValue: 'UserService',
        },
        {
          oldValue: 'PortalMessageService',
          newValue: 'PortalMessageService',
        },
        {
          oldValue: 'ThemeService',
          newValue: 'ThemeService',
        },
        {
          oldValue: 'RemoteComponentsService',
          newValue: 'RemoteComponentsService',
        },
        {
          oldValue: 'CONFIG_KEY',
          newValue: 'CONFIG_KEY',
        },
        {
          oldValue: 'LibConfig',
          newValue: 'LibConfig',
        },
        {
          oldValue: 'MfeInfo',
          newValue: 'MfeInfo',
        },
        {
          oldValue: 'Theme',
          newValue: 'Theme',
        },
        {
          oldValue: 'APP_CONFIG',
          newValue: 'APP_CONFIG',
        },
        {
          oldValue: 'AUTH_SERVICE',
          newValue: 'AUTH_SERVICE',
        },
        {
          oldValue: 'SANITY_CHECK',
          newValue: 'SANITY_CHECK',
        },
        {
          oldValue: 'APPLICATION_NAME',
          newValue: 'APPLICATION_NAME',
        },

      ],
    },
  ]);
  


}