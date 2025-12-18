export interface ImageInfo {
    image: ImageDetail;
}

export interface ImageDetail {
    urls: ImageUrls;
}

export interface ImageUrls {
    [key: string]: string;
}


