import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { FakeTopic } from '@onecx/accelerator';
import { DynamicTranslationService } from './dynamic-translation.service';
import { DynamicTranslationsMessage, TranslationContext } from '@onecx/integration-interface';

describe('DynamicTranslationService', () => {
  let service: DynamicTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dynamicTranslationsTopic$', () => {
    it('should return the dynamicTranslationsTopic$ from the underlying interface', () => {
      const fakeTopic = FakeTopic.create<DynamicTranslationsMessage>();
      jest
        .spyOn(service['dynamicTranslationInterface'], 'dynamicTranslationsTopic$', 'get')
        .mockReturnValue(fakeTopic);

      expect(service.dynamicTranslationsTopic$).toBe(fakeTopic);
    });
  });

  describe('getTranslations', () => {
    it('should call the underlying interface getTranslations method', async () => {
      const contexts: TranslationContext[] = [
        { name: 'common' },
        { name: 'app', version: '1.0.0' },
      ];
      const expectedResult = {
        common: { key1: 'value1' },
        'app@1.0.0': { key2: 'value2' },
      };

      const spy = jest
        .spyOn(service['dynamicTranslationInterface'], 'getTranslations')
        .mockReturnValue(of(expectedResult));

      const result = await firstValueFrom(
        service.getTranslations('en', contexts)
      );

      expect(spy).toHaveBeenCalledWith('en', contexts);
      expect(result).toEqual(expectedResult);
    });

    it('should return an Observable', () => {
      const contexts: TranslationContext[] = [{ name: 'test' }];
      const result = service.getTranslations('en', contexts);
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroy on the underlying interface', () => {
      const spy = jest.spyOn(
        service['dynamicTranslationInterface'],
        'destroy'
      );
      service.ngOnDestroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
