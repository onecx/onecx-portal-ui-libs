export interface AnnouncementItem {
  creationDate?: string
  creationUser?: string
  modificationDate?: string
  modificationUser?: string
  version?: number
  id: string
  appId?: string
  content?: string
  endDate?: string
  priority?: AnnouncementPriorityType
  startDate?: string
  status?: AnnouncementStatus
  title?: string
  type?: AnnouncementType
}
export enum AnnouncementPriorityType {
  Important = 'IMPORTANT',
  Low = 'LOW',
  Normal = 'NORMAL',
}

enum AnnouncementStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
export enum AnnouncementType {
  Event = 'EVENT',
  Info = 'INFO',
  SystemMaintenance = 'SYSTEM_MAINTENANCE',
}
