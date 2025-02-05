import { TestBed } from "@angular/core/testing";
import { of } from 'rxjs';
import { TranslationCacheService } from "./translation-cache.service";
import { FakeTopic } from "@onecx/accelerator";

describe('TranslationCacheService', () => {
  let translationCache: TranslationCacheService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [TranslationCacheService]
    }).compileComponents();
    translationCache = TestBed.inject(TranslationCacheService);
    (translationCache as any).translationTopic$ = new FakeTopic<string>();
  });

  afterEach(() => {
    translationCache.ngOnDestroy();
  });

  it('should be created', () => {
    expect(translationCache).toBeTruthy();
  });

  it('should return cached translation if available', (done) => {
    window['onecxTranslations'] = { 'testUrl': { key: 'cachedValue' } };
    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
      expect(result).toEqual({ key: 'cachedValue' });
      done();
    });
  });

  it('should return null if translation is being fetched', (done) => {
    window['onecxTranslations'] = { 'testUrl': null };
    const fakeTopic = (translationCache as any).translationTopic$;
    jest.spyOn(fakeTopic, 'publish');

    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });

    // Simulate the publish event
    (translationCache as any).translationTopic$.publish('testUrl');
  });

  it('should fetch and cache translation if not available', (done) => {
    window['onecxTranslations'] = {};
    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
      expect(result).toEqual({ key: 'value' });
      expect(window['onecxTranslations']['testUrl']).toEqual({ key: 'value' });
      done();
    });
  });

  it('should publish the URL after fetching translation', (done) => {
    const publishSpy = jest.spyOn((translationCache as any).translationTopic$, 'publish');
    window['onecxTranslations'] = {};
    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe(() => {
      expect(publishSpy).toHaveBeenCalledWith('testUrl');
      done();
    });
  });

  it('should notify subscribers when translation is fetched', (done) => {
    window['onecxTranslations'] = { 'testUrl': null };
    const fakeTopic = (translationCache as any).translationTopic$ as FakeTopic<string>;
    const subscription = fakeTopic.subscribe((url) => {
      expect(url).toBe('testUrl');
      done();
    });

    // Simulate the publish event
    (translationCache as any).translationTopic$.publish('testUrl');

  });
});