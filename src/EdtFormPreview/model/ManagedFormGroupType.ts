/**
 * ManagedFormGroupType - типы групп управляемой формы
 * @see com._1c.g5.v8.dt.form.model.ManagedFormGroupType
 */
export type ManagedFormGroupType = 
  | 'ButtonGroup'      // 0 - Группа кнопок
  | 'ColumnGroup'      // 1 - Группа колонок
  | 'CommandBar'       // 2 - Командная панель
  | 'UsualGroup'       // 3 - Обычная группа
  | 'Popup'            // 4 - Всплывающее меню
  | 'Page'             // 5 - Страница
  | 'Pages'            // 6 - Страницы (вкладки)
  | 'ContextMenu'      // 7 - Контекстное меню
  | 'AutoCommandBar'   // 8 - Авто командная панель
  | 'Navigator'        // 9 - Навигатор
  | 'SelectedItemsActionsPanel'  // 10 - Панель действий выбранных элементов
  | 'RowActionsPanel'; // 11 - Панель действий строки

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
