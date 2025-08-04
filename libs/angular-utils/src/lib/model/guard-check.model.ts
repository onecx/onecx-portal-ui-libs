/**
 * Router state guard check model.
 * Used to check if the guard checks are requested in the navigation state by different application.
 * This is used to perform guard checks without navigating.
 * It is expected that the guards wrappers will use this information to perform checks without navigating.
 */
export enum GUARD_CHECK {
  ACTIVATE = 'activateGuardCheckRequest',
  DEACTIVATE = 'deactivateGuardCheckRequest',
}
