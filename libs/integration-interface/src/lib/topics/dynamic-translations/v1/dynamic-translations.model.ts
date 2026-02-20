export enum DynamicTranslationsMessageType {
  REQUESTED = 'REQUESTED',
  RECEIVED = 'RECEIVED'
}

export interface TranslationsRequested {
  type: DynamicTranslationsMessageType.REQUESTED;
  locale: string;
  contexts: {
    name: string;
    version?: string;
  }[];
}

export interface TranslationsReceived {
  type: DynamicTranslationsMessageType.RECEIVED;
}
