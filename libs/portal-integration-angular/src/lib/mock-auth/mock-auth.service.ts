import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { IAuthService } from '@onecx/angular-integration-interface'
import { UserProfile } from '../model/user-profile.model'

@Injectable()
export class MockAuthService implements IAuthService {
  private mockUser: UserProfile = {
    person: {
      displayName: 'Max Musterman',
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max.mustermann@example.com',
      address: {
        street: 'Broadway',
        streetNo: '13',
        city: 'New York',
        postalCode: '123456',
        country: 'Long Country Name',
      },
      phone: {
        number: '+12 456789123',
      },
    },
    accountSettings: {
      localeAndTimeSettings: { locale: 'de', timezone: 'GMT' },
      notificationSettings: {},
      privacySettings: {},
    },
    id: 'ID_MOCK_USER',
    identityProvider: 'MOCK_TKIT_PORTAL_LIB',
    identityProviderId: 'MOCK_ID',
    roles: ['user', 'admin'],
    memberships: [
      {
        application: 'APP1',
        roleMemberships: [
          {
            role: 'user',
            permissions: [
              {
                action: 'EDIT',
                resource: 'ITEM',
                name: 'Edit item',
                key: 'ITEM#EDIT',
              },
            ],
          },
        ],
      },
    ],
    userId: 'mock-user',
  }

  currentUser$: BehaviorSubject<UserProfile | undefined> = new BehaviorSubject<UserProfile | undefined>(this.mockUser)

  getCurrentUser(): UserProfile | null {
    return this.mockUser
  }

  getUserRoles(): string[] {
    return this.mockUser.roles || []
  }

  currentUser(): UserProfile {
    return this.mockUser
  }

  public init(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  hasPermission(permissionKey: string): boolean {
    return true
  }

  logout() {
    throw new Error('Method not implemented.')
  }

  getAuthProviderName() {
    return 'MOCK_TKIT_PORTAL_LIB'
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  hasRole(role: string | string[]): boolean {
    return true
  }

  getRoles(): string[] {
    return ['tkit-portal-admin']
  }

  getIdToken(): string | null {
    return 'ID_TOKEN'
  }
}
