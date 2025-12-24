import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { ImageInfo, ImageService as ImageInterface, ImageTopic } from '@onecx/integration-interface';
import { FakeTopic } from '@onecx/accelerator';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageInfo = { images: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } };

describe('ImageService', () => {
  let service: ImageService;
  let imageInterface: ImageInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
		providers: [ImageService, ImageInterface]
	});
	const mockTopic = new FakeTopic<ImageInfo>();
    service = TestBed.inject(ImageService);
    imageInterface = (service as any).imageInterface;
	imageInterface.imageTopic = mockTopic as any as ImageTopic;
	imageInterface.imageTopic?.publish(MOCK_URLS);
  });

  it('should call getUrl without fallback', async () => {
	const expectedUrl = MOCK_URLS.images[URL_NAME];
	const spyGetUrl = jest.spyOn(imageInterface, 'getUrl').mockResolvedValue(expectedUrl);

    const result = await service.getUrl([URL_NAME]);

    expect(result).toBe(expectedUrl);
	expect(spyGetUrl).toHaveBeenCalledWith([URL_NAME]);
	expect(result).toEqual(EXPECTED_URL);
  });

  it('should call getUrl with fallback', async () => {
	const NOT_FOUND_NAME = 'notfound';
    const spyGetUrl = jest.spyOn(imageInterface, 'getUrl').mockResolvedValue(FALLBACK_URL);

    const result = await service.getUrl([NOT_FOUND_NAME], FALLBACK_URL);

    expect(spyGetUrl).toHaveBeenCalledWith([NOT_FOUND_NAME], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);
  });

  it('should call destroy on ngOnDestroy', () => {
    const spyDestroy = jest.spyOn(imageInterface, 'destroy');

    service.ngOnDestroy();

    expect(spyDestroy).toHaveBeenCalled();
  });

  it('should call ngOnDestroy from destroy()', () => {
    const spyDestroy = jest.spyOn(service, 'ngOnDestroy');

    service.destroy();
	
    expect(spyDestroy).toHaveBeenCalled();
  });  

  it('should test topic getter/setter and isInitialized getter', async () => {    
    const mockIsInitialized = Promise.resolve();
    jest.spyOn(imageInterface, 'isInitialized', 'get').mockReturnValue(mockIsInitialized);
    
    service.imageTopic = imageInterface.imageTopic;

    expect(service.imageTopic).toBe(imageInterface.imageTopic);
    expect(service.isInitialized).toBe(mockIsInitialized);
  });
});
