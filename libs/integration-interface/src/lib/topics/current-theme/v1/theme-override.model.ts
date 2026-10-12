export enum OverrideType {
    OPTIMUS = 'OPTIMUS',
    CSS = 'CSS'
}

export interface ThemeOverride {
    type?: OverrideType;
    value?: string;
}

