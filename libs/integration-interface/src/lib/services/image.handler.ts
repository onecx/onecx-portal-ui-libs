import { ImageInfo } from "../topics/image/image.model";
import { ImageTopic } from "../topics/image/image.topic";
import { Subject, takeUntil } from "rxjs";

export class ImageHandler {
    private _imagePaths: { [key: string]: string } = {};
    private destroy$ = new Subject<void>();
    imageTopic$ = new ImageTopic();

    get isInitialized(): Promise<void> {
        return this.imageTopic$.isInitialized
    }
    
    constructor(imageTopic?: ImageTopic) {
        this.imageTopic$ = imageTopic || this.imageTopic$;
        this.imageTopic$
            .pipe(takeUntil(this.destroy$))
            .subscribe((imageInfo: ImageInfo) => {
                this._imagePaths = imageInfo.images || {};
            });
    }

    async getUrl(names: string[]): Promise<string | undefined>
    async getUrl(names: string[], fallbackUrl: string | undefined): Promise<string | undefined>
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined>
    {
        if (!names || names.length === 0) {
            return fallbackUrl;
        }

        for (const name of names) {
            if (Object.prototype.hasOwnProperty.call(this._imagePaths, name)) {
                return this._imagePaths[name];
            }
        }
        
        return fallbackUrl;
    }

    destroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.imageTopic$.destroy();
    }
}