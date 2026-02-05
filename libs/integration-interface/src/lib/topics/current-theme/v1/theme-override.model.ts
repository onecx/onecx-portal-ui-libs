export enum OverrideType {
    PRIMENG = 'PRIMENG',
    CSS = 'CSS'
}

export interface ThemeOverride {
    type?: OverrideType;
    value?: string;
}

