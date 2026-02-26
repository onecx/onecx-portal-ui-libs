export enum ShellCapability {
  CURRENT_LOCATION_TOPIC = 'currentLocationTopic',
  PARAMETERS_TOPIC = 'parametersTopic',
  ACTIVENESS_AWARE_MENUS = 'activenessAwareMenus',
  DYNAMIC_TRANSLATIONS_TOPIC = 'dynamicTranslationsTopic',
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Window {
    'onecx-shell-capabilities'?: ShellCapability[];
  }
}
