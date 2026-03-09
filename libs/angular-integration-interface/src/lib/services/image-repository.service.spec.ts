import { TestBed } from '@angular/core/testing';
import { ImageRepositoryService as ImageRepositoryInterface, ImageRepositoryInfo } from '@onecx/integration-interface';
import { FakeTopic } from '@onecx/accelerator';
import { ImageRepositoryService } from './image-repository.service';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageRepositoryInfo = { images: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } };

describe('ImageRepositoryService', () => {
  let service: ImageRepositoryService;
  let imageRepositoryInterface: ImageRepositoryInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
		providers: [ImageRepositoryService]
	});
    service = TestBed.inject(ImageRepositoryService);
    imageRepositoryInterface = (service as any).imageRepositoryInterface;
    imageRepositoryInterface.imageRepositoryTopic = FakeTopic.create<ImageRepositoryInfo>();
    service.imageRepositoryTopic?.publish(MOCK_URLS);
  });

  it('should call getUrl without fallback', async () => {
    const expectedUrl = MOCK_URLS.images[URL_NAME];
    const spyGetUrl = jest.spyOn(imageRepositoryInterface, 'getUrl').mockResolvedValue(expectedUrl);

    const result = await service.getUrl([URL_NAME]);

    expect(result).toBe(expectedUrl);
	  expect(spyGetUrl).toHaveBeenCalledWith([URL_NAME]);
	  expect(result).toEqual(EXPECTED_URL);
  });

  it('should call getUrl with fallback', async () => {
	  const NOT_FOUND_NAME = 'notfound';
    const spyGetUrl = jest.spyOn(imageRepositoryInterface, 'getUrl').mockResolvedValue(FALLBACK_URL);

    const result = await service.getUrl([NOT_FOUND_NAME], FALLBACK_URL);

    expect(spyGetUrl).toHaveBeenCalledWith([NOT_FOUND_NAME], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);
  });

  it('should call destroy on ngOnDestroy', () => {
    const spyDestroy = jest.spyOn(imageRepositoryInterface, 'destroy');

    service.ngOnDestroy();

    expect(spyDestroy).toHaveBeenCalled();
  });
});
