import { Provider } from '@angular/core';
import { provideTranslationPaths } from './translation-path.providers';
import { providePermissionService } from './permission-service.providers';

export function provideAngularUtils(): Provider[] {
  return [
    ...providePermissionService(),
    ...provideTranslationPaths(),
  ];
}