import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { logger, Tree } from '@nx/devkit';
import removePortalIntegrationAngularImports from './remove-pia-imports';

describe('remove-pia-imports', () => {
   let tree: Tree
  let spy: jest.SpyInstance;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  it('should remove DataViewControlsComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/test.component.ts';
    tree.write(
      filePath,
      `
        import { DataViewControlsComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private dataViewControls: DataViewControlsComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private dataViewControls: DataViewControlsComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'DataViewControlsComponent is no longer available. Consider using the InteractiveDataViewComponent (ocx-interactive-data-view) from @onecx/angular-accelerator instead.' +
      ' Found in: src/app/test.component.ts'
    )
  });

  it('should remove PageContentComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/test2.component.ts';
    tree.write(
      filePath,
      `
        import { PageContentComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private pageContent: PageContentComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private pageContent: PageContentComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'PageContentComponent is no longer available. Consider using OcxContentComponent (ocx-content) or OcxContentContainerComponent (ocx-content-container) from @onecx/angular-accelerator instead.' +
      ' Found in: src/app/test2.component.ts'
    )
  });

  it('should remove CriteriaTemplateComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/test3.component.ts';
    tree.write(
      filePath,
      `
        import { CriteriaTemplateComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private criteria: CriteriaTemplateComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private criteria: CriteriaTemplateComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'CriteriaTemplateComponent is no longer available. Consider using the SearchHeaderComponent (ocx-search-header) from @onecx/angular-accelerator instead.' +
      ' Found in: src/app/test3.component.ts'
    )
  });

  it('should remove standaloneInitializer import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/test4.util.ts';
    tree.write(
      filePath,
      `
        import { standaloneInitializer } from "@onecx/portal-integration-angular";
        export function init() {
          return standaloneInitializer;
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export function init() {
          return standaloneInitializer;
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'standaloneInitializer is no longer available. Please use standalone mode instead.' +
      ' Found in: src/app/test4.util.ts'
    )
  });

  it('should remove ButtonDialogComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/test5.component.ts';
    tree.write(
      filePath,
      `
        import { ButtonDialogComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private dialog: ButtonDialogComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private dialog: ButtonDialogComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'ButtonDialogComponent is no longer available and can be replaced by DialogInlineComponent (ocx-dialog-inline) in @onecx/angular-accelerator.' +
      ' Found in: src/app/test5.component.ts'
    );
  });
  it('should remove AnnouncementBannerComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/announcement-banner.component.ts';
    tree.write(
      filePath,
      `
        import { AnnouncementBannerComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private banner: AnnouncementBannerComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private banner: AnnouncementBannerComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'AnnouncementBannerComponent is no longer available. This is now a remote component in onecx-announcement-ui.' +
      ' Found in: src/app/announcement-banner.component.ts'
    );
  });

  it('should remove AnnouncementsApiService import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/announcements-api.service.ts';
    tree.write(
      filePath,
      `
        import { AnnouncementsApiService } from "@onecx/portal-integration-angular";
        export class TestService {
            constructor(private api: AnnouncementsApiService) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestService {
            constructor(private api: AnnouncementsApiService) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'AnnouncementsApiService is no longer available. This is now a remote component in onecx-announcement-ui.' +
      ' Found in: src/app/announcements-api.service.ts'
    );
  });

  it('should remove PortalMenuComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/portal-menu.component.ts';
    tree.write(
      filePath,
      `
        import { PortalMenuComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private menu: PortalMenuComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private menu: PortalMenuComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'PortalMenuComponent is no longer available. This is now a remote component in onecx-workspace-ui.' +
      ' Found in: src/app/portal-menu.component.ts'
    );
  });

  it('should remove PortalMenuHorizontalComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/portal-menu-horizontal.component.ts';
    tree.write(
      filePath,
      `
        import { PortalMenuHorizontalComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private menu: PortalMenuHorizontalComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private menu: PortalMenuHorizontalComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'PortalMenuHorizontalComponent is no longer available. This is now a remote component in onecx-workspace-ui.' +
      ' Found in: src/app/portal-menu-horizontal.component.ts'
    );
  });

  it('should remove AppInlineProfileComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/inline-profile.component.ts';
    tree.write(
      filePath,
      `
        import { AppInlineProfileComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private profile: AppInlineProfileComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private profile: AppInlineProfileComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'AppInlineProfileComponent is no longer available. This is now a remote component in onecx-workspace-ui.' +
      ' Found in: src/app/inline-profile.component.ts'
    );
  });

  it('should remove HelpItemEditorComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/help-item-editor.component.ts';
    tree.write(
      filePath,
      `
        import { HelpItemEditorComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private help: HelpItemEditorComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private help: HelpItemEditorComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'HelpItemEditorComponent is no longer available. This is now a remote component in onecx-help-ui.' +
      ' Found in: src/app/help-item-editor.component.ts'
    );
  });

  it('should remove NoHelpItemComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/no-help-item.component.ts';
    tree.write(
      filePath,
      `
        import { NoHelpItemComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private help: NoHelpItemComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private help: NoHelpItemComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'NoHelpItemComponent is no longer available. This is now a remote component in onecx-help-ui.' +
      ' Found in: src/app/no-help-item.component.ts'
    );
  });

  it('should remove HelpPageAPIService import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/help-page-api.service.ts';
    tree.write(
      filePath,
      `
        import { HelpPageAPIService } from "@onecx/portal-integration-angular";
        export class TestService {
            constructor(private api: HelpPageAPIService) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestService {
            constructor(private api: HelpPageAPIService) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'HelpPageAPIService is no longer available. This is now a remote component in onecx-help-ui.' +
      ' Found in: src/app/help-page-api.service.ts'
    );
  });

  it('should remove UserAvatarComponent import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/user-avatar.component.ts';
    tree.write(
      filePath,
      `
        import { UserAvatarComponent } from "@onecx/portal-integration-angular";
        export class TestComponent {
            constructor(private avatar: UserAvatarComponent) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestComponent {
            constructor(private avatar: UserAvatarComponent) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'UserAvatarComponent is no longer available. This is now a remote component in onecx-user-profile-ui.' +
      ' Found in: src/app/user-avatar.component.ts'
    );
  });

  it('should remove UserProfileAPIService import from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/user-profile-api.service.ts';
    tree.write(
      filePath,
      `
        import { UserProfileAPIService } from "@onecx/portal-integration-angular";
        export class TestService {
            constructor(private api: UserProfileAPIService) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestService {
            constructor(private api: UserProfileAPIService) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      'UserProfileAPIService is no longer available. This is now a remote component in onecx-user-profile-ui.' +
      ' Found in: src/app/user-profile-api.service.ts'
    );
  });

   it('should remove all other imports from @onecx/portal-integration-angular and warn', async () => {
    const filePath = 'src/app/other-file.service.ts';
    tree.write(
      filePath,
      `
        import { UserProfileAPIService, OtherImport, OtherImport2 } from "@onecx/portal-integration-angular";
        export class TestService {
            constructor(private otherImport: OtherImport) {}
        }
      `
    );
    await removePortalIntegrationAngularImports(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        export class TestService {
            constructor(private otherImport: OtherImport) {}
        }
    `);
    expect(spy).toHaveBeenCalledWith(
      '@onecx/portal-integration-angular was removed. Please adapt the code accordingly.' +
      ' Found in: src/app/other-file.service.ts'
    );
  });
});