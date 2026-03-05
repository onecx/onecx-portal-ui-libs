import { ValueProvider } from '@angular/core';

import { MULTI_LANGUAGE_IDENTIFIER, MultiLanguageIdentifier } from "../injection-tokens/multi-language-identifier";

export function provideMultiLanguageIdentifier(name: string): ValueProvider
export function provideMultiLanguageIdentifier(name: string, version: string): ValueProvider
export function provideMultiLanguageIdentifier(name: string, version: string, type: 'app' | 'lib'): ValueProvider

export function provideMultiLanguageIdentifier(name: string, version?: string, type: 'app' | 'lib' = 'app'): ValueProvider {
    return {
        provide: MULTI_LANGUAGE_IDENTIFIER,
        useValue: {
            name,
            version,
            type,
        } satisfies MultiLanguageIdentifier,
        multi: true
    }
}