 import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { ImageTopic } from '../topics/image/image.topic';
import { FakeTopic } from '@onecx/accelerator';
import { ImageInfo } from '../topics/image/image.model';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageInfo = { image: { urls: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } } };

describe('ImageService interface', () => {
  let imageService: ImageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
    }).compileComponents();
    const mockTopic = new FakeTopic<ImageInfo>();
    imageService = new ImageService();
    imageService.imageTopic = mockTopic as unknown as ImageTopic;
    imageService.imageTopic?.publish(MOCK_URLS);
  })

  it('should instantiate _imageTopic$ when it is undefined', () => {
    const service = new ImageService();
    const topic = service.imageTopic;
    expect(topic).toBeDefined();
    expect((service as any)._imageTopic$).toBeDefined();
  });

   it('should return undefined from isInitialized when _imageTopic$ is undefined', async () => {
    const service = new ImageService();
    const result = await service.isInitialized;
    expect(result).toBeUndefined();
   });

  it('should return a correct url when image exists', async () => {
    const result = await imageService.getUrl([URL_NAME]);
    expect(result).toBe(EXPECTED_URL);
  });

  it('should return fallback if name does not exist and fallback is provided', async () => {
    const result = await imageService.getUrl(['notfound'], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);
  });

  it('should return undefined if name does not exist and no fallback', async () => {
    const result = await imageService.getUrl(['notfound']);
    expect(result).toBeUndefined();
  });

  it('should destroy the topic', () => {
    const topicDestroySpy = jest.spyOn((imageService as any).imageTopic, 'destroy');
    imageService.destroy();
    expect(topicDestroySpy).toHaveBeenCalled();
  });
});

