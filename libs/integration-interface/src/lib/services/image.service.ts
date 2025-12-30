import { firstValueFrom } from "rxjs";
import { ImageRepositoryTopic } from "../topics/image-repository/image-repository.topic";

export class ImageService {
    private _imageRepositoryTopic$: ImageRepositoryTopic | undefined;

    get imageRepositoryTopic() {
        this._imageRepositoryTopic$ ??= new ImageRepositoryTopic()
        return this._imageRepositoryTopic$
    }
    set imageRepositoryTopic(source: ImageRepositoryTopic) {
        this._imageRepositoryTopic$ = source
    }

    async getUrl(names: string[]): Promise<string | undefined>
    async getUrl(names: string[], fallbackUrl: string): Promise<string>
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined> {
        if (!names || names.length === 0) {
            return fallbackUrl;
        }
        const imagePaths = await firstValueFrom(this.imageRepositoryTopic.asObservable());
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
        this.imageRepositoryTopic.destroy();
    }
}