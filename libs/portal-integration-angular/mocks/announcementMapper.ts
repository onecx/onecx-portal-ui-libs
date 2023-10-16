import { rest } from 'msw'
import { mockAnnouncements, mockAnnouncement } from './mockAnnouncement'

export const mockedGetAnnouncements = rest.get(
  '/ahm-api/announcement-help-management-rs/internal/announcements',
  (_, response, context) => {
    return response(context.json(mockAnnouncements))
  }
)

export const mockGetAnnouncement = rest.get(
  '/ahm-api/announcement-help-management-rs/internal/announcements/*',
  (_, response, context) => {
    return response(context.json(mockAnnouncement))
  }
)
