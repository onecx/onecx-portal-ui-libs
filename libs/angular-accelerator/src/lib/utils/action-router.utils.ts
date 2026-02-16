import { Router } from '@angular/router'
import { DataAction, RouterLink } from '../model/data-action'
import { Action } from '../components/page-header/page-header.component'

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

export async function onActionClick(router: Router, action: Action | DataAction, data?: any): Promise<void> {
    if (action.routerLink) {
    const resolvedLink = await resolveRouterLink(action.routerLink)
    await router.navigate([resolvedLink])
    } else {
        if ('callback' in action && typeof action.callback === 'function') {
            action.callback(data)
        } else if ('actionCallback' in action && typeof action.actionCallback === 'function') {
            action.actionCallback()
        }
    }
}