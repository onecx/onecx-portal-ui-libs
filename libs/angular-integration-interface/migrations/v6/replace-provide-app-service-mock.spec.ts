import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import replaceProvideAppServiceMock from './replace-provide-app-service-mock';

describe('replace-provide-app-service-mock', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })
  
  it('should replace provideAppServiceMock with provideAppStateServiceMock', async () => {
    const filePath = 'src/app/component.ts';
    tree.write(
      filePath,
      `
      import { provideAppServiceMock } from '@onecx/angular-integration-interface/mocks';
      import { OtherProvider } from 'other';
      describe('MultipleProviders', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
              OtherProvider,
            ]
          });
        });
      });
      `
    );
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
      import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks';
      import { OtherProvider } from 'other';
      describe('MultipleProviders', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppStateServiceMock(),
              OtherProvider,
            ]
          });
        });
      });
      `);
  });

  it('should not replace if provideAppServiceMock is imported from a different package', async () => {
    const filePath = 'src/app/component2.ts';
    const expectedCode =  `
      import { provideAppServiceMock } from 'some-other-package';
      import { TestBed } from '@angular/core/testing';
      describe('OtherService', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
            ]
          });
        });
      });`
    tree.write(filePath, expectedCode);
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(expectedCode);
  });

  it('should replace provideAppServiceMock only when imported from the correct package, even with alias', async () => {
    const filePath = 'src/app/component3.ts';
    tree.write(
      filePath,
      `
      import { provideAppServiceMock as mockProvider } from '@onecx/angular-integration-interface/mocks';
      describe('Aliased', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              mockProvider(),
            ]
          });
        });
      });
      `
    );
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(`
      import { provideAppStateServiceMock as mockProvider } from '@onecx/angular-integration-interface/mocks';
      describe('Aliased', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              mockProvider(),
            ]
          });
        });
      });
      `);
  });

  it('should not replace if provideAppServiceMock is not imported', async () => {
    const filePath = 'src/app/component4.ts';
    const expectedCode = `
      import { SomethingElse } from '@onecx/angular-integration-interface/mocks';
      describe('NoProviderImport', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            providers: [
              provideAppServiceMock(),
            ]
          });
        });
      });
      `
    tree.write(filePath, expectedCode);
    await replaceProvideAppServiceMock(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(expectedCode);
  });
});
