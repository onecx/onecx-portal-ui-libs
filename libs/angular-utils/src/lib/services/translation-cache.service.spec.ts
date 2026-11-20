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

  describe('getTranslationFile', () => {
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

    it('should write the failure marker and emit an empty translation set when a load fails', (done) => {

      const subject = new ReplaySubject<any>(1);
      translationCache.getTranslationFile('testUrl', () => subject).subscribe((result) => {
        expect(result).toEqual({});
        expect(window['onecxTranslations']['testUrl']).toEqual({ __onecxTranslationLoadFailed: true });
        done();
      });

      subject.error(new Error('failed'));
    });

    it('should not re-request a translation file that already failed to load', (done) => {

      const failingSubject = new ReplaySubject<any>(1);
      let cacheMissCalls = 0;

      let firstResult: any;
      translationCache.getTranslationFile('testUrl', () => {
        cacheMissCalls++;
        return failingSubject;
      }).subscribe((v) => { firstResult = v; });
      failingSubject.error(new Error('failed'));
      expect(firstResult).toEqual({});

      translationCache.getTranslationFile('testUrl', () => {
        cacheMissCalls++;
        return of({ key: 'value' });
      }).subscribe((result) => {
        expect(result).toEqual({});
        expect(cacheMissCalls).toBe(1);
        done();
      });
    });

    it('should honour a failure marker written by another app', (done) => {

      let cacheMissCalls = 0;
      // Simulate another app on the page having recorded the failure
      window['onecxTranslations'] = { 'testUrl': { __onecxTranslationLoadFailed: true } };
      translationCache.getTranslationFile('testUrl', () => {
        cacheMissCalls++;
        return of({ key: 'value' });
      }).subscribe((result) => {
        expect(result).toEqual({});
        expect(cacheMissCalls).toBe(0);
        done();
      });
    });

    it('should give an empty translation set to a caller waiting during a failure, not the marker', (done) => {

      const subject = new ReplaySubject<any>(1);
      let counter = 0;
      let firstResult: any;
      let secondResult: any;
      let firstCompleted = false;
      let secondCompleted = false;

      const maybeDone = () => {
        if (firstCompleted && secondCompleted) {
          expect(firstResult).toEqual({});
          expect(secondResult).toEqual({});
          expect(secondResult).not.toEqual({ __onecxTranslationLoadFailed: true });
          done();
        }
      };

      translationCache.getTranslationFile('testUrl', () => { counter++; return subject; })
        .subscribe((v) => { firstResult = v; }, undefined, () => { firstCompleted = true; maybeDone(); });
      translationCache.getTranslationFile('testUrl', () => { counter++; return subject; })
        .subscribe((v) => { secondResult = v; }, undefined, () => { secondCompleted = true; maybeDone(); });

      expect(counter).toBe(1);
      subject.error(new Error('failed'));
    });

    it('should give an empty translation set to a waiting caller if the entry is still null', (done) => {

      window['onecxTranslations'] = { 'testUrl': null };
      translationCache.getTranslationFile('testUrl', () => of({ key: 'value' })).subscribe((result) => {
        expect(result).toEqual({});
        done();
      });
      (translationCache as any).translationTopic$.publish('testUrl');
    });
  });
});
