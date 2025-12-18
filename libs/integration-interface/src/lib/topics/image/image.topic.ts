import { Topic } from "@onecx/accelerator";
import { ImageInfo } from "./image.model";

export class ImageTopic extends Topic<ImageInfo> {
  constructor() {
    super('image', 1)
  }
}