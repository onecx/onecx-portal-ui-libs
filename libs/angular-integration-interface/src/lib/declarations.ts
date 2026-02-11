/* eslint-disable no-var */
import { IconCache } from "@onecx/integration-interface";

declare global {
    var onecxIcons: Record<string, IconCache | null | undefined>;
}

export default globalThis