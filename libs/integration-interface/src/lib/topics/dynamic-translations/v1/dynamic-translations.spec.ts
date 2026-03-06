/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { firstValueFrom } from 'rxjs';
import { DynamicTranslationsTopic } from './dynamic-translations.topic';
import { TranslationsRequested, TranslationsReceived, DynamicTranslationsMessageType } from './dynamic-translations.model';

describe('DynamicTranslationsTopic', () => {
  let topic: DynamicTranslationsTopic;

  beforeEach(() => {
    topic = new DynamicTranslationsTopic();
  });

  afterEach(() => {
    topic.destroy();
  });

  it('should create the topic', () => {
    expect(topic).toBeDefined();
  });

  describe('TranslationsRequested messages', () => {
    it('should publish and subscribe to TranslationsRequested messages', async () => {
      const message: TranslationsRequested = {
        type: DynamicTranslationsMessageType.REQUESTED,
        locale: 'en',
        contexts: [{ name: 'common' }]
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });

    it('should handle empty contexts array', async () => {
      const message: TranslationsRequested = {
        type: DynamicTranslationsMessageType.REQUESTED,
        locale: 'de',
        contexts: []
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });

    it('should handle multiple contexts with versions', async () => {
      const message: TranslationsRequested = {
        type: DynamicTranslationsMessageType.REQUESTED,
        locale: 'fr',
        contexts: [
          { name: 'common', version: '1.0.0' },
          { name: 'app', version: '2.1.0' },
          { name: 'errors' }
        ]
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });
  });

  describe('TranslationsReceived messages', () => {
    it('should publish and subscribe to TranslationsReceived messages', async () => {
      const message: TranslationsReceived = {
        type: DynamicTranslationsMessageType.RECEIVED
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });

    it('should handle empty translations', async () => {
      const message: TranslationsReceived = {
        type: DynamicTranslationsMessageType.RECEIVED
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });

    it('should handle TranslationsReceived messages', async () => {
      const message: TranslationsReceived = {
        type: DynamicTranslationsMessageType.RECEIVED
      };

      topic.publish(message);
      const received = await firstValueFrom(topic.asObservable());

      expect(received).toEqual(message);
    });
  });
});
