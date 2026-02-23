import { Observable, filter, first, map, of } from 'rxjs';
import { ensureProperty } from '@onecx/accelerator';
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

const UNVERSIONED_KEY = 'undefined';

export interface TranslationContext {
    name: string;
    version?: string;
}

interface CachedVersion {
    value: Record<string, unknown> | null | undefined;
    version: string;
}

interface DynamicTranslationsCache {
    [locale: string]: {
        [contextName: string]: {
            [version: string]: Record<string, unknown> | null | undefined;
        };
    };
}

function getDynamicTranslationsCache(): DynamicTranslationsCache {
    const global = ensureProperty(globalThis, ['@onecx/integration_interface', 'dynamicTranslationsCache'], {});
    return global['@onecx/integration_interface'].dynamicTranslationsCache;
}


export class DynamicTranslationService {
    private readonly logger = createLogger('DynamicTranslationService');
    private _dynamicTranslationsTopic$: DynamicTranslationsTopic | undefined;

    get dynamicTranslationsTopic$() {
        this._dynamicTranslationsTopic$ ??= new DynamicTranslationsTopic();
        return this._dynamicTranslationsTopic$;
    }

    set dynamicTranslationsTopic$(source: DynamicTranslationsTopic) {
        this._dynamicTranslationsTopic$ = source;
    }

    getTranslations(locale: string, contexts: TranslationContext[]): Observable<Record<string, Record<string, unknown>>> {
        this.logger.debug('getTranslations', { locale, contexts });

        if (!hasShellCapability(ShellCapability.DYNAMIC_TRANSLATIONS_TOPIC)) {
            this.logger.debug('Shell does not support dynamic translations, returning empty records');
            return of(this.createEmptyRecords(contexts));
        }

        const cache = getDynamicTranslationsCache();
        ensureProperty(cache, [locale], {});

        const { missing, pending } = this.categorizeContexts(locale, contexts);
        this.logger.debug('Categorized contexts', { missing, pending });

        if (missing.length > 0) {
            this.logger.debug('Marking contexts as requested and publishing request', { missing });
            this.markContextsAsRequested(cache, locale, missing);
            this.requestTranslations(locale, missing);
        }

        if (this.hasIncompleteContexts(missing, pending)) {
            this.logger.debug('Waiting for translations', { missing, pending });
            return this.waitForTranslations(locale, contexts);
        }

        const result = this.collectTranslations(locale, contexts);
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
        const cache = getDynamicTranslationsCache();
        const localeCache = cache[locale];
        return localeCache?.[contextName];
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
        if (nullCheck !== undefined) {
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
            .filter((v) => v !== UNVERSIONED_KEY && this.isValidSemanticVersion(v) && this.satisfiesVersion(v, requestedVersion))
            .sort((b, a) => this.compareVersions(a, b));

        if (satisfyingVersions.length > 0) {
            const bestMatch = satisfyingVersions[0];
            return { value: contextCache[bestMatch], version: bestMatch };
        }

        return undefined;
    }

    private isValidSemanticVersion(version: string): boolean {
        const semverRegex = /^\d+\.\d+\.\d+$/;
        return semverRegex.test(version);
    }

    private satisfiesVersion(availableVersion: string, requestedVersion: string): boolean {
        const ranges = requestedVersion.split('||').map(r => r.trim());
        return ranges.some(range => this.matchesAndRange(availableVersion, range));
    }

    private matchesAndRange(availableVersion: string, range: string): boolean {
        const hyphenMatch = range.match(/^(\S+)\s+-\s+(\S+)$/);
        if (hyphenMatch) {
            return this.matchesSingleRange(availableVersion, `>=${hyphenMatch[1]}`) &&
                   this.matchesSingleRange(availableVersion, `<=${hyphenMatch[2]}`);
        }

        const comparators = range.split(/\s+/).filter(Boolean);
        return comparators.every(comparator => this.matchesSingleRange(availableVersion, comparator));
    }

    private matchesSingleRange(availableVersion: string, range: string): boolean {
        const available = this.parseVersion(availableVersion)!;

        if (range.startsWith('>=')) {
            return this.matchesGreaterOrEqual(available, range.substring(2).trim());
        }

        if (range.startsWith('>')) {
            return this.matchesGreater(available, range.substring(1).trim());
        }

        if (range.startsWith('<=')) {
            return this.matchesLessOrEqual(available, range.substring(2).trim());
        }

        if (range.startsWith('<')) {
            return this.matchesLess(available, range.substring(1).trim());
        }

        if (range.startsWith('~')) {
            return this.matchesTildeRange(available, range.substring(1).trim());
        }

        if (range.startsWith('^')) {
            return this.matchesCaretRange(available, range.substring(1).trim());
        }

        if (range.startsWith('=')) {
            return this.matchesExact(available, range.substring(1).trim());
        }

        return this.matchesExact(available, range);
    }

    private matchesExact(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        return available.major === requested.major && 
               available.minor === requested.minor &&
               available.patch === requested.patch;
    }

    private matchesCaretRange(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        if (requested.major === 0) {
            if (requested.minor === 0) {
                return available.major === 0 && 
                       available.minor === 0 &&
                       available.patch === requested.patch;
            }
            return available.major === 0 && 
                   available.minor === requested.minor &&
                   available.patch >= requested.patch;
        }

        return available.major === requested.major && 
               available.minor >= requested.minor &&
               (available.minor > requested.minor || available.patch >= requested.patch);
    }

    private matchesTildeRange(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        return available.major === requested.major && 
               available.minor === requested.minor &&
               available.patch >= requested.patch;
    }

    private matchesGreaterOrEqual(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        const comparison = this.compareVersionObjects(available, requested);
        return comparison >= 0;
    }

    private matchesGreater(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        const comparison = this.compareVersionObjects(available, requested);
        return comparison > 0;
    }

    private matchesLessOrEqual(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        const comparison = this.compareVersionObjects(available, requested);
        return comparison <= 0;
    }

    private matchesLess(available: { major: number; minor: number; patch: number }, rangeVersion: string): boolean {
        const requested = this.parseVersion(rangeVersion);
        if (!requested) {
            return false;
        }

        const comparison = this.compareVersionObjects(available, requested);
        return comparison < 0;
    }

    private compareVersionObjects(
        a: { major: number; minor: number; patch: number },
        b: { major: number; minor: number; patch: number }
    ): number {
        if (a.major !== b.major) {
            return a.major - b.major;
        }
        if (a.minor !== b.minor) {
            return a.minor - b.minor;
        }
        return a.patch - b.patch;
    }

    private parseVersion(version: string): { major: number; minor: number; patch: number } | null {
        const parts = version.split('.').map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) {
            return null;
        }
        return { major: parts[0], minor: parts[1], patch: parts[2] };
    }

    private compareVersions(a: string, b: string): number {
        const versionA = this.parseVersion(a)!;
        const versionB = this.parseVersion(b)!;

        if (versionA.major !== versionB.major) {
            return versionA.major - versionB.major;
        }
        if (versionA.minor !== versionB.minor) {
            return versionA.minor - versionB.minor;
        }
        return versionA.patch - versionB.patch;
    }

    private checkForNullTranslations(contextCache: Record<string, Record<string, unknown> | null | undefined>, versions: string[]): null | undefined {
        const hasNullTranslation = versions.some((version) => contextCache[version] === null);
        return hasNullTranslation ? null : undefined;
    }

    private markContextsAsRequested(cache: DynamicTranslationsCache, locale: string, contexts: TranslationContext[]) {
        this.logger.debug('Marking contexts as requested', { locale, contexts });
        for (const context of contexts) {
            ensureProperty(cache, [locale, context.name], {});
            cache[locale][context.name][context.version ?? UNVERSIONED_KEY] = undefined;
            this.logger.debug('Marked context as requested', { locale, context });
        }
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
        return match === undefined || match === null || match.value === undefined;
    }

    private addContextTranslations(
        target: Record<string, Record<string, unknown>>,
        context: TranslationContext,
        match: CachedVersion | null | undefined
    ) {
        if (match && match.value !== null && match.value !== undefined) {
            const contextKey = this.getContextKey(context);
            target[contextKey] = match.value;
            this.logger.debug('Added context translations', { contextKey, translationKeys: Object.keys(match.value) });
        }
    }

    private getContextKey(context: TranslationContext): string {
        return context.version ? `${context.name}@${context.version}` : context.name;
    }

    destroy() {
        this.dynamicTranslationsTopic$.destroy();
    }
}
