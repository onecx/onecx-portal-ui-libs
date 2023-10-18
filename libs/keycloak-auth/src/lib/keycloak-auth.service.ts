import { Inject, Injectable, Optional } from '@angular/core'
import {
  ConfigurationService,
  CONFIG_KEY_KEYCLOAK_CLIENT_ID,
  CONFIG_KEY_KEYCLOAK_ENABLE_SILENT_SSO,
  CONFIG_KEY_KEYCLOAK_REALM,
  CONFIG_KEY_KEYCLOAK_URL,
  IAuthService,
  UserProfile,
  UserProfileAPIService,
} from '@onecx/portal-integration-angular'
import { KeycloakEventType, KeycloakOptions, KeycloakService } from 'keycloak-angular'
import { KeycloakConfig } from 'keycloak-js'
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { KEYCLOAK_AUTH_CONFIG, KeycloakAuthModuleConfig } from './keycloak-auth.module'

const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'
const TKIT_USER_PROFILE_LS = 'onecx_user_profile'

@Injectable()
export class KeycloakAuthService implements IAuthService {
  currentUser$ = new BehaviorSubject<UserProfile | undefined>(undefined)
  private userProfile: UserProfile | null = null
  private userPermissions: string[] = []

  constructor(
    private keycloakService: KeycloakService,
    private configService: ConfigurationService,
    private userProfileAPIService: UserProfileAPIService,
    @Inject(KEYCLOAK_AUTH_CONFIG) @Optional() private kcModuleConfig: KeycloakAuthModuleConfig
  ) {}

  public init(): Promise<boolean> {
    // console.log('Keycloak Auth initialization')
    // load previous tokens, saved after successful login of keycloak success callback
    let token = localStorage.getItem(KC_TOKEN_LS)
    let idToken = localStorage.getItem(KC_ID_TOKEN_LS)
    let refreshToken = localStorage.getItem(KC_REFRESH_TOKEN_LS)
    if (token && refreshToken) {
      const parsedToken = JSON.parse(atob(refreshToken.split('.')[1]))
      // console.log(`Got tokens in LC ${parsedToken.exp} ${parsedToken.sub}`)
      if (parsedToken.exp * 1000 < new Date().getTime()) {
        //refresh expired, drop everything
        // console.log(`Refresh token expired`)
        token = null
        refreshToken = null
        idToken = null
        this.clearKCStateFromLocalstorage()
      }
    }

    this.setupEventListener()

    // try constructing the KC config from values in env
    let kcConfig: KeycloakConfig | string = this.getValidKCConfig()
    // If any of the required props is missing, fallback to loading KC conf from file
    if (!kcConfig.clientId || !kcConfig.realm || !kcConfig.url) {
      kcConfig = './assets/keycloak.json'
    }

    const enableSilentSSOCheck = this.configService.getProperty(CONFIG_KEY_KEYCLOAK_ENABLE_SILENT_SSO) === 'true'

    const kcOptions: KeycloakOptions = {
      loadUserProfileAtStartUp: false,
      config: kcConfig,
      initOptions: {
        // onLoad: "login-required",
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: enableSilentSSOCheck ? this.getSilentSSOUrl() : undefined,
        idToken: idToken || undefined,
        refreshToken: refreshToken || undefined,
        token: token || undefined,
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/assets'],
    }

    // console.log(`INit KC with ${JSON.stringify(kcOptions, null, 2)}`)
    return (
      this.keycloakService
        .init(kcOptions)
        .catch((err) => {
          console.log(`Keycloak err: ${err}, try force login`)
          return this.keycloakService.login()
        })
        .then((loginOk) => {
          // this will be false if our silent login did not work
          // console.log(`Keycloak init done, loginOk?: ${loginOk}`)
          if (loginOk) {
            return this.keycloakService.getToken()
          } else {
            // we want to block bootstrap process now
            return this.keycloakService.login().then(() => 'login')
          }
          // if (!loginOk) {
          //     return this.keycloakService.login().then(() => 'login')
          // } else {
          //     return Promise.resolve('loginOk')
          // }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((res) => {
          return firstValueFrom(this.userProfileAPIService.getCurrentUser())
        })
        .then((userProfile) => {
          // console.debug(`Got user profile, update state`)
          // this.updateUserFromKeycloak(results[0], parsedToken);
          this.userProfile = userProfile

          //overwrite user-roles with the roles from keycloak-token
          const tokenWithRoles = localStorage.getItem(KC_TOKEN_LS)
          if (tokenWithRoles) {
            const kcToken = JSON.parse(atob(tokenWithRoles.split('.')[1]))
            this.userProfile.tenantId = kcToken.tenantId
            this.userProfile.tenantName = kcToken.tenantName
            this.userProfile.roles = kcToken.realm_access.roles
          }

          this.userProfile.idToken = this.keycloakService.getKeycloakInstance().idToken
          this.userProfile.accessToken = this.keycloakService.getKeycloakInstance().token

          this.updatePermissionsFromUserProfile(userProfile)
          localStorage.setItem(TKIT_USER_PROFILE_LS, JSON.stringify(userProfile))
          this.currentUser$.next(this.userProfile)

          //update language if set
          if (this.userProfile.accountSettings?.localeAndTimeSettings?.locale) {
            console.log(
              `ℹ Update App language from user profile : ${this.userProfile.accountSettings?.localeAndTimeSettings?.locale}`
            )
            this.configService.lang = this.userProfile.accountSettings?.localeAndTimeSettings?.locale
            this.configService.lang$.next(this.userProfile.accountSettings?.localeAndTimeSettings?.locale)
          } else {
            console.log(`ℹ User does not have language/local set in profile`)
          }
          // console.log(`Keycloak auth init complete`)
          return true
        })
        .catch((err) => {
          console.log(`KC ERROR ${err} as json ${JSON.stringify(err)}`)
          throw err
        })
    )
  }

  backgroundRefreshProfile() {
    this.userProfileAPIService.getCurrentUser().subscribe((profileData) => {
      this.userProfile = profileData

      //overwrite user-roles with the roles from keycloak-token
      const tokenWithRoles = localStorage.getItem(KC_TOKEN_LS)
      if (tokenWithRoles) {
        this.userProfile.roles = JSON.parse(atob(tokenWithRoles.split('.')[1])).realm_access.roles
      }

      this.updatePermissionsFromUserProfile(profileData)
      localStorage.setItem(TKIT_USER_PROFILE_LS, JSON.stringify(profileData))
    })
  }

  private getValidKCConfig(): KeycloakConfig {
    const clientId = this.configService.getProperty(CONFIG_KEY_KEYCLOAK_CLIENT_ID)
    if (!clientId) {
      throw new Error('Invalid KC config, missing clientId')
    }
    const realm = this.configService.getProperty(CONFIG_KEY_KEYCLOAK_REALM)
    if (!realm) {
      throw new Error('Invalid KC config, missing realm')
    }
    return {
      url: this.configService.getProperty(CONFIG_KEY_KEYCLOAK_URL),
      clientId,
      realm,
    }
  }

  private setupEventListener() {
    this.keycloakService.keycloakEvents$.subscribe((ke) => {
      // console.log(`KC Event ${KeycloakEventType[ke.type]} token: ${this.keycloakService.getKeycloakInstance().token}`)
      // we are logged in, get tokens and store them in localstorage
      if (this.keycloakService.getKeycloakInstance().token) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_TOKEN_LS, this.keycloakService.getKeycloakInstance().token!)
      } else {
        localStorage.removeItem(KC_TOKEN_LS)
      }
      if (this.keycloakService.getKeycloakInstance().idToken) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_ID_TOKEN_LS, this.keycloakService.getKeycloakInstance().idToken!)
      } else {
        localStorage.removeItem(KC_ID_TOKEN_LS)
      }
      if (this.keycloakService.getKeycloakInstance().refreshToken) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localStorage.setItem(KC_REFRESH_TOKEN_LS, this.keycloakService.getKeycloakInstance().refreshToken!)
      } else {
        localStorage.removeItem(KC_REFRESH_TOKEN_LS)
      }
      if (ke.type === KeycloakEventType.OnAuthLogout) {
        console.log('SSO logout nav to root')
        this.clearKCStateFromLocalstorage()
        this.keycloakService.login()
        // window.location.reload()
      }
    })
  }

  private clearKCStateFromLocalstorage() {
    localStorage.removeItem(KC_ID_TOKEN_LS)
    localStorage.removeItem(KC_TOKEN_LS)
    localStorage.removeItem(KC_REFRESH_TOKEN_LS)
  }

  private getSilentSSOUrl() {
    let currentBase = document.getElementsByTagName('base')[0].href
    if (currentBase === '/') {
      currentBase = ''
    }
    return `${currentBase}/assets/silent-check-sso.html`
  }

  getCurrentUser(): UserProfile | null {
    return this.userProfile
  }

  logout(): void {
    this.keycloakService.logout()
  }
  hasPermission(permissionKey: string): boolean {
    if (this.kcModuleConfig?.disablePermissionCheck) {
      console.log(`⚠ Permission check is disabled. Allowing ${permissionKey}`)
      return true
    }
    // return true
    const result = this.userPermissions ? this.userPermissions.includes(permissionKey) : false
    if (!result) {
      console.log(`👮‍♀️ No permission for: ${permissionKey}`)
    }
    return result
  }
  getAuthProviderName(): string {
    return 'keycloak-auth'
  }
  hasRole(role: string | string[]): boolean {
    if (typeof role === 'string') {
      return this.userProfile?.roles?.includes(role) || false
    } else {
      return role.filter((r) => this.userProfile?.roles?.includes(r) || false).length > 0
    }
  }

  getUserRoles(): string[] {
    return this.userProfile?.roles || []
  }

  private updatePermissionsFromUserProfile(userProfile: UserProfile) {
    if (userProfile) {
      if (userProfile.memberships) {
        userProfile.memberships.forEach((m) => {
          m.roleMemberships?.forEach((r) => {
            r.permissions?.forEach((p) => {
              if (p) {
                if (p.key !== undefined) {
                  this.userPermissions.push(p.key)
                }
              }
            })
          })
        })
      }
    }
  }
}
