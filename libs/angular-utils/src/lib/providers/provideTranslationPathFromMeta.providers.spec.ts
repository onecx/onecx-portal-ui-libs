import { provideTranslationPathFromMeta } from './provideTranslationPathFromMeta.providers';
import { TRANSLATION_PATH } from '../utils/create-translate-loader.utils';

describe('provideTranslationPathFromMeta', () => {
  it('should remove file name and append custom path', () => {
    const meta = {url: 'https://dev.one-cx.org/mfe/workspace/3204.512.js'} as ImportMeta;
    const provider = provideTranslationPathFromMeta(meta, 'assets/pathName/');
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/',
      multi: true,
    });
  });

  it('should default to /i18n/ if path is undefined', () => {
    const meta = {url: 'https://dev.one-cx.org/mfe/workspace/3204.512.js'} as ImportMeta;
    const provider = provideTranslationPathFromMeta(meta);
    expect(provider).toEqual({
      provide: TRANSLATION_PATH,
      useValue: 'https://dev.one-cx.org/mfe/workspace/assets/i18n/',
      multi: true,
    });
  });

  it('should handle URLs with no file name', () => {
    const meta ={url: 'https://dev.one-cx.org/mfe/workspace/'} as ImportMeta;
    const provider = provideTranslationPathFromMeta(meta, 'assets/pathName/');
    expect(provider).toEqual(expect.objectContaining({ useValue: 'https://dev.one-cx.org/mfe/workspace/assets/pathName/'}));
  });
});