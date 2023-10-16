const today = new Date()
const tomorrow = new Date()
const yesterday = new Date()
tomorrow.setDate(today.getDate() + 1)
yesterday.setDate(today.getDate() - 1)

export const mockAnnouncements = [
  {
    endDate: tomorrow.toISOString(),
    id: 'da85c265-49c0-471d-9960-bac5b3a5421d',
    priority: 'IMPORTANT',
    startDate: yesterday.toISOString(),
    status: 'ACTIVE',
    title: "We'd like to inform you that you're currently looking at the announcement component.",
    type: 'SYSTEM_MAINTENANCE',
  },
]

export const mockAnnouncement = {
  endDate: tomorrow.toISOString(),
  id: 'da85c265-49c0-471d-9960-bac5b3a5421d',
  priority: 'IMPORTANT',
  startDate: yesterday.toISOString(),
  status: 'ACTIVE',
  title: "We'd like to inform you that you're currently looking at the announcement component.",
  type: 'SYSTEM_MAINTENANCE',
}
