import { Topic } from "@onecx/accelerator";
import { ImageInfo } from "./image-repository.model";

export class ImageRepositoryTopic extends Topic<ImageInfo> {
  constructor() {
    super('imageRepository', 1)
  }
}