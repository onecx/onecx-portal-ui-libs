import { TestBed } from "@angular/core/testing";
import { TranslationCacheService } from "./translation-cache.service";
import { FakeTopic } from "@onecx/accelerator";
import { of } from "rxjs/internal/observable/of";

describe('TranslationCacheService', () => {
  let translationCache: TranslationCacheService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [],
    imports: [],
    providers: []
}).compileComponents()
    translationCache = TestBed.inject(TranslationCacheService);
    (translationCache as any).translationTopic$ = new FakeTopic();
  })

  it('should return cached translation if available', (done) => {
    window['onecxTranslations'] = { 'testUrl': { key: 'cachedValue' } };
    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
      expect(result).toEqual({ key: 'cachedValue' });
      done();
    });
  });

  it('should fetch and cache translation if not available', (done) => {
    window['onecxTranslations'] = {};
    translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
      expect(result).toEqual({ key: 'value' });
      expect(window['onecxTranslations']['testUrl']).toEqual({ key: 'value' });
      done();
    });
  });

})