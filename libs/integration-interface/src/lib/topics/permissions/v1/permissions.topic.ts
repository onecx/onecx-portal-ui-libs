import { Topic } from "@onecx/accelerator";

export class PermissionsTopic extends Topic<string[]> {
    constructor() {
      super('permissions', 1)
    }
  }