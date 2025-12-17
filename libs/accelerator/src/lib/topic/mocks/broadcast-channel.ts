export class BroadcastChannel {
    public static listeners: Record<string, ((m: any) => any)[]> = {}
    public static asyncCalls = false
    listener: ((m: any) => any) | undefined

    constructor(public name: string) { }

    postMessage(m: any) {
        if (BroadcastChannel.asyncCalls) {
            setTimeout(() => {
                BroadcastChannel.listeners[this.name]?.forEach((l) => l({ data: m, stopImmediatePropagation: () => { }, stopPropagation: () => { } }))
            }, 0)
        } else {
            BroadcastChannel.listeners[this.name]?.forEach((l) => l({ data: m, stopImmediatePropagation: () => { }, stopPropagation: () => { } }))
        }
    }

    addEventListener(event: string, listener: (m: any) => any) {
        this.listener = listener;
        BroadcastChannel.listeners[this.name] ??= [];
        BroadcastChannel.listeners[this.name].push(listener)
    }

    close() {
        BroadcastChannel.listeners[this.name] = BroadcastChannel.listeners[this.name].filter((l) => l !== this.listener)
    }
}