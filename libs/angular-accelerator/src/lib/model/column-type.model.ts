export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  RELATIVE_DATE = 'RELATIVE_DATE',
  TRANSLATION_KEY = 'TRANSLATION_KEY',
  /**
   * @deprecated Will be removed with the next major v6 upgrade.
   * Please use pTemplate="column id + IdCell" or pTemplate="column id + IdTableCell"
   * depending on where you define the template override
   */
  CUSTOM = 'CUSTOM',
}
