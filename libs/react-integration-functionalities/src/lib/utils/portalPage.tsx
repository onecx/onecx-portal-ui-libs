import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useAppState, useUserService } from '@onecx/react-integration-interface'
import { useTranslation } from 'react-i18next'

/**
 * Props for PortalPage wrapper.
 */
export interface PortalPageProps {
  children: ReactNode
  permission?: string | string[]
  helpArticleId?: string
  pageName?: string
  applicationId?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_CONTAINER_STYLE: CSSProperties = {
  display: 'block',
  padding: 'var(--page-padding, 1rem)',
  height: '100%',
}

/**
 * React PortalPage implementation mirroring the Angular portal-page component.
 */
export const PortalPage = ({
  children,
  permission,
  helpArticleId,
  pageName,
  applicationId,
  className,
  style,
}: PortalPageProps) => {
  const { currentPage$ } = useAppState()
  const { hasPermission } = useUserService()
  const { t } = useTranslation()
  const [hasAccess, setHasAccess] = useState(!permission)

  useEffect(() => {
    let isMounted = true

    const checkPermission = async () => {
      if (!permission) {
        setHasAccess(true)
        return
      }
      try {
        const result = await hasPermission(permission)
        if (isMounted) {
          setHasAccess(result)
        }
      } catch (error) {
        console.warn('Failed to resolve permission for PortalPage', error)
        if (isMounted) {
          setHasAccess(false)
        }
      }
    }

    checkPermission()

    return () => {
      isMounted = false
    }
  }, [hasPermission, permission])

  useEffect(() => {
    if (!helpArticleId && typeof location !== 'undefined') {
      console.warn(
        `Portal Page on url ${location.pathname} does not have 'helpArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }

    const path = typeof document !== 'undefined' ? document.location.pathname : ''

    const permissionValue = Array.isArray(permission) ? permission.join(',') : (permission ?? '')

    currentPage$.publish({
      path,
      helpArticleId: helpArticleId ?? '',
      permission: permissionValue,
      pageName: pageName ?? '',
      applicationId: applicationId ?? '',
    })
  }, [applicationId, currentPage$, helpArticleId, pageName, permission])

  const containerStyle = useMemo(() => ({ ...DEFAULT_CONTAINER_STYLE, ...style }), [style])
  const containerClassName = ['portal-page', className].filter(Boolean).join(' ')
  const unauthorizedTitle = t('OCX_PORTAL_PAGE.UNAUTHORIZED_TITLE')
  const unauthorizedMessage = t('OCX_PORTAL_PAGE.UNAUTHORIZED_MESSAGE')
  const missingPermissionMessage = t('OCX_PORTAL_PAGE.MISSING_PERMISSION', { permission })

  return (
    <div className={containerClassName} style={containerStyle}>
      <div className="content-wrapper">
        {hasAccess ? (
          children
        ) : (
          <>
            <h3>{unauthorizedTitle}</h3>
            <p>
              {unauthorizedMessage} <span>{missingPermissionMessage}</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
