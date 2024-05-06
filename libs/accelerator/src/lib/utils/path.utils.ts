type ocxLocation = Location & { deploymentPath: string; applicationPath: string }

/**
 * returns the standard window.location enriched with deploymentPath and applicationPath.
 * deploymentPath contains the part of the URL which identifies the sub folder to which the shell is deployed
 * applicationPath contains the rest of the path which is identifying the workspace and the application to be opened
 */
export function getLocation(): ocxLocation {
  const baseHref = document.getElementsByTagName('base')[0]?.href ?? window.location.origin + '/'
  const location = window.location as ocxLocation
  location.deploymentPath = baseHref.substring(window.location.origin.length)
  location.applicationPath = window.location.href.substring(baseHref.length - 1)

  return location
}
