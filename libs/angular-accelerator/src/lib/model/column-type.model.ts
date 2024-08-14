export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  RELATIVE_DATE = 'RELATIVE_DATE',
  TRANSLATION_KEY = 'TRANSLATION_KEY',
  /**
   * @deprecated use column template override with column id
   */
  CUSTOM = 'CUSTOM',
}
