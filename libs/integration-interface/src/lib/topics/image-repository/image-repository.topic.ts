import { Topic } from "@onecx/accelerator";
import { ImageRepositoryInfo } from "./image-repository.model";

export class ImageRepositoryTopic extends Topic<ImageRepositoryInfo> {
  constructor() {
    super('imageRepository', 1)
  }
}