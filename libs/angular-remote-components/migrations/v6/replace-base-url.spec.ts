import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from "@nx/devkit";
import replaceBaseUrlWithRemoteComponentConfig from "./replace-base-url";

describe('replace-base-url', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })
  
  it('should replace BASE_URL Injection Token with REMOTE_COMPONENT_CONFIG from @onecx/angular-utils', async () => {
    const filePath = 'src/app/component.ts';
    tree.write(
      filePath,
      `
        import { BASE_URL, SomeOtherService } from "@onecx/angular-remote-components";
        import { ReplaySubject } from "rxjs";
        import { CommonModule } from "@angular/common";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            imports: [
                CommonModule
            ],
            providers: [
                { provide: BASE_URL, useValue: new ReplaySubject<string>(1) },
                { provide: OtherProvider, useValue: {} }
            ]
        })
        export class TestAppComponent {
            constructor( 
                @Inject(BASE_URL) private readonly baseUrl: ReplaySubject<string>,
                private someService: SomeOtherService ) {}
        }
      `
    );
    await replaceBaseUrlWithRemoteComponentConfig(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
        import { SomeOtherService } from "@onecx/angular-remote-components";
        import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from "@onecx/angular-utils";
        import { ReplaySubject } from "rxjs";
        import { CommonModule } from "@angular/common";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            imports: [
                CommonModule
            ],
            providers: [
                { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) },
                { provide: OtherProvider, useValue: {} }
            ]
        })
        export class TestAppComponent {
            constructor( 
                @Inject(REMOTE_COMPONENT_CONFIG) private readonly baseUrl: ReplaySubject<RemoteComponentConfig>,
                private someService: SomeOtherService ) {}
        }
      `
    );
  });

  it('should not replace BASE_URL when not imported from @onecx/angular-remote-components', async () => {
    const filePath = 'src/app/component2.ts';
    tree.write(
      filePath,
      `
        import { BASE_URL } from "some-other-library";
        import { ReplaySubject } from "rxjs";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            providers: [
                { provide: BASE_URL, useValue: new ReplaySubject<string>(1) }
            ]
        })
        export class TestAppComponent {
            constructor( @Inject(BASE_URL) private readonly baseUrl: ReplaySubject<string> ) {}
        }
      `
    );
    await replaceBaseUrlWithRemoteComponentConfig(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
        import { BASE_URL } from "some-other-library";
        import { ReplaySubject } from "rxjs";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            providers: [
                { provide: BASE_URL, useValue: new ReplaySubject<string>(1) }
            ]
        })
        export class TestAppComponent {
            constructor( @Inject(BASE_URL) private readonly baseUrl: ReplaySubject<string> ) {}
        }
      `
    );
  });

  it('should replace only BASE_URL and leave other imports from @onecx/angular-remote-components unchanged', async () => {
    const filePath = 'src/app/component.ts';
    tree.write(
      filePath,
      `
        import { BASE_URL, SomeOtherService, AnotherComponent } from "@onecx/angular-remote-components";
        import { ReplaySubject } from "rxjs";
        import { CommonModule } from "@angular/common";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            imports: [
                CommonModule,
                AnotherComponent
            ],
            providers: [
                { provide: BASE_URL, useValue: new ReplaySubject<string>(1) }
            ]
        })
        export class TestAppComponent {
            constructor( 
                @Inject(BASE_URL) private readonly baseUrl: ReplaySubject<string>,
                private someService: SomeOtherService
            ) {}
        }
      `
    );
    await replaceBaseUrlWithRemoteComponentConfig(tree);
    const content = tree.read(filePath)?.toString();
    expect(content).toEqualIgnoringWhitespace(
      `
        import { SomeOtherService, AnotherComponent } from "@onecx/angular-remote-components";
        import { REMOTE_COMPONENT_CONFIG, RemoteComponentConfig } from "@onecx/angular-utils";
        import { ReplaySubject } from "rxjs";
        import { CommonModule } from "@angular/common";
        import { Component, Inject } from "@angular/core";

        @Component({
            selector: 'test-app',
            templateUrl: './test-app.component.html',
            imports: [
                CommonModule,
                AnotherComponent
            ],
            providers: [
                { provide: REMOTE_COMPONENT_CONFIG, useValue: new ReplaySubject<RemoteComponentConfig>(1) }
            ]
        })
        export class TestAppComponent {
            constructor( 
                @Inject(REMOTE_COMPONENT_CONFIG) private readonly baseUrl: ReplaySubject<RemoteComponentConfig>,
                private someService: SomeOtherService
            ) {}
        }
      `
    );
  });
});