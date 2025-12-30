import { FakeTopic } from '@onecx/accelerator';
import { ImageInfo } from '../topics/image-repository/image-repository.model';
import { ImageService } from './image.service';
import { ImageRepositoryTopic } from '../topics/image-repository/image-repository.topic';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageInfo = { images: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } };

describe('ImageService interface', () => {
  let imageService: ImageService;

  beforeEach(() => {
    const mockTopic = new FakeTopic<ImageInfo>();
    imageService = new ImageService();
    imageService.imageRepositoryTopic = mockTopic as unknown as ImageRepositoryTopic;
    imageService.imageRepositoryTopic?.publish(MOCK_URLS);
  })

  it('should instantiate _imageRepositoryTopic$ when it is undefined', () => {
    const service = new ImageService();
    const topic = service.imageRepositoryTopic;
    expect(topic).toBeDefined();
    expect((service as any)._imageRepositoryTopic$).toBeDefined();
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
    const topicDestroySpy = jest.spyOn(imageService.imageRepositoryTopic, 'destroy');
    imageService.destroy();
    expect(topicDestroySpy).toHaveBeenCalled();
  });

  it('should return fallbackurl when names or image paths are not provided', async () => {
    const noNamesResult = await imageService.getUrl([], FALLBACK_URL);
    expect(noNamesResult).toBe(FALLBACK_URL);

    imageService.imageRepositoryTopic?.publish({ images: {} });
    const result = await imageService.getUrl([URL_NAME], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);

    imageService.imageRepositoryTopic?.publish({ images: undefined as any });
    expect(await imageService.getUrl([URL_NAME], FALLBACK_URL)).toBe(FALLBACK_URL);

    imageService.imageRepositoryTopic?.publish({ images: undefined as any });
    expect(await imageService.getUrl([URL_NAME], FALLBACK_URL)).toBe(FALLBACK_URL);
  });
});

