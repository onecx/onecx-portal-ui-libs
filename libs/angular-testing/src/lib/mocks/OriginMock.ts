export function ensureOriginMockExists() {
  if (!global.origin) {
    global.origin = ''
  }
}
