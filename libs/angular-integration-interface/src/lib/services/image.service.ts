import { Injectable, OnDestroy } from "@angular/core";
import { ImageService as ImageInterface } from '@onecx/integration-interface'

@Injectable({providedIn: 'root'}) 
export class ImageService implements OnDestroy {
    private readonly imageInterface = new ImageInterface();
    
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