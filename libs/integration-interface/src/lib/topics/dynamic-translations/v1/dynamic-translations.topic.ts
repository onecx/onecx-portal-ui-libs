import { Topic } from '@onecx/accelerator';
import { TranslationsRequested, TranslationsReceived } from './dynamic-translations.model';

export type DynamicTranslationsMessage = TranslationsRequested | TranslationsReceived;

export class DynamicTranslationsTopic extends Topic<DynamicTranslationsMessage> {
  constructor() {
    super('dynamicTranslations', 1, false);
  }
}
