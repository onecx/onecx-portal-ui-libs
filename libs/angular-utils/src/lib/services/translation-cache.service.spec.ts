import { TestBed } from "@angular/core/testing";
import { ReplaySubject, of } from 'rxjs';
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
    window['onecxTranslations'] = {};
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
  
  it('should load and cache translation if not available', (done) => {

    const subject = new ReplaySubject<any>(1);

    let counter = 0;
    let v1 = undefined;
    let v2 = undefined;
    translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v1 = v});
    translationCache.getTranslationFile('testUrl', () => {counter++; return subject}).subscribe((v)=> {v2 = v});
    expect(counter).toBe(1);

    const trans = { key: 'value' };
    subject.next(trans);
    expect(v1).toBe(trans);
    expect(v2).toBe(trans);
    done();
  });
});