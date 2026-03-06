import { IconCache } from "./topics/icons/v1/icon.model";

declare global {
    // eslint-disable-next-line no-var
    var onecxIcons: Record<string, IconCache | null | undefined> | undefined;
}

export default globalThis