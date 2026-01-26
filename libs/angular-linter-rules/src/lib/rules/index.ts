import { noSubscribeAssignment } from './no-subscribe-assignment.rule'
import { noTranslateInstant } from './no-translate-instant.rule'

export const rules = {
  'no-subscribe-assignment': noSubscribeAssignment,
  'no-translate-instant': noTranslateInstant,
} as const
