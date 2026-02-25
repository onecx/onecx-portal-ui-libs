import { Observable, filter, first, map, of } from 'rxjs';
import { ensureProperty } from '@onecx/accelerator';
import { rcompare, satisfies, valid } from 'semver';
import {
    DynamicTranslationsTopic,
    DynamicTranslationsMessage,
} from '../topics/dynamic-translations/v1/dynamic-translations.topic';
import {
    DynamicTranslationsMessageType,
    TranslationsRequested,
} from '../topics/dynamic-translations/v1/dynamic-translations.model';
import { createLogger } from '../utils/logger.utils';
import { ShellCapability } from '../models/shell-capability.model';
import { hasShellCapability } from '../utils/shell-capability.utils';

/**
 * Cache key used for translation contexts without an explicit version.
 */
export const UNVERSIONED_KEY = 'undefined';

/**
 * Describes a translation namespace that should be resolved for a locale.
 */
export interface TranslationContext {
    /** Translation namespace (for example `common` or `app`). */
    name: string;
    /**
     * Optional concrete semantic version.
     *
     * Example: `1.2.3`.
     */
    version?: string;
}

interface CachedVersion {
    value: Record<string, unknown> | null | undefined;
    version: string;
}

/**
 * Global cache shape for dynamic translations.
 *
 * Keys are organized as locale -> context name -> version.
 */
export interface DynamicTranslationsCache {
    [locale: string]: {
        [contextName: string]: {
            [version: string]: Record<string, unknown> | null | undefined;
        };
    };
}

/**
 * Returns the shared dynamic translations cache stored on `globalThis`.
 *
 * @returns Mutable cache object used by dynamic translation resolution.
 */
export function getDynamicTranslationsCache(): DynamicTranslationsCache {
    const global = ensureProperty(globalThis, ['@onecx/integration-interface', 'dynamicTranslationsCache'], {});
    return global['@onecx/integration-interface'].dynamicTranslationsCache;
}


/**
 * Resolves dynamic translations from a shared cache and topic-based shell communication.
 *
 * The service returns cached values immediately when possible and requests missing
 * translations via `dynamicTranslationsTopic$` when needed.
 */
export class DynamicTranslationService {
    private readonly logger = createLogger('DynamicTranslationService');
    private _dynamicTranslationsTopic$: DynamicTranslationsTopic | undefined;

    /**
     * Topic used to request and receive dynamic translations.
     */
    get dynamicTranslationsTopic$() {
        this._dynamicTranslationsTopic$ ??= new DynamicTranslationsTopic();
        return this._dynamicTranslationsTopic$;
    }

    set dynamicTranslationsTopic$(source: DynamicTranslationsTopic) {
        this._dynamicTranslationsTopic$ = source;
    }

    /**
     * Returns translations for the given locale and contexts.
     *
     * The method first attempts to resolve from cache, requests missing entries,
     * and waits for a `RECEIVED` message when data is still pending.
     *
     * @param locale Target locale (for example `en`, `de`).
     * @param contexts Translation contexts to resolve.
     * @returns An observable emitting a context-keyed translation map.
     */
    getTranslations(locale: string, contexts: TranslationContext[]): Observable<Record<string, Record<string, unknown>>> {
        this.logger.debug('getTranslations', { locale, contexts });

        const safeContexts = contexts.filter((context) => this.isSafeContext(context));
        if (safeContexts.length !== contexts.length) {
            this.logger.debug('Skipping unsafe translation contexts', { locale, contexts });
        }

        if (!this.isSafeCacheKey(locale)) {
            this.logger.debug('Skipping dynamic translation resolution for unsafe locale key', { locale });
            return of(this.createEmptyRecords(safeContexts));
        }

        if (!hasShellCapability(ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC)) {
            this.logger.debug('Shell does not support dynamic translations, returning empty records');
            return of(this.createEmptyRecords(safeContexts));
        }

        const cache = getDynamicTranslationsCache();
        ensureProperty(cache, [locale], {});

        const { missing, pending } = this.categorizeContexts(locale, safeContexts);
        this.logger.debug('Categorized contexts', { missing, pending });

        if (missing.length > 0) {
            this.logger.debug('Marking contexts as requested and publishing request', { missing });
            this.markContextsAsRequested(cache, locale, missing);
            this.requestTranslations(locale, missing);
        }

        if (this.hasIncompleteContexts(missing, pending)) {
            this.logger.debug('Waiting for translations', { missing, pending });
            return this.waitForTranslations(locale, safeContexts);
        }

        const result = this.collectTranslations(locale, safeContexts);
        this.logger.debug('Collected translations', { translations: result.translations });
        return of(result.translations);
    }

    private createEmptyRecords(contexts: TranslationContext[]): Record<string, Record<string, unknown>> {
        const emptyRecords: Record<string, Record<string, unknown>> = {};
        for (const context of contexts) {
            const contextKey = this.getContextKey(context);
            emptyRecords[contextKey] = {};
        }
        return emptyRecords;
    }

    private categorizeContexts(locale: string, contexts: TranslationContext[]) {
        const missing: TranslationContext[] = [];
        const pending: TranslationContext[] = [];

        for (const context of contexts) {
            const cachedVersion = this.findMatchingVersion(locale, context.name, context.version);
            this.logger.debug('Context version match result', { context, cachedVersion });

            if (cachedVersion === null) {
                this.logger.debug('Context marked as null (no translations)', { context });
                continue;
            }

            if (cachedVersion === undefined) {
                this.logger.debug('Context missing in cache', { context });
                missing.push(context);
            } else if (cachedVersion.value === undefined) {
                this.logger.debug('Context pending (requested but not received)', { context });
                pending.push(context);
            }
        }

        return { missing, pending };
    }

    private findMatchingVersion(
        locale: string,
        contextName: string,
        requestedVersion?: string
    ): CachedVersion | null | undefined {
        const contextCache = this.getContextCache(locale, contextName);
        if (!contextCache) {
            return undefined;
        }

        const versions = Object.keys(contextCache);
        if (versions.length === 0) {
            return undefined;
        }

        const normalizedVersion = requestedVersion || UNVERSIONED_KEY;
        if (!requestedVersion || requestedVersion === UNVERSIONED_KEY) {
            return this.getFirstAvailableVersion(contextCache, versions);
        }

        return this.findBestMatchingVersion(contextCache, versions, normalizedVersion);
    }

    private getContextCache(locale: string, contextName: string) {
        if (!this.isSafeCacheKey(locale) || !this.isSafeCacheKey(contextName)) {
            return undefined;
        }

        const cache = getDynamicTranslationsCache();
        const localeCache = cache[locale];
        if (!localeCache || !Object.hasOwn(localeCache, contextName)) {
            return undefined;
        }
        return localeCache[contextName];
    }

    private getFirstAvailableVersion(contextCache: Record<string, Record<string, unknown> | null | undefined>, versions: string[]): CachedVersion {
        const firstVersion = versions[0];
        return { value: contextCache[firstVersion], version: firstVersion };
    }

    private findBestMatchingVersion(
        contextCache: Record<string, Record<string, unknown> | null | undefined>,
        versions: string[],
        requestedVersion: string
    ): CachedVersion | null | undefined {
        if (contextCache[requestedVersion] !== undefined) {
            this.logger.debug('Exact version match found in cache', { requestedVersion });
            return { value: contextCache[requestedVersion], version: requestedVersion };
        }

        const semanticMatch = this.findSemanticVersionMatch(contextCache, versions, requestedVersion);
        if (semanticMatch) {
            this.logger.debug('Semantic version match found', { requestedVersion, matchedVersion: semanticMatch.version });
            return semanticMatch;
        }

        const nullCheck = this.checkForNullTranslations(contextCache, versions);
        const hasNullMatch = nullCheck === null;
        if (hasNullMatch) {
            this.logger.debug('Found null translations check result', { requestedVersion });
        } else {
            this.logger.debug('No match found', { requestedVersion });
        }
        return nullCheck;
    }

    private findSemanticVersionMatch(
        contextCache: Record<string, Record<string, unknown> | null | undefined>,
        versions: string[],
        requestedVersion: string
    ): CachedVersion | undefined {
        const satisfyingVersions = versions
            .filter((v) => v !== UNVERSIONED_KEY && valid(v) !== null && this.satisfiesVersion(v, requestedVersion))
            .sort(rcompare);

        if (satisfyingVersions.length > 0) {
            const bestMatch = satisfyingVersions[0];
            return { value: contextCache[bestMatch], version: bestMatch };
        }

        return undefined;
    }

    private satisfiesVersion(availableVersion: string, requestedVersion: string): boolean {
        try {
            return satisfies(availableVersion, requestedVersion, { includePrerelease: true });
        } catch {
            return false;
        }
    }

    private checkForNullTranslations(contextCache: Record<string, Record<string, unknown> | null | undefined>, versions: string[]): null | undefined {
        const hasNullTranslation = versions.some((version) => contextCache[version] === null);
        return hasNullTranslation ? null : undefined;
    }

    private markContextsAsRequested(cache: DynamicTranslationsCache, locale: string, contexts: TranslationContext[]) {
        this.logger.debug('Marking contexts as requested', { locale, contexts });
        for (const context of contexts) {
            if (!this.isSafeContext(context)) {
                this.logger.debug('Skipping unsafe context key while marking as requested', { locale, context });
                continue;
            }

            ensureProperty(cache, [locale, context.name], {});
            cache[locale][context.name][context.version ?? UNVERSIONED_KEY] = undefined;
            this.logger.debug('Marked context as requested', { locale, context });
        }
    }

    private isSafeContext(context: TranslationContext): boolean {
        return this.isSafeCacheKey(context.name) && this.isSafeCacheKey(context.version);
    }

    private isSafeCacheKey(key: string | undefined): boolean {
        if (!key) {
            return true;
        }

        return key !== '__proto__' && key !== 'prototype' && key !== 'constructor';
    }

    private requestTranslations(locale: string, contexts: TranslationContext[]) {
        const message: TranslationsRequested = {
            type: DynamicTranslationsMessageType.REQUESTED,
            locale,
            contexts: contexts.map(({ name, version }) => ({ name, version })),
        };
        this.logger.debug('Publishing translation request message', { message });
        this.dynamicTranslationsTopic$.publish(message);
    }

    private hasIncompleteContexts(missing: TranslationContext[], pending: TranslationContext[]): boolean {
        return missing.length > 0 || pending.length > 0;
    }

    private waitForTranslations(locale: string, contexts: TranslationContext[]): Observable<Record<string, Record<string, unknown>>> {
        this.logger.debug('Starting to wait for translations', { locale, contexts });
        return this.dynamicTranslationsTopic$.pipe(
            filter((msg: DynamicTranslationsMessage) => {
                const isReceived = msg.type === DynamicTranslationsMessageType.RECEIVED;
                this.logger.debug('Received message', { type: msg.type, isReceived });
                return isReceived;
            }),
            map(() => {
                const result = this.collectTranslations(locale, contexts);
                this.logger.debug('Collected after message', { complete: result.complete });
                return result;
            }),
            filter((result) => result.complete),
            map((result) => {
                this.logger.debug('Translations complete, returning', { contextCount: Object.keys(result.translations).length });
                return result.translations;
            }),
            first()
        );
    }

    private collectTranslations(
        locale: string,
        contexts: TranslationContext[]
    ): { translations: Record<string, Record<string, unknown>>; complete: boolean } {
        const translations: Record<string, Record<string, unknown>> = {};
        let complete = true;

        for (const context of contexts) {
            const match = this.findMatchingVersion(locale, context.name, context.version);

            if (this.shouldSkipContext(match)) {
                this.logger.debug('Skipping context (null)', { context });
                continue;
            }

            if (this.isContextIncomplete(match)) {
                this.logger.debug('Context incomplete', { context });
                complete = false;
                continue;
            }

            this.addContextTranslations(translations, context, match);
        }

        this.logger.debug('Collection complete', { complete, contextCount: Object.keys(translations).length });
        return { translations, complete };
    }

    private shouldSkipContext(match: CachedVersion | null | undefined): boolean {
        return match === null;
    }

    private isContextIncomplete(match: CachedVersion | null | undefined): boolean {
        return match?.value === undefined;
    }

    private addContextTranslations(
        target: Record<string, Record<string, unknown>>,
        context: TranslationContext,
        match: CachedVersion | null | undefined
    ) {
        const matchedValue = match?.value;
        if (matchedValue !== null && matchedValue !== undefined) {
            const contextKey = this.getContextKey(context);
            target[contextKey] = matchedValue;
            this.logger.debug('Added context translations', { contextKey, translationKeys: Object.keys(matchedValue) });
        }
    }

    private getContextKey(context: TranslationContext): string {
        return context.version ? `${context.name}@${context.version}` : context.name;
    }

    /**
     * Releases topic resources held by this service instance.
     */
    destroy() {
        this.dynamicTranslationsTopic$.destroy();
    }
}
