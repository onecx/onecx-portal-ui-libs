import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import replacePortalCoreModule from './replace-portal-core-module';

describe('replace-portal-core-module', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })
  
  it('should replace PortalCoreModule with AngularAcceleratorModule', async () => {
    const filePath = 'src/app/component.ts';
    tree.write(
      filePath,
      `
        import { PortalCoreModule } from "@onecx/portal-integration-angular";
        import { CommonModule } from "@angular/common";
        @Component({
            selector: 'app-example',
            templateUrl: './app-example.component.html',
            standalone: true,
            imports: [CommonModule, PortalCoreModule]
        })
        export class AppExampleComponent {}
      `
    );
    await replacePortalCoreModule(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { AngularAcceleratorModule } from "@onecx/angular-accelerator";
        import { CommonModule } from "@angular/common";
        @Component({
            selector: 'app-example',
            templateUrl: './app-example.component.html',
            standalone: true,
            imports: [CommonModule, AngularAcceleratorModule]
        })
        export class AppExampleComponent {}
      `);
  });

  it('should replace PortalCoreModule.forMicroFrontend() with AngularAcceleratorModule', async () => {
    const filePath = 'src/app/test.module.ts';
    tree.write(
      filePath,
      `
        import { PortalCoreModule } from "@onecx/portal-integration-angular";
        import { CommonModule } from "@angular/common";
        @NgModule({
            declarations: [],
            imports: [ PortalCoreModule.forMicroFrontend(), CommonModule ],
            exports: [ CommonModule]
        })
        export class TestModule {}
      `
    );
    await replacePortalCoreModule(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { AngularAcceleratorModule } from "@onecx/angular-accelerator";
        import { CommonModule } from "@angular/common";
        @NgModule({
            declarations: [],
            imports: [ AngularAcceleratorModule, CommonModule ],
            exports: [ CommonModule]
        })
        export class TestModule {}
      `);
  });

   it('should replace PortalCoreModule.forRoot() with AngularAcceleratorModule', async () => {
    const filePath = 'src/app/test.module.ts';
    tree.write(
      filePath,
      `
        import { PortalCoreModule } from "@onecx/portal-integration-angular";
        import { CommonModule } from "@angular/common";
        @NgModule({
            declarations: [],
            imports: [ PortalCoreModule.forRoot('example-string'), CommonModule ],
            exports: [ CommonModule]
        })
        export class TestModule {}
      `
    );
    await replacePortalCoreModule(tree, 'src');
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
        import { AngularAcceleratorModule } from "@onecx/angular-accelerator";
        import { CommonModule } from "@angular/common";
        @NgModule({
            declarations: [],
            imports: [ AngularAcceleratorModule, CommonModule ],
            exports: [ CommonModule]
        })
        export class TestModule {}
      `);
  });
});