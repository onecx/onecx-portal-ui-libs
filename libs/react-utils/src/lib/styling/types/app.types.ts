import type { APIOptions } from 'primereact/api'
import type { ReactNode } from 'react'

export interface AppConfig {
  preset?: string
  primary?: string
  surface?: string
  isDarkTheme?: boolean
  isNewsActive?: boolean
  isRTL?: boolean
  storageKey?: string
  versions?: {
    name: string
    url: string
  }[]
  primereact: APIOptions
}

export interface AppContextProps extends Omit<AppConfig, 'metadata' | 'viewport' | 'font'> {
  children?: ReactNode
}

export interface AppProviderProps {
  preset?: string
  setPreset: (preset: string) => void
  primary?: string
  setPrimary: (primary: string) => void
  surface?: string
  setSurface: (surface: string) => void
  isDarkTheme?: boolean
  setDarkTheme: (isDarkTheme: boolean) => void
  isNewsActive?: boolean
  setNewsActive: (isNewsActive: boolean) => void
  isRTL?: boolean
  setRTL: (isNewsActive: boolean) => void
  storageKey?: string
  handleChangePrimary: (primary: string) => void
  handleChangeSurface: (surface: string) => void
  handleChangeDarkTheme: () => void
  onMenuButtonClick: () => void
  sidebarActive: boolean
  onMaskClick: () => void
}

export interface AppTopbarProps {
  showMenuButton?: boolean
  children?: ReactNode
}

export interface AppMenuItemData {
  href?: string
  to?: string
  icon?: string
  name?: string
  badge?: string
  children?: AppMenuItemData[]
}

export interface AppMenuItemProps {
  root?: boolean
  menu?: AppMenuItemData[]
}
