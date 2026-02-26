/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { firstValueFrom } from 'rxjs';
import { DynamicTranslationService, TranslationContext } from './dynamic-translation.service';
import { DynamicTranslationsMessageType } from '../topics/dynamic-translations/v1/dynamic-translations.model';
import { ensureProperty, FakeTopic } from '@onecx/accelerator';
import { ShellCapability } from '../models/shell-capability.model';
import * as semver from 'semver';

describe('DynamicTranslationService', () => {
  let service: DynamicTranslationService;
  let global: typeof globalThis & { '@onecx/integration-interface': { dynamicTranslationsCache: Record<string, any> } };

  beforeEach(() => {
    service = new DynamicTranslationService();
    service.dynamicTranslationsTopic$ = FakeTopic.create();
    global = ensureProperty(globalThis, ['@onecx/integration-interface', 'dynamicTranslationsCache'], {});
    // Clear the cache to ensure clean state for each test
    global['@onecx/integration-interface'].dynamicTranslationsCache = {};
    window['onecx-shell-capabilities'] = [ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC];
  });

  afterEach(() => {
    service.destroy();
  });

  describe('getTranslations', () => {
    it('should create the service', () => {
      expect(service).toBeDefined();
    });

    it('should return empty records when shell does not support dynamic translations', async () => {
      window['onecx-shell-capabilities'] = [];

      const contexts: TranslationContext[] = [
        { name: 'common' },
        { name: 'app', version: '1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({
        common: {},
        'app@1.0.0': {},
      });
    });

    it('should return empty records when shell capabilities are undefined', async () => {
      delete window['onecx-shell-capabilities'];

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({
        'context1@^1.0.0': {},
      });
    });

    it('should return an Observable', () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { 'undefined': { hello: 'Hello' } }
      };
      const result = service.getTranslations('en', [{ name: 'common' }]);
      expect(result).toBeDefined();
      expect(result.subscribe).toBeDefined();
    });

    it('should return cached translations immediately', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { 'undefined': { hello: 'Hello', goodbye: 'Goodbye' } }
      };
      
      const result = service.getTranslations('en', [{ name: 'common' }]);
      const value = await firstValueFrom(result);
      
      expect(value).toEqual({ 
        common: { hello: 'Hello', goodbye: 'Goodbye' } 
      });
    });

    it('should handle empty contexts array', async () => {
      const result = service.getTranslations('en', []);
      const value = await firstValueFrom(result);
      expect(value).toEqual({});
    });

    it('should request missing translations and wait for response', async () => {
      const contexts: TranslationContext[] = [{ name: 'common' }];
      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      // Simulate receiving translations
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
          common: { 'undefined': { hello: 'Hello' } }
        };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const value = await resultPromise;
      expect(value).toEqual({ common: { hello: 'Hello' } });
    });

    it('should handle translations with versions', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { '1.0.0': { hello: 'Hello' } }
      };
      
      const result = service.getTranslations('en', [{ name: 'common', version: '1.0.0' }]);
      const value = await firstValueFrom(result);
      
      expect(value).toEqual({ 'common@1.0.0': { hello: 'Hello' } });
    });

    it('should match semantic versions correctly', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { '1.2.3': { hello: 'Hello v1.2.3' } }
      };
      
      const result = service.getTranslations('en', [{ name: 'common', version: '^1.0.0' }]);
      const value = await firstValueFrom(result);
      
      expect(value).toEqual({ 'common@^1.0.0': { hello: 'Hello v1.2.3' } });
    });

    it('should handle translations from multiple contexts', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { 'undefined': { hello: 'Hello' } },
        app: { '1.0.0': { title: 'My App' } },
        errors: { '2.1.0': { notFound: 'Not Found' } }
      };
      
      const contexts: TranslationContext[] = [
        { name: 'common' },
        { name: 'app', version: '1.0.0' },
        { name: 'errors', version: '2.1.0' }
      ];
      const result = service.getTranslations('en', contexts);
      const value = await firstValueFrom(result);
      
      expect(value).toEqual({
        common: { hello: 'Hello' },
        'app@1.0.0': { title: 'My App' },
        'errors@2.1.0': { notFound: 'Not Found' }
      });
    });

    it('should handle different locales', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { 'undefined': { hello: 'Hello' } }
      };
      global['@onecx/integration-interface'].dynamicTranslationsCache['de'] = {
        common: { 'undefined': { hello: 'Hallo' } }
      };
      global['@onecx/integration-interface'].dynamicTranslationsCache['fr'] = {
        common: { 'undefined': { hello: 'Bonjour' } }
      };
      
      const contexts: TranslationContext[] = [{ name: 'common' }];
      
      const enResult = await firstValueFrom(service.getTranslations('en', contexts));
      expect(enResult).toEqual({ common: { hello: 'Hello' } });
      
      const deResult = await firstValueFrom(service.getTranslations('de', contexts));
      expect(deResult).toEqual({ common: { hello: 'Hallo' } });
      
      const frResult = await firstValueFrom(service.getTranslations('fr', contexts));
      expect(frResult).toEqual({ common: { hello: 'Bonjour' } });
    });

    it('should skip contexts with null value (no translations exist)', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        common: { 'undefined': { hello: 'Hello' } },
        missing: { 'undefined': null }
      };
      
      const result = service.getTranslations('en', [
        { name: 'common' },
        { name: 'missing' }
      ]);
      const value = await firstValueFrom(result);
      
      expect(value).toEqual({ common: { hello: 'Hello' } });
    });

    it('should publish translation request for missing contexts', async () => {
      const publishSpy = jest.spyOn(service.dynamicTranslationsTopic$, 'publish');
      
      const contexts: TranslationContext[] = [{ name: 'new-context', version: '1.0.0' }];
      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      expect(publishSpy).toHaveBeenCalledWith({
        type: DynamicTranslationsMessageType.REQUESTED,
        locale: 'en',
        contexts: [{ name: 'new-context', version: '1.0.0' }]
      });
      
      // Simulate receiving translations
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
          'new-context': { '1.0.0': { test: 'Test' } }
        };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      await resultPromise;
    });

    it('should support exact version matching without prefix', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@1.1.0': { key1: 'value1.1.0' } });
    });

    it('should support caret range matching', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
          '2.0.0': { key1: 'value2.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.2.5' } });
    });

    it('should support tilde range matching', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.2.0': { key1: 'value1.2.0' },
          '1.2.3': { key1: 'value1.2.3' },
          '1.2.5': { key1: 'value1.2.5' },
          '1.3.0': { key1: 'value1.3.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '~1.2.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@~1.2.0': { key1: 'value1.2.5' } });
    });

    it('should support >= operator', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>=1.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@>=1.1.0': { key1: 'value1.2.5' } });
    });

    it('should support > operator', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>1.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@>1.1.0': { key1: 'value1.2.5' } });
    });

    it('should support <= operator', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '<=1.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@<=1.1.0': { key1: 'value1.1.0' } });
    });

    it('should support < operator', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
          '1.2.5': { key1: 'value1.2.5' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '<1.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@<1.1.0': { key1: 'value1.0.0' } });
    });

    it('should support OR operator (||)', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '2.0.0': { key1: 'value2.0.0' },
          '3.0.0': { key1: 'value3.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0 || 2.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@1.0.0 || 2.0.0': { key1: 'value2.0.0' } });
    });

    it('should handle 0.x versions with caret correctly', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '0.1.0': { key1: 'value0.1.0' },
          '0.1.5': { key1: 'value0.1.5' },
          '0.2.0': { key1: 'value0.2.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^0.1.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^0.1.0': { key1: 'value0.1.5' } });
    });

    it('should handle 0.0.x versions with caret correctly', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '0.0.1': { key1: 'value0.0.1' },
          '0.0.2': { key1: 'value0.0.2' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^0.0.1' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^0.0.1': { key1: 'value0.0.1' } });
    });

    it('should select highest matching version when multiple versions satisfy caret range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '8.0.0': { key1: 'value8.0.0' },
          '8.1.0': { key1: 'value8.1.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^8.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      // Should select 8.1.0 as it's the highest version that satisfies ^8.0.0
      expect(result).toEqual({ 'context1@^8.0.0': { key1: 'value8.1.0' } });
    });

    it('should handle invalid semantic versions', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: 'invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['invalid'] = { key1: 'valueInvalid' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({ 'context1@invalid': { key1: 'valueInvalid' } });
    });

    it('should handle multiple requests with partial availability', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { '1.0.0': { key1: 'value1' } },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
        { name: 'context2', version: '1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context2'] = {
          '1.0.0': { key2: 'value2' }
        };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({
        'context1@1.0.0': { key1: 'value1' },
        'context2@1.0.0': { key2: 'value2' }
      });
    });

    it('should handle comparisons with invalid versions', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'invalid': { key1: 'valueInvalid' },
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should wait for pending contexts to complete', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { '1.0.0': undefined },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['1.0.0'] = { key1: 'value1' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({ 'context1@1.0.0': { key1: 'value1' } });
    });

    it('should filter out non-RECEIVED messages', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { '1.0.0': undefined },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.REQUESTED,
          locale: 'en',
          contexts: []
        });
        
        setTimeout(() => {
          global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['1.0.0'] = { key1: 'value1' };
          service.dynamicTranslationsTopic$.publish({
            type: DynamicTranslationsMessageType.RECEIVED
          });
        }, 10);
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({ 'context1@1.0.0': { key1: 'value1' } });
    });

    it('should handle null translations in cache by returning first non-null match', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': null,
          '1.1.0': { key1: 'value1.1.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.1.0' } });
    });

    it('should return empty when all matching versions are null', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': null,
          '1.1.0': null,
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({});
    });

    it('should handle = prefix for explicit exact match', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '=1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@=1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle context key without version', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { 'undefined': { key1: 'value1' } },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ context1: { key1: 'value1' } });
    });

    it('should handle version parsing errors gracefully', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'not-a-version': { key1: 'value1' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['^1.0.0'] = { key1: 'value2' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value2' } });
    });

    it('should handle unparseable version in range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^not-a-version' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['^not-a-version'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@^not-a-version': { key1: 'value' } });
    });

    it('should correctly sort versions when multiple satisfy the range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.5.0': { key1: 'value1.5.0' },
          '1.2.0': { key1: 'value1.2.0' },
          '1.9.0': { key1: 'value1.9.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.9.0' } });
    });

    it('should handle invalid available version format in range matching', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'invalid-format': { key1: 'valueInvalid' },
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle context with empty versions object', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {},
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['1.0.0'] = { key1: 'value1' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@1.0.0': { key1: 'value1' } });
    });

    it('should handle 0.0.0 version edge case with caret', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '0.0.0': { key1: 'value0.0.0' },
          '0.0.1': { key1: 'value0.0.1' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^0.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^0.0.0': { key1: 'value0.0.0' } });
    });

    it('should handle invalid version in >= range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>=invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['>=invalid'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@>=invalid': { key1: 'value' } });
    });

    it('should handle invalid version in > range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['>invalid'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@>invalid': { key1: 'value' } });
    });

    it('should handle invalid version in <= range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '<=invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['<=invalid'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@<=invalid': { key1: 'value' } });
    });

    it('should handle invalid version in < range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '<invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['<invalid'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@<invalid': { key1: 'value' } });
    });

    it('should handle invalid version in ~ range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '~invalid' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));

      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['~invalid'] = { key1: 'value' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);

      const result = await resultPromise;
      expect(result).toEqual({ 'context1@~invalid': { key1: 'value' } });
    });

    it('should handle checkForNullTranslations finding null', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': null,
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: 'some-unknown-version' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({});
    });

    it('should handle version comparison with invalid versions gracefully', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'invalid-version': { key1: 'valueInvalid' },
          'not.valid.0': { key2: 'valueNotValid' },
          '1.0.0': { key1: 'value1.0.0' },
          '2.invalid': { key3: 'value2Invalid' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle invalid version format (not 3 parts) in available version', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0': { key1: 'value1.0' },
          '1.0.0.0': { key2: 'value1.0.0.0' },
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle invalid semantic version in requested range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^abc.def.ghi' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context1']['^abc.def.ghi'] = { key1: 'valueInvalid' };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({ 'context1@^abc.def.ghi': { key1: 'valueInvalid' } });
    });

    it('should compare versions with different major versions', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '2.0.0': { key1: 'value2.0.0' },
          '3.0.0': { key1: 'value3.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>=2.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@>=2.0.0': { key1: 'value3.0.0' } });
    });

    it('should skip null translations and handle incomplete contexts with logger debug coverage', async () => {
      // Spy on logger to ensure debug calls are covered
      jest.spyOn((service as any).logger, 'debug');
      
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { '1.0.0': { key1: 'value1' } },
        // context2 has null translation but we request different version -> triggers checkForNullTranslations -> shouldSkipContext
        context2: { '1.0.0': null, '2.0.0': { key2: 'value2' } },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
        // Request version that doesn't exist but null exists -> should skip (triggers line 430)
        { name: 'context2', version: '3.0.0' },
        // Request context that doesn't exist yet -> incomplete (triggers lines 435-437: debug, complete=false, continue)
        { name: 'context3', version: '1.0.0' },
      ];

      const resultPromise = firstValueFrom(service.getTranslations('en', contexts));
      
      setTimeout(() => {
        global['@onecx/integration-interface'].dynamicTranslationsCache['en']['context3'] = { '1.0.0': { key3: 'value3' } };
        service.dynamicTranslationsTopic$.publish({
          type: DynamicTranslationsMessageType.RECEIVED
        });
      }, 10);
      
      const result = await resultPromise;
      expect(result).toEqual({ 
        'context1@1.0.0': { key1: 'value1' },
        'context3@1.0.0': { key3: 'value3' }
      });
      // context2 should be skipped (null), context3 was incomplete then received
    });

    it('should return incomplete status when collectTranslations finds incomplete contexts', () => {
      // Directly test collectTranslations to ensure complete=false is set
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: { '1.0.0': { key1: 'value1' } },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '1.0.0' },
        { name: 'context2', version: '1.0.0' }, // doesn't exist -> incomplete
      ];

      const result = (service as any).collectTranslations('en', contexts);
      
      expect(result.complete).toBe(false);
      expect(result.translations).toEqual({ 
        'context1@1.0.0': { key1: 'value1' }
      });
    });

    it('should handle comparison of two invalid versions', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'abc': { key1: 'valueAbc' },
          'def': { key1: 'valueDef' },
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle invalid available version format when matching range', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          'not-a-version': { key1: 'valueInvalid' },
          '1.0.0': { key1: 'value1.0.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '^1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@^1.0.0': { key1: 'value1.0.0' } });
    });

    it('should handle mix of valid and invalid versions in cache', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.a.0': { key1: 'invalid1' },
          'x.y.z': { key1: 'invalid2' },
          '1.0.0': { key1: 'value1.0.0' },
          '1.1.0': { key1: 'value1.1.0' },
        },
      };

      const contexts: TranslationContext[] = [
        { name: 'context1', version: '>=1.0.0' },
      ];

      const result = await firstValueFrom(service.getTranslations('en', contexts));
      expect(result).toEqual({ 'context1@>=1.0.0': { key1: 'value1.1.0' } });
    });

    it('should support AND range with space-separated comparators (>=x <y)', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '0.9.0': { key1: 'value0.9.0' },
          '1.0.0': { key1: 'value1.0.0' },
          '1.5.0': { key1: 'value1.5.0' },
          '2.0.0': { key1: 'value2.0.0' },
        },
      };

      const result = await firstValueFrom(service.getTranslations('en', [{ name: 'context1', version: '>=1.0.0 <2.0.0' }]));
      expect(result).toEqual({ 'context1@>=1.0.0 <2.0.0': { key1: 'value1.5.0' } });
    });

    it('should support hyphen range (x - y)', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '0.9.0': { key1: 'value0.9.0' },
          '1.0.0': { key1: 'value1.0.0' },
          '1.5.0': { key1: 'value1.5.0' },
          '2.0.0': { key1: 'value2.0.0' },
          '3.0.0': { key1: 'value3.0.0' },
        },
      };

      const result = await firstValueFrom(service.getTranslations('en', [{ name: 'context1', version: '1.0.0 - 2.0.0' }]));
      expect(result).toEqual({ 'context1@1.0.0 - 2.0.0': { key1: 'value2.0.0' } });
    });

    it('should support combined OR with AND ranges (>=x <y || >=z)', async () => {
      global['@onecx/integration-interface'].dynamicTranslationsCache['en'] = {
        context1: {
          '1.0.0': { key1: 'value1.0.0' },
          '1.5.0': { key1: 'value1.5.0' },
          '2.0.0': { key1: 'value2.0.0' },
          '3.0.0': { key1: 'value3.0.0' },
        },
      };

      const result = await firstValueFrom(service.getTranslations('en', [{ name: 'context1', version: '>=1.0.0 <1.5.0 || >=3.0.0' }]));
      expect(result).toEqual({ 'context1@>=1.0.0 <1.5.0 || >=3.0.0': { key1: 'value3.0.0' } });
    });

    it('should skip unsafe contexts before processing', async () => {
      window['onecx-shell-capabilities'] = [];

      const result = await firstValueFrom(
        service.getTranslations('en', [
          { name: 'common' },
          { name: '__proto__', version: '1.0.0' },
        ])
      );

      expect(result).toEqual({
        common: {},
      });
    });

    it('should return empty records for unsafe locale keys', async () => {
      const publishSpy = jest.spyOn(service.dynamicTranslationsTopic$, 'publish');

      const result = await firstValueFrom(service.getTranslations('__proto__', [{ name: 'common' }]));

      expect(result).toEqual({ common: {} });
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('should return undefined from getContextCache for unsafe keys', () => {
      const unsafeLocaleResult = (service as any).getContextCache('__proto__', 'common');
      const unsafeContextResult = (service as any).getContextCache('en', 'constructor');

      expect(unsafeLocaleResult).toBeUndefined();
      expect(unsafeContextResult).toBeUndefined();
    });

    it('should handle thrown errors in satisfiesVersion and skip unsafe request keys', () => {
      const satisfiesSpy = jest.spyOn(semver, 'satisfies').mockImplementation(() => {
        throw new Error('forced semver failure');
      });

      const versionResult = (service as any).satisfiesVersion('1.0.0', '^1.0.0');
      expect(versionResult).toBe(false);
      satisfiesSpy.mockRestore();

      const cache = { en: {} } as Record<string, Record<string, Record<string, unknown> | undefined>>;
      (service as any).markContextsAsRequested(cache, 'en', [
        { name: '__proto__', version: '1.0.0' },
        { name: 'safe' },
      ]);

      expect(Object.hasOwn(cache['en'], '__proto__')).toBe(false);
      expect(cache['en']?.['safe']).toEqual({ undefined: undefined });
    });
  });
});