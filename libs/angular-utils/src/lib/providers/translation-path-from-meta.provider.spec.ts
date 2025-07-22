import { provideTranslationPathFromMeta } from './translation-path-from-meta.providers';
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils';

describe('provideTranslationPathFromMeta', () => {
  it('should remove file name and append custom path', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/',
      multi: true,
    });
  });

  it('should default to /i18n/ if path is undefined', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url);
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should handle URLs with no file name', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/'
    const provider = provideTranslationPathFromMeta(url, 'assets/pathName/');
    expect(provider).toEqual(expect.objectContaining({ useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/'}));
  });

  it('should throw error for local file URLs', () => {
    expect(() => provideTranslationPathFromMeta('file:///some/local/file.js')).toThrow(
      'Can not construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.'
    );
  });

  it('should add trailing slash if path does not end with slash', () => {
    const url = 'https://dev.one-cx.org/mfe/workspace/3204.512.js'
    const provider = provideTranslationPathFromMeta(url, 'assets/i18n');
     expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });
});