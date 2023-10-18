// import { APP_INITIALIZER, Provider } from '@angular/core';
// import { KeycloakAuthService } from './keycloak-auth.service';

// function initializeKeycloak(authService: KeycloakAuthService) {
//     return () =>
//     authService.init({
//         config: {
//           url: 'http://localhost:8080/auth',
//           realm: 'your-realm',
//           clientId: 'your-client-id'
//         },
//         initOptions: {
//           onLoad: 'check-sso',
//           silentCheckSsoRedirectUri:
//             window.location.origin + '/assets/silent-check-sso.html'
//         }
//       });
//   }
// export const KeycloakAuthAppInitializer : Provider = {
//     provide: APP_INITIALIZER,
//     useFactory: initializeKeycloak,
//     multi: true,
//     deps: [KeycloakAuthService]
//   }
