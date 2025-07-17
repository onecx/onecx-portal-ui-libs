import { Provider } from "@angular/core";
import { TRANSLATION_PATH } from "../utils/create-translate-loader.utils";

 /**
 * Returns a provider for TRANSLATION_PATH based on import.meta.url and a given path.
 * Removes the file name from import.meta.url and appends the path (default '/i18n/').
 */
export function provideTranslationPathFromMeta(meta: ImportMeta, path?: string): Provider {
  const urlWithoutFileName = meta.url.replace(/\/[^/]*$/, '');
  const translationPath = urlWithoutFileName + '/' + (path ?? 'assets/i18n/');
  return {
    provide: TRANSLATION_PATH,
    useValue: translationPath,
    multi: true,
  };
}