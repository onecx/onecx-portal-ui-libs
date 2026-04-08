type ocxLocation = Location & { deploymentPath: string; applicationPath: string }

/**
 * returns the standard window.location enriched with deploymentPath and applicationPath.
 * deploymentPath contains the part of the URL which identifies the sub folder to which the shell is deployed
 * applicationPath contains the rest of the path which is identifying the workspace and the application to be opened
 */
export function getLocation(): ocxLocation {
  const doc = globalThis.document as Document | undefined
  const loc = globalThis.location as Location | undefined
  if (!doc || !loc) {
    throw new Error('getLocation() is only available in browser environments')
  }

  const baseHref = doc.getElementsByTagName('base')[0]?.href ?? loc.origin + '/'
  const location = loc as ocxLocation
  location.deploymentPath = baseHref.substring(loc.origin.length)
  location.applicationPath = loc.href.substring(baseHref.length - 1)

  return location
}
