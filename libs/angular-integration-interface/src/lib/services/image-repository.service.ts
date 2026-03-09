import { Injectable, OnDestroy } from "@angular/core";
import { ImageRepositoryService as ImageRepositoryInterface } from '@onecx/integration-interface'

@Injectable({providedIn: 'root'}) 
export class ImageRepositoryService implements OnDestroy {
    private readonly imageRepositoryInterface = new ImageRepositoryInterface();

    get imageRepositoryTopic() {
        return this.imageRepositoryInterface.imageRepositoryTopic;
    }

    async getUrl(names: string[]): Promise<string | undefined>;
    async getUrl(names: string[], fallbackUrl: string): Promise<string>;
    async getUrl(names: string[], fallbackUrl?: string): Promise<string | undefined> {
        if (fallbackUrl) {
            return this.imageRepositoryInterface.getUrl(names, fallbackUrl);
        }
        return this.imageRepositoryInterface.getUrl(names);
    }

    ngOnDestroy(): void {
        this.imageRepositoryInterface.destroy();
    }
}