import { TestBed } from '@angular/core/testing';
import { ImageHandler } from './image.handler';
import { ImageTopic } from '../topics/image/image.topic';
import { FakeTopic } from '@onecx/accelerator';
import { ImageInfo } from '../topics/image/image.model';

describe('ImageHandler', () => {
  let imageHandler: ImageHandler;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
    }).compileComponents();
    const mockTopic = new FakeTopic<ImageInfo>();
    imageHandler = new ImageHandler(mockTopic as any as ImageTopic);
    (imageHandler as any).imageTopic$?.publish({ images: { 'logo1': '/logo1-url', 'logo2': '/logo2-url'} });
  })

  it('should return a correct url when image exists', async () => {
    const result = await imageHandler.getUrl(['logo1']);
    expect(result).toBe('/logo1-url');
  });

  it('should return fallback if name does not exist and fallback is provided', async () => {
    const result = await imageHandler.getUrl(['notfound'], '/fallback-url');
    expect(result).toBe('/fallback-url');
  });

  it('should return undefined if name does not exist and no fallback', async () => {
    const result = await imageHandler.getUrl(['notfound']);
    expect(result).toBeUndefined();
  });

  it('should destroy the topic and complete destroy$', () => {
    const completeSpy = jest.spyOn((imageHandler as any).destroy$, 'complete');
    const topicDestroySpy = jest.spyOn((imageHandler as any).imageTopic$, 'destroy');
    imageHandler.destroy();
    expect(topicDestroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});

