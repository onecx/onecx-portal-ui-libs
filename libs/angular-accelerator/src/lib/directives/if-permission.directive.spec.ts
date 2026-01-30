import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { BehaviorSubject, of } from 'rxjs'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DivHarness } from '@onecx/angular-testing'
import { IfPermissionDirective } from './if-permission.directive'

import * as loggerUtils from '../utils/logger.utils'

// Simple component to test the directive
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div id="visibleDiv" *ocxIfPermission="'test-permission'">Visible</div> `,
})
class SimpleComponent {}

// Component with multiple permissions
@Component({
  selector: 'ocx-simple',
  standalone: false,
  template: ` <div *ocxIfPermission="['test-permission', 'second-permission']">Visible</div> `,
})
class MultiplePermissionComponent {}

// Component with else template
@Component({
  selector: 'ocx-with-else',
  standalone: false,
  template: `
    <div id="visibleDiv" *ocxIfPermission="'test-permission'; elseTemplate: elseBlock">Visible with Else</div>
    <ng-template #elseBlock>
      <div id="elseDiv">Else Block</div>
    </ng-template>
  `,
})
class WithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable'
@Component({
  selector: 'ocx-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class OnMissingDisabledComponent {}

// Component with provided permissions array including the required permission
@Component({
  selector: 'ocx-with-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission
@Component({
  selector: 'ocx-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class WithMissingProvidedPermissionsComponent {}

// Component with undefined permission
@Component({
  selector: 'ocx-with-undefined',
  standalone: false,
  template: ` <div *ocxIfPermission="">Show not show</div>`,
})
class WithUndefinedPermissionComponent {}

// Simple component to test the negate functionality of the directive
@Component({
  selector: 'ocx-negate-simple',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-permission'">Visible</div> `,
})
class NegateSimpleComponent {}

// Component with else template for negate
@Component({
  selector: 'ocx-negate-with-else',
  standalone: false,
  template: `
    <div *ocxIfNotPermission="'missing-permission'; elseTemplate: elseBlock">Hidden</div>
    <ng-template #elseBlock><div>Else Block</div></ng-template>
  `,
})
class NegateWithElseTemplateComponent {}

// Component with onMissingPermission set to 'disable' for negate
@Component({
  selector: 'ocx-negate-on-missing-disabled',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'test-disabled'; onMissingPermission: 'disable'">Disabled</div>`,
})
class NegateOnMissingDisabledComponent {}

// Component with provided permissions array including the required permission for negate
@Component({
  selector: 'ocx-negate-with-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'provided-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithProvidedPermissionsComponent {}

// Component with provided permissions array not including the required permission for negate
@Component({
  selector: 'ocx-negate-with-missing-provided',
  standalone: false,
  template: ` <div *ocxIfNotPermission="'missing-permission'; permissions: ['provided-permission']">
    Show with provided-permission
  </div>`,
})
class NegateWithMissingProvidedPermissionsComponent {}

// Component with undefined permission for negate
@Component({
  selector: 'ocx-negate-with-undefined',
  standalone: false,
  template: ` <div *ocxIfNotPermission="">Show not show</div>`,
})
class NegateWithUndefinedPermissionComponent {}

describe('IfPermissionDirective', () => {
  let fixture: ComponentFixture<any>
  let mockPermissionChecker: jest.Mocked<HasPermissionChecker>
  let getPermissionsMock: jest.Mock
  let loggerWarnSpy: jest.Mock
  let loggerDebugSpy: jest.Mock

  const getDivOrNull = async () => {
    if (!fixture) return null
    const loader = TestbedHarnessEnvironment.loader(fixture)
    return loader.getHarnessOrNull(DivHarness)
  }

  const getVisibleDivOrNull = async () => {
    if (!fixture) return null
    const loader = TestbedHarnessEnvironment.loader(fixture)
    return loader.getHarnessOrNull(DivHarness.with({ id: 'visibleDiv' }))
  }

  const getElseDivOrNull = async () => {
    if (!fixture) return null
    const loader = TestbedHarnessEnvironment.loader(fixture)
    return loader.getHarnessOrNull(DivHarness.with({ id: 'elseDiv' }))
  }

  beforeEach(() => {
    mockPermissionChecker = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }

    TestBed.configureTestingModule({
      declarations: [
        SimpleComponent,
        WithElseTemplateComponent,
        OnMissingDisabledComponent,
        WithProvidedPermissionsComponent,
        WithUndefinedPermissionComponent,
        WithMissingProvidedPermissionsComponent,
        MultiplePermissionComponent,
        NegateSimpleComponent,
        NegateWithElseTemplateComponent,
        NegateOnMissingDisabledComponent,
        NegateWithProvidedPermissionsComponent,
        NegateWithUndefinedPermissionComponent,
        NegateWithMissingProvidedPermissionsComponent,
        IfPermissionDirective,
      ],
      providers: [{ provide: HAS_PERMISSION_CHECKER, useValue: mockPermissionChecker }, provideUserServiceMock()],
    })

    loggerWarnSpy = jest.fn()
    loggerDebugSpy = jest.fn()
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue({
      debug: loggerDebugSpy as any,
      info: jest.fn() as any,
      warn: loggerWarnSpy as any,
      error: jest.fn() as any,
    })

    getPermissionsMock = mockPermissionChecker.getPermissions as jest.Mock
  })

  it('should throw error if neither UserService nor HasPermissionChecker is provided', () => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      declarations: [SimpleComponent, IfPermissionDirective],
      providers: [
        {
          provide: HAS_PERMISSION_CHECKER,
          useValue: null,
        },
        {
          provide: UserService,
          useValue: null,
        },
      ],
    })

    expect(() => {
      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()
    }).toThrow('IfPermission requires UserService or HasPermissionChecker to be provided!')
  })

  it('should be usable with array of permissions', async () => {
    getPermissionsMock.mockReturnValue(of(['test-permission', 'second-permission']))

    fixture = TestBed.createComponent(MultiplePermissionComponent)
    fixture.detectChanges()

    const visibleElement = await getDivOrNull()
    expect(await visibleElement?.getText()).toContain('Visible')
  })

  describe('ifPermission', () => {
    it('should display the element if user has permission', async () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      const visibleElement = await getDivOrNull()
      expect(await visibleElement?.getText()).toContain('Visible')
    })

    it('should not display the element if user does not have permission', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = await getVisibleDivOrNull()
      expect(hiddenElement).toBeNull()
    })

    it('should display the else block if user does not have permission', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = await getElseDivOrNull()
      expect(elseBlock).toBeTruthy()
      expect(await elseBlock!.getText()).toContain('Else Block')
    })

    it('should display disabled element if user does not have permission', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      const disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).not.toBeNull()
    })

    it('should use provided permissions array to check permissions', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = await getDivOrNull()
      expect(visibleDiv).toBeTruthy()
      expect(await visibleDiv?.getText()).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const element = await getDivOrNull()
      expect(element).toBeNull()
      expect(loggerDebugSpy).toHaveBeenCalledWith('No permission in overwrites for:', ['missing-permission'])
    })

    it('should not show if permission is undefined', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(WithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = await getDivOrNull()
      expect(element).toBeNull()
    })

    it('should react to permission changes', async () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(SimpleComponent)
      fixture.detectChanges()

      let element = await getDivOrNull()
      expect(element).toBeNull()

      permissionSubject$.next(['test-permission'])
      fixture.detectChanges()

      element = await getDivOrNull()
      expect(await element?.getText()).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', async () => {
      const permissionSubject$ = new BehaviorSubject<string[]>([])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(OnMissingDisabledComponent)
      fixture.detectChanges()

      let disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).not.toBeNull()

      permissionSubject$.next(['test-disabled'])
      fixture.detectChanges()

      disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).toBeNull()
    })
  })

  describe('ifNotPermission', () => {
    it('should not display the element if user has permission', async () => {
      getPermissionsMock.mockReturnValue(of(['test-permission']))

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      const visibleElement = await getDivOrNull()
      expect(visibleElement).toBeNull()
    })

    it('should display the element if user does not have permission', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const hiddenElement = await getDivOrNull()
      expect(await hiddenElement?.getText()).toContain('Hidden')
    })

    it('should display the else block if user has permission', async () => {
      getPermissionsMock.mockReturnValue(of(['missing-permission']))

      fixture = TestBed.createComponent(NegateWithElseTemplateComponent)
      fixture.detectChanges()

      const elseBlock = await getDivOrNull()
      expect(await elseBlock?.getText()).toContain('Else Block')
    })

    it('should display disabled element if user has permission', async () => {
      getPermissionsMock.mockReturnValue(of(['test-disabled']))

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      const disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).not.toBeNull()
    })

    it('should use provided permissions array to check permissions', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      const visibleDiv = await getDivOrNull()
      expect(visibleDiv).toBeTruthy()
      expect(await visibleDiv?.getText()).toContain('Show with provided-permission')
    })

    it('should log if provided permissions array does not contain permission', () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithMissingProvidedPermissionsComponent)
      fixture.detectChanges()

      expect(loggerDebugSpy).toHaveBeenCalledWith('No permission in overwrites for:', ['missing-permission'])
    })

    it('should not show if permission is undefined', async () => {
      getPermissionsMock.mockReturnValue(of([]))

      fixture = TestBed.createComponent(NegateWithUndefinedPermissionComponent)
      fixture.detectChanges()

      const element = await getDivOrNull()
      expect(element).toBeNull()
    })

    it('should react to permission changes', async () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-permission'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateSimpleComponent)
      fixture.detectChanges()

      let element = await getDivOrNull()
      expect(element).toBeNull()

      permissionSubject$.next([])
      fixture.detectChanges()

      element = await getDivOrNull()
      expect(await element?.getText()).toContain('Visible')
    })

    it('should remove disabled attribute when permission is granted', async () => {
      const permissionSubject$ = new BehaviorSubject<string[]>(['test-disabled'])

      getPermissionsMock.mockImplementation((_permissions: string[] | string) => {
        return permissionSubject$.asObservable()
      })

      fixture = TestBed.createComponent(NegateOnMissingDisabledComponent)
      fixture.detectChanges()

      let disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).not.toBeNull()

      permissionSubject$.next([])
      fixture.detectChanges()

      disabledDiv = await getDivOrNull()
      expect(disabledDiv).toBeTruthy()
      expect(await disabledDiv?.getText()).toContain('Disabled')
      expect(await disabledDiv?.host().then((h) => h.getAttribute('disabled'))).toBeNull()
    })
  })
})
