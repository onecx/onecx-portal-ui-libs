/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { FakeTopic } from '@onecx/accelerator';
import { ImageRepositoryTopic } from '../topics/image-repository/image-repository.topic';
import { ImageRepositoryInfo } from '../topics/image-repository/image-repository.model';
import { ImageRepositoryService } from './image-repository.service';

const URL_NAME = 'logo1';
const EXPECTED_URL = '/logo1-url';
const FALLBACK_URL = '/fallback-url';
const MOCK_URLS: ImageRepositoryInfo = { images: { [URL_NAME]: EXPECTED_URL, 'logo2': '/logo2-url' } };

describe('ImageRepositoryService interface', () => {
  let imageRepositoryService: ImageRepositoryService;

  beforeEach(() => {
    const mockTopic = new FakeTopic<ImageRepositoryInfo>();
    imageRepositoryService = new ImageRepositoryService();
    imageRepositoryService.imageRepositoryTopic = mockTopic as unknown as ImageRepositoryTopic;
    imageRepositoryService.imageRepositoryTopic?.publish(MOCK_URLS);
  })

  it('should instantiate _imageRepositoryTopic$ when it is undefined', () => {
    const topic = imageRepositoryService.imageRepositoryTopic;
    expect(topic).toBeDefined();
    expect((imageRepositoryService as any)._imageRepositoryTopic$).toBeDefined();
  });

  it('should return a correct url when image exists', async () => {
    const result = await imageRepositoryService.getUrl([URL_NAME]);
    expect(result).toBe(EXPECTED_URL);
  });

  it('should return fallback if name does not exist and fallback is provided', async () => {
    const result = await imageRepositoryService.getUrl(['notfound'], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);
  });

  it('should return undefined if name does not exist and no fallback', async () => {
    const result = await imageRepositoryService.getUrl(['notfound']);
    expect(result).toBeUndefined();
  });

  it('should destroy the topic', () => {
    const topicDestroySpy = jest.spyOn(imageRepositoryService.imageRepositoryTopic, 'destroy');
    imageRepositoryService.destroy();
    expect(topicDestroySpy).toHaveBeenCalled();
  });

  it('should return fallbackurl when names or image paths are not provided', async () => {
    const noNamesResult = await imageRepositoryService.getUrl([], FALLBACK_URL);
    expect(noNamesResult).toBe(FALLBACK_URL);

    imageRepositoryService.imageRepositoryTopic?.publish({ images: {} });
    const result = await imageRepositoryService.getUrl([URL_NAME], FALLBACK_URL);
    expect(result).toBe(FALLBACK_URL);

    imageRepositoryService.imageRepositoryTopic?.publish({ images: undefined as any });
    expect(await imageRepositoryService.getUrl([URL_NAME], FALLBACK_URL)).toBe(FALLBACK_URL); 
    imageRepositoryService.imageRepositoryTopic?.publish({ images: undefined as any });
    expect(await imageRepositoryService.getUrl([URL_NAME], FALLBACK_URL)).toBe(FALLBACK_URL);
  });
});

