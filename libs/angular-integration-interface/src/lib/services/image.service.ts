import { Injectable, OnDestroy } from "@angular/core";
import { ImageService as ImageInterface, ImageTopic } from '@onecx/integration-interface'

@Injectable({providedIn: 'root'}) 
export class ImageService implements OnDestroy {
    private readonly imageInterface = new ImageInterface();

    get imageTopic() {
        return this.imageInterface.imageTopic;
    }

    set imageTopic(source: ImageTopic) {
        this.imageInterface.imageTopic = source;
    }

    get isInitialized(): Promise<void> {
        return this.imageInterface.isInitialized;
    }

    async getUrl(names: string[]): Promise<string | undefined>;
    async getUrl(names: string[], fallbackUrl: string): Promise<string>;
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined> {
        if (fallbackUrl) {
            return this.imageInterface.getUrl(names, fallbackUrl);
        }
        return this.imageInterface.getUrl(names);
    }   

    ngOnDestroy(): void {
        this.imageInterface.destroy();
    }

    destroy() {
        this.ngOnDestroy();
    }
}