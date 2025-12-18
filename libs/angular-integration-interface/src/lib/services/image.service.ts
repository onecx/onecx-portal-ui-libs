import { Injectable, OnDestroy } from "@angular/core";
import { ImageHandler } from '@onecx/integration-interface'

@Injectable({providedIn: 'root'}) 
export class ImageService implements OnDestroy {
    private imageHandler = new ImageHandler();
    
    async getUrl(names: string[]): Promise<string | undefined> {
        return this.imageHandler.getUrl(names);
    }

    async getUrlWithFallback(names: string[], fallbackUrl: string): Promise<string | undefined> {
        return this.imageHandler.getUrl(names, fallbackUrl);
    }

    ngOnDestroy(): void {
        this.imageHandler.destroy();
    }

    destroy() {
        this.ngOnDestroy();
    }
}