import { Provider } from "@angular/core";
import { TRANSLATION_PATH } from "../utils/create-translate-loader.utils";
import { Location } from "@angular/common";

/**
 * Returns a provider for TRANSLATION_PATH based on import.meta.url and a given path.
 * Removes the file name from import.meta.url and appends the path (default 'assets/i18n/').
 */
export function provideTranslationPathFromMeta(url: string, path = 'assets/i18n/'): Provider {
  if(url.includes('file://')) {
    console.warn('WARNING: Cannot construct translation path from local file path. Returning relative path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.');
    return {
      provide: TRANSLATION_PATH,
      useValue: path,
      multi: true,
    };
  }
  const urlWithoutFileName = url.replace(/\/[^/]*$/, '');
  const translationPath = Location.joinWithSlash(urlWithoutFileName, path) + (path.endsWith('/') ? '' : '/');
  return {
    provide: TRANSLATION_PATH,
    useValue: translationPath,
    multi: true,
  };
}