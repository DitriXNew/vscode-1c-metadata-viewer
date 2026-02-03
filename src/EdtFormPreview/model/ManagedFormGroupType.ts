/**
 * ManagedFormGroupType - типы групп управляемой формы
 * @see com._1c.g5.v8.dt.form.model.ManagedFormGroupType
 */
export { ManagedFormGroupType } from './types';

export const ManagedFormGroupTypeValues = {
  ButtonGroup: 0,
  ColumnGroup: 1,
  CommandBar: 2,
  UsualGroup: 3,
  Popup: 4,
  Page: 5,
  Pages: 6,
  ContextMenu: 7,
  AutoCommandBar: 8,
  Navigator: 9,
  SelectedItemsActionsPanel: 10,
  RowActionsPanel: 11
} as const;
