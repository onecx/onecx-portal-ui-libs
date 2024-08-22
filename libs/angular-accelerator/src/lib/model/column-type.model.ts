export enum ColumnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  RELATIVE_DATE = 'RELATIVE_DATE',
  TRANSLATION_KEY = 'TRANSLATION_KEY',
  /**
   * @deprecated Will be removed with the next major v6 upgrade.
   * Please use pTemplate="column id + IdCell" in DataTable or
   * pTemplate="column id + IdTableCell" in DataView and InteractiveDataView
   * e.g. for a column with the id 'status' in DataTable use pTemplate="statusIdCell"
   */
  CUSTOM = 'CUSTOM',
}
