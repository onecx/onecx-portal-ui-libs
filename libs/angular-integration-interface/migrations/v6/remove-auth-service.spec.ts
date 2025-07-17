import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, logger } from '@nx/devkit'
import removeAuthService from './remove-auth-service';

describe('remove-auth-service', () => {
  let tree: Tree
  let spy: jest.SpyInstance;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  afterEach(() => {
    spy.mockRestore()
  })
  it('should remove AUTH_SERVICE import when imported from @onecx/angular-integration-interface', async () => {
    tree.write(
      'src/app/header.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE, otherImport } from "@onecx/angular-integration-interface";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";
      import { otherImport } from "@onecx/angular-integration-interface";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header.component.ts'
    )
  });

   it('should remove AUTH_SERVICE import when imported from @onecx/portal-integration-angular', async () => {
    tree.write(
      'src/app/header2.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "@onecx/portal-integration-angular";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header2.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";    
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header2.component.ts'
    )
  });

  it('should not remove AUTH_SERVICE import if imported from another package', async () => {
    tree.write(
      'src/app/header3.component.ts',
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "other-package";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/header3.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { NgModule } from "@angular/core";
      import { AUTH_SERVICE } from "other-package";
      import { KeycloakAuthService } from "./keycloak-auth.service";
      import { OtherProvider } from "other";

      @NgModule({
        providers: [
          {
            provide: AUTH_SERVICE,
            useClass: KeycloakAuthService
          },
          otherProvider
        ]
      })
      export class AuthModule {}
      `
    );
    expect(spy).not.toHaveBeenCalledWith(
      'AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead. Found in: src/app/header3.component.ts'
    )
  });

  it('should remove IAuthService import when imported from @onecx/angular-integration-interface', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "@onecx/angular-integration-interface";

      authService.getIdToken();

      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      authService.getIdToken();
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });

   it('should remove IAuthService import when imported from @onecx/portal-integration-angular', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "@onecx/portal-integration-angular";

      authService.getIdToken();

      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      authService.getIdToken();
      `
    );
    expect(spy).toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });

  it('should not remove IAuthService import when imported from another package', async () => {
    tree.write(
      'src/app/test.component.ts',
      `
      import { IAuthService } from "other-package";

      constructor(authService: IAuthService) {
        authService.getIdToken();
      }
      `
    );
   
    await removeAuthService(tree);
    const content = tree.read('src/app/test.component.ts')?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
      import { IAuthService } from "other-package";

      constructor(authService: IAuthService) {
        authService.getIdToken();
      }
      `
    );
    expect(spy).not.toHaveBeenCalledWith(
      'IAuthService is no longer available. Please adapt the usages accordingly. Found in: src/app/test.component.ts'
    )
  });
});