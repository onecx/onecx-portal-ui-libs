import { Router } from '@angular/router'
import { DataAction, RouterLink } from '../model/data-action'
import { Action } from '../components/page-header/page-header.component'

/**
 * Resolves a router link to a string, handling string, function, and Promise types
 */
export async function resolveRouterLink(routerLink: RouterLink): Promise<string> {
  if (typeof routerLink === 'string') {
    return routerLink
  } else if (typeof routerLink === 'function') {
    const result = routerLink()
    return typeof result === 'string' ? result : await result
  } else {
    return await routerLink
  }
}

/**
 * Base action handler that can be used directly or extended by components
 */
export async function handleAction(router: Router, action: Action | DataAction, data?: any): Promise<void> {
  if (action.routerLink) {
    const resolvedLink = await resolveRouterLink(action.routerLink)
    await router.navigate([resolvedLink])
  } else if ('callback' in action && typeof action.callback === 'function') {
    action.callback(data)
  } else if ('actionCallback' in action && typeof action.actionCallback === 'function') {
    action.actionCallback()
  }
}

/**
 * Synchronous wrapper for use in template event handlers where Promise return is not expected
 */
export function handleActionSync(router: Router, action: Action | DataAction, data?: any): void {
  void handleAction(router, action, data)
}