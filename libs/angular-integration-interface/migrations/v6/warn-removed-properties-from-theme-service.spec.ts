import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { logger, Tree } from '@nx/devkit'
import {
  warnThemeServiceRemovedProperties,
  warnThemeServiceRemovedMethods,
} from './warn-removed-properties-from-theme-service'

describe('warn-removed-properties-from-theme-service', () => {
  let tree: Tree
  let spy: jest.SpyInstance
  const rootDir = 'src/'

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
    spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  describe('ThemeService property detection', () => {
    it('should detect baseUrlV1 property usage', async () => {
      const filePath = 'src/app/component.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      expect(spy).toHaveBeenCalledWith(
        `ThemeService property baseUrlV1 have been removed in v6. Please remove these usages and adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('ThemeService method detection', () => {
    it('should detect getThemeRef method usage', async () => {
      const filePath = 'src/app/component2.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            const themeRef = this.themeService.getThemeRef('dark');
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect loadAndApplyTheme method usage', async () => {
      const filePath = 'src/app/component3.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          async loadTheme() {
            await this.themeService.loadAndApplyTheme('light');
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'loadAndApplyTheme' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect apply method usage', async () => {
      const filePath = 'src/app/component4.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          applyCustomTheme() {
            this.themeService.apply({ primaryColor: '#ff0000' });
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'apply' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })

    it('should detect multiple method usages in one file', async () => {
      const filePath = 'src/app/component5.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          manageThemes() {
            const ref = this.themeService.getThemeRef('light');
            this.themeService.loadAndApplyTheme('dark');
            this.themeService.apply({ theme: 'custom' });
          }
        }
      `
      )

      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'loadAndApplyTheme' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'apply' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('Combined property and method detection', () => {
    it('should detect both property and method usages in same file', async () => {
      const filePath = 'src/app/component6.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {}

          manageThemes() {
            const ref = this.themeService.getThemeRef('light');
            console.log(this.themeService.baseUrlV1);
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith(
        `ThemeService property baseUrlV1 have been removed in v6. Please remove these usages and adapt your code accordingly. Found in: ${filePath}`
      )
      expect(spy).toHaveBeenCalledWith(
        `ThemeService method 'getThemeRef' has been removed in v6. Only currentTheme$ property is available. Please adapt your code accordingly. Found in: ${filePath}`
      )
    })
  })

  describe('No warnings when no removed features are used', () => {
    it('should not warn when ThemeService is used but no removed properties or methods are accessed', async () => {
      const filePath = 'src/app/component7.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';
        import { ThemeService } from '@onecx/angular-integration-interface';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor(private themeService: ThemeService) {
            // Only using the allowed currentTheme$ property
            this.themeService.currentTheme$.subscribe(theme => {
              console.log('Current theme:', theme);
            });
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).not.toHaveBeenCalled()
    })

    it('should not warn when no ThemeService is used at all', async () => {
      const filePath = 'src/app/component8.ts'
      tree.write(
        filePath,
        `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-component',
          template: ''
        })
        export class AppComponent {
          constructor() {
            console.log('No ThemeService used here');
          }
        }
      `
      )

      warnThemeServiceRemovedProperties(tree, rootDir)
      warnThemeServiceRemovedMethods(tree, rootDir)

      expect(spy).not.toHaveBeenCalled()
    })
  })
})
