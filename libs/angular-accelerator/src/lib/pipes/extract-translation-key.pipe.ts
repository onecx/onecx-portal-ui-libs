import { Pipe, PipeTransform } from '@angular/core';
import { TranslationKey } from '../model/translation.model';

@Pipe({ name: 'extractTranslationKey' })
export class ExtractTranslationKeyPipe implements PipeTransform {
  transform(value: TranslationKey | undefined | null, mode: 'key' | 'params', fallback?: string): any {
    if (value == null) {
      return mode === 'params' ? undefined : fallback ?? '';
    }
    if (mode === 'key') {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value.key) return value.key;
      return fallback ?? '';
    }
    if (mode === 'params') {
      return typeof value === 'object' && value.parameters ? value.parameters : undefined;
    }
    return fallback ?? '';
  }
}
