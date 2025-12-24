import { ImageTopic } from "../topics/image/image.topic";
import { firstValueFrom } from "rxjs";

export class ImageService {
    private _imageTopic$: ImageTopic | undefined;

    get imageTopic() {
        this._imageTopic$ ??= new ImageTopic()
        return this._imageTopic$
    }
    set imageTopic(source: ImageTopic) {
        this._imageTopic$ = source
    }
    get isInitialized(): Promise<void> {
        return this.imageTopic.isInitialized;
    }

    async getUrl(names: string[]): Promise<string | undefined>
    async getUrl(names: string[], fallbackUrl: string): Promise<string>
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined> {
        if (!names || names.length === 0) {
            return fallbackUrl;
        }
        const imagePaths = await firstValueFrom(this.imageTopic.asObservable());
        const urls = imagePaths.images || {};
        const isUrlListEmpty = Object.entries(urls).length === 0;
        if (isUrlListEmpty) {
            return fallbackUrl;
        }
        for (const name of names) {
            if (name in urls) {
                return urls[name];
            }
        }
        return fallbackUrl;
    }

    destroy() {
        this.imageTopic.destroy();
    }
}