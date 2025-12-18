import { TestBed } from '@angular/core/testing';
import { ImageService } from './image.service';
import { of, delay, firstValueFrom, EMPTY} from 'rxjs';

class PublisherComponent {
	constructor(private imageService: ImageService) {}
	publishImages(images: Record<string, string>) {
		(this.imageService as any).imageHandler.imageTopic$.publish({ images });
	}
}

class SubscriberComponent {
	constructor(private imageService: ImageService) {}
	async getImageUrl(names: string[], fallback?: string) {
		if (fallback) {
			return this.imageService.getUrlWithFallback(names, fallback);
		}
		return this.imageService.getUrl(names);
	}
}

describe('ImageService integration', () => {
	let imageService: ImageService;
	let publisher: PublisherComponent;
	let subscriber: SubscriberComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ImageService],
		}).compileComponents();
		imageService = TestBed.inject(ImageService);
		publisher = new PublisherComponent(imageService);
		subscriber = new SubscriberComponent(imageService);
	});

	it('should provide image url when images are published', async () => {
		publisher.publishImages({ logo1: '/logo1-url', icon: '/icon-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		const url = await subscriber.getImageUrl(['logo1', 'icon']);
		expect(url).toBe('/logo1-url');
	});

	it('should return fallback when images not present', async () => {
		publisher.publishImages({ logo: '/logo-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		const url = await subscriber.getImageUrl(['notfound'], '/fallback-url');
		expect(url).toBe('/fallback-url');
	});

	it('should update image paths when publisher publishes new images', async () => {
		publisher.publishImages({ logo: '/logo-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		expect(await subscriber.getImageUrl(['logo'])).toBe('/logo-url');
		
		publisher.publishImages({ icon: '/icon-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		expect(await subscriber.getImageUrl(['icon'])).toBe('/icon-url');
		expect(await subscriber.getImageUrl(['logo'])).toBeUndefined();
	});

	it('should not return image url after destroy is called', async () => {
		publisher.publishImages({ logo: '/logo-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		expect(await subscriber.getImageUrl(['logo'])).toBe('/logo-url');
		imageService.destroy();
		
		publisher.publishImages({ logo: '/new-url' });
		await firstValueFrom(of(EMPTY).pipe(delay(0)));
		expect(await subscriber.getImageUrl(['logo'])).toBe('/logo-url');
	});
});
