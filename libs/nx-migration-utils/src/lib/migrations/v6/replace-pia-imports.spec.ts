import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import replacePortalIntegrationAngularImports from './replace-pia-imports';

describe('replace-pia-imports', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should replace PortalPageComponent with PortalPageComponent from @onecx/angular-utils', async () => {
    const filePath = 'src/app/page.component.ts';
    tree.write(
      filePath,
      `
        import { PortalPageComponent } from "@onecx/portal-integration-angular";
        @Component({
            selector: 'app-page',
            template: '<div></div>',
            standalone: true,
            imports: [PortalPageComponent]
        })
        export class PageComponent {}
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { PortalPageComponent } from "@onecx/angular-utils";
        @Component({
            selector: 'app-page',
            template: '<div></div>',
            standalone: true,
            imports: [PortalPageComponent]
        })
        export class PageComponent {}
      `);
  });

  it('should replace PortalViewportComponent with PortalViewportComponent from @onecx/shell-core', async () => {
    const filePath = 'src/app/viewport.component.ts';
    tree.write(
      filePath,
      `
        import { PortalViewportComponent } from "@onecx/portal-integration-angular";
        @Component({
            selector: 'app-viewport',
            template: '<div></div>',
            standalone: true,
            imports: [PortalViewportComponent]
        })
        export class ViewportComponent {}
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { PortalViewportComponent } from "@onecx/shell-core";
        @Component({
            selector: 'app-viewport',
            template: '<div></div>',
            standalone: true,
            imports: [PortalViewportComponent]
        })
        export class ViewportComponent {}
      `);
  });

  it('should replace AppConfigService with AppConfigService from @onecx/angular-integration-interface', async () => {
    const filePath = 'src/app/app-config.service.ts';
    tree.write(
      filePath,
      `
        import { AppConfigService } from "@onecx/portal-integration-angular";
        export class MyService {
          constructor(private config: AppConfigService) {}
        }
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { AppConfigService } from "@onecx/angular-integration-interface";
        export class MyService {
          constructor(private config: AppConfigService) {}
        }
      `);
  });

  it('should replace PortalApiConfiguration with PortalApiConfiguration from @onecx/angular-utils', async () => {
    const filePath = 'src/app/api-config.ts';
    tree.write(
      filePath,
      `
        import { PortalApiConfiguration } from "@onecx/portal-integration-angular";
        export const config = new PortalApiConfiguration();
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { PortalApiConfiguration } from "@onecx/angular-utils";
        export const config = new PortalApiConfiguration();
      `);
  });

  it('should replace ColumnGroupSelectionComponent with ColumnGroupSelectionComponent from @onecx/angular-accelerator', async () => {
    const filePath = 'src/app/col-group.component.ts';
    tree.write(
      filePath,
      `
        import { ColumnGroupSelectionComponent } from "@onecx/portal-integration-angular";
        export class ColGroupComponent {
          comp = ColumnGroupSelectionComponent;
        }
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { ColumnGroupSelectionComponent } from "@onecx/angular-accelerator";
        export class ColGroupComponent {
          comp = ColumnGroupSelectionComponent;
        }
      `);
  });

  it('should replace CustomGroupColumnSelectorComponent with CustomGroupColumnSelectorComponent from @onecx/angular-accelerator', async () => {
    const filePath = 'src/app/custom-group.component.ts';
    tree.write(
      filePath,
      `
        import { CustomGroupColumnSelectorComponent } from "@onecx/portal-integration-angular";
        export class CustomGroupComponent {
          comp = CustomGroupColumnSelectorComponent;
        }
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { CustomGroupColumnSelectorComponent } from "@onecx/angular-accelerator";
        export class CustomGroupComponent {
          comp = CustomGroupColumnSelectorComponent;
        }
      `);
  });

  it('should replace DataLayoutSelectionComponent with DataLayoutSelectionComponent from @onecx/angular-accelerator', async () => {
    const filePath = 'src/app/data-layout.component.ts';
    tree.write(
      filePath,
      `
        import { DataLayoutSelectionComponent } from "@onecx/portal-integration-angular";
        export class DataLayoutComponent {
          comp = DataLayoutSelectionComponent;
        }
      `
    );
    await replacePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { DataLayoutSelectionComponent } from "@onecx/angular-accelerator";
        export class DataLayoutComponent {
          comp = DataLayoutSelectionComponent;
        }
      `);
  });
});