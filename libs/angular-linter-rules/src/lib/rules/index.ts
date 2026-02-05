import { noSubscribeAssignment } from './no-subscribe-assignment.rule'
import { noTranslateInstant } from './no-translate-instant.rule'
import { preferTranslateParams } from './prefer-translate-params.rule'

export const rules = {
  'no-subscribe-assignment': noSubscribeAssignment,
  'no-translate-instant': noTranslateInstant,
  'prefer-translate-params': preferTranslateParams,
} as const
