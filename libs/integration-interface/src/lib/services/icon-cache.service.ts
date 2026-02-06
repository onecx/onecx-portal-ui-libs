import { IconClassType } from "../topics/icons/v1/icon-type"
import { OnecxIcon } from "../topics/icons/v1/icons.model"

declare global {
    interface Window {
        onecxIcons: Record<string, OnecxIcon | null | undefined>
    }
}

export function ensureIconCache(): void {
    window.onecxIcons ??= {}
}

export function generateClassName(name: string, classType: IconClassType): string {
    const safeName = normalizeIconName(name)
    return `onecx-theme-icon-${classType}-${safeName}`
}

export function normalizeIconName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]+/g, '-')
}
