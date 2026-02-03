/**
 * EDT Form Model Types - все типы модели форм EDT
 * Автоматически сгенерировано скриптом merge-types.js
 * 
 * @see com._1c.g5.v8.dt.form.model
 */

/**
 * AdjustableBoolean - настраиваемое булево
 * Based on EDT com._1c.g5.v8.dt.form.model.AdjustableBoolean
 */
export type AdjustableBoolean = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AllowFormClose - разрешение закрытия формы
 * Based on EDT com._1c.g5.v8.dt.form.model.AllowFormClose
 */
export type AllowFormClose = 
    | 'Auto'
    | 'DontCheckData'
    | 'CheckData';

export type AppearanceVariantInCard = 
    | 'Auto'
    | 'Extended';

/**
 * AssociatedTableElementId - идентификатор связанного элемента таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.AssociatedTableElementId
 */
export type AssociatedTableElementId = 
    | 'Auto'
    | 'None';

/**
 * AutoCapitalizationOnTextInput - автокапитализация при вводе текста
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoCapitalizationOnTextInput
 */
export type AutoCapitalizationOnTextInput = 
    | 'Auto'
    | 'None'
    | 'Sentences'
    | 'Words'
    | 'AllCharacters';

/**
 * AutoChoiceIncomplete - автовыбор незаполненного
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoChoiceIncomplete
 */
export type AutoChoiceIncomplete = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoCorrectionOnTextInput - автокоррекция при вводе текста
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoCorrectionOnTextInput
 */
export type AutoCorrectionOnTextInput = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoHeight - автовысота
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoHeight
 */
export type AutoHeight = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoMarkIncomplete - автоотметка незаполненного
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoMarkIncomplete
 */
export type AutoMarkIncomplete = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoMaxHeight - автомаксимальная высота
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoMaxHeight
 */
export type AutoMaxHeight = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoMaxWidth - автомаксимальная ширина
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoMaxWidth
 */
export type AutoMaxWidth = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoNavigationOnChange - автонавигация при изменении
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoNavigationOnChange
 */
export type AutoNavigationOnChange = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type AutoSaveFormDataInSettings = 
    | 'DontUse'
    | 'Use';

/**
 * AutoSaveOnClose - автосохранение при закрытии
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoSaveOnClose
 */
export type AutoSaveOnClose = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * AutoShowClearButtonMode - режим отображения кнопки очистки
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoShowClearButtonMode
 */
export type AutoShowClearButtonMode = 
    | 'Auto'
    | 'Show'
    | 'Hide';

/**
 * AutoShowOpenButtonMode - режим отображения кнопки открытия
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoShowOpenButtonMode
 */
export type AutoShowOpenButtonMode = 
    | 'Auto'
    | 'Show'
    | 'Hide';

/**
 * AutoShowStateMode - режим автопоказа состояния
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoShowStateMode
 */
export type AutoShowStateMode = 
    | 'Auto'
    | 'DontShow'
    | 'ShowOnTop'
    | 'ShowAtBottom';

/**
 * AutoTime - автоматическое время
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoTime
 */
export type AutoTime = 
    | 'Auto'
    | 'DontUse'
    | 'CurrentDate'
    | 'StartOfDay'
    | 'EndOfDay';

/**
 * AutoWidth - автоширина
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoWidth
 */
export type AutoWidth = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type AutoWidthInTable = 
    | 'Auto'
    | 'ByData'
    | 'None'
    | 'ByDataAndTitle';

export type AutofillHint = 
    | 'DontUse'
    | 'FullName'
    | 'GivenName'
    | 'FamilyName'
    | 'MiddleName'
    | 'NamePrefix'
    | 'NameSuffix'
    | 'Street'
    | 'City'
    | 'Region'
    | 'Country'
    | 'PostalCode'
    | 'UserName'
    | 'Password'
    | 'NewPassword'
    | 'OneTimeCode'
    | 'Email'
    | 'PhoneNumber'
    | 'CreditCardNumber';

/**
 * BasicFormType - базовый тип формы
 * Based on EDT com._1c.g5.v8.dt.form.model.BasicFormType
 */
export type BasicFormType = 
    | 'Normal'
    | 'Desktop';

/**
 * Behavior - поведение
 * Based on EDT com._1c.g5.v8.dt.form.model.Behavior
 */
export type Behavior = 
    | 'Auto'
    | 'Normal'
    | 'Locked';

export type ButtonGroupRepresentation = 
    | 'Auto'
    | 'Usual'
    | 'Compact';

/**
 * ButtonImportance - важность кнопки
 * Based on EDT com._1c.g5.v8.dt.form.model.ButtonImportance
 */
export type ButtonImportance = 
    | 'Low'
    | 'Usual'
    | 'High';

export type ButtonLocationInCommandBar = 
    | 'Auto'
    | 'InAdditionalSubmenu'
    | 'InCommandBar'
    | 'InCommandBarAndInAdditionalSubmenu';

/**
 * ButtonRepresentation - представление кнопки
 * Based on EDT com._1c.g5.v8.dt.form.model.ButtonRepresentation
 */
export type ButtonRepresentation =
    | 'Auto'
    | 'Text'
    | 'Picture'
    | 'PictureAndText';

/**
 * ButtonShape - форма кнопки
 * Based on EDT com._1c.g5.v8.dt.form.model.ButtonShape
 */
export type ButtonShape = 
    | 'Usual'
    | 'Oval';

/**
 * ButtonShapeRepresentation - представление формы кнопки
 * Based on EDT com._1c.g5.v8.dt.form.model.ButtonShapeRepresentation
 */
export type ButtonShapeRepresentation = 
    | 'Auto'
    | 'WhenActive'
    | 'Always';

/**
 * CalendarShowMode - режим отображения календаря
 * Based on EDT com._1c.g5.v8.dt.form.model.CalendarShowMode
 */
export type CalendarShowMode = 
    | 'Auto'
    | 'Month'
    | 'Quarter'
    | 'HalfYear'
    | 'Year';

export type CardBehaviorOnVerticalCompression = 
    | 'Auto'
    | 'MoveItemsToSwipeablePages'
    | 'HideItems';

export type CardPictureAndTitleAlignVariant = 
    | 'Auto'
    | 'LeftHorizontallySidesVertically'
    | 'CenterHorizontallySidesVertically'
    | 'CenterHorizontallyCenterVertically';

export type CardRepresentationType = 
    | 'Usual'
    | 'Group';

export type CellActionsButtonViewMode = 
    | 'Auto'
    | 'DontShow'
    | 'ShowOnHover';

/**
 * CellHorizontalAlign - горизонтальное выравнивание ячейки
 * Based on EDT com._1c.g5.v8.dt.form.model.CellHorizontalAlign
 */
export type CellHorizontalAlign = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

export type CellHyperlinkDisplayVariant = 
    | 'Auto'
    | 'Always'
    | 'OnRowHover';

export type CellHyperlinkRepresentation = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type CellHyperlinksRepresentation = 
    | 'Auto'
    | 'AutoForSingle'
    | 'ForAll'
    | 'DontShow';

/**
 * CellVerticalAlign - вертикальное выравнивание ячейки
 * Based on EDT com._1c.g5.v8.dt.form.model.CellVerticalAlign
 */
export type CellVerticalAlign = 
    | 'Auto'
    | 'Top'
    | 'Center'
    | 'Bottom';

/**
 * ChartLabelType - тип подписей диаграммы
 * Based on EDT com._1c.g5.v8.dt.form.model.ChartLabelType
 */
export type ChartLabelType = 
    | 'None'
    | 'Value'
    | 'Percent'
    | 'Series'
    | 'ValuePercent'
    | 'SeriesValue'
    | 'SeriesPercent'
    | 'SeriesValuePercent';

/**
 * ChartType - тип диаграммы
 * Based on EDT com._1c.g5.v8.dt.form.model.ChartType
 */
export type ChartType = 
    | 'Line'
    | 'Step'
    | 'Area'
    | 'StackedArea'
    | 'NormalizedStackedArea'
    | 'Bar'
    | 'StackedBar'
    | 'NormalizedStackedBar'
    | 'Bar3D'
    | 'StackedBar3D'
    | 'NormalizedStackedBar3D'
    | 'Pie'
    | 'Pie3D'
    | 'Doughnut'
    | 'Doughnut3D'
    | 'Funnel'
    | 'Funnel3D'
    | 'Gauge'
    | 'Radar'
    | 'RadarFilled'
    | 'Scatter'
    | 'Bubble'
    | 'Stock'
    | 'Waterfall';

/**
 * CheckBoxKind - вид флажка
 * Based on EDT com._1c.g5.v8.dt.form.model.CheckBoxKind
 */
export type CheckBoxKind = 
    | 'CheckBox'
    | 'Tumbler'
    | 'Switch';

/**
 * ChildrenTitleLocation - расположение заголовков дочерних элементов
 * Based on EDT com._1c.g5.v8.dt.form.model.ChildrenTitleLocation
 */
export type ChildrenTitleLocation = 
    | 'Auto'
    | 'Top'
    | 'Left';

/**
 * ChoiceButtonRepresentation - представление кнопки выбора
 * Based on EDT com._1c.g5.v8.dt.form.model.ChoiceButtonRepresentation
 */
export type ChoiceButtonRepresentation = 
    | 'Auto'
    | 'ShowInDropList'
    | 'ShowInDropListAndInInputField'
    | 'ShowInInputField'
    | 'DontShow';

/**
 * ChoiceFoldersAndItems - выбор папок и элементов
 * Based on EDT com._1c.g5.v8.dt.form.model.ChoiceFoldersAndItems
 */
export type ChoiceFoldersAndItems = 
    | 'Auto'
    | 'Items'
    | 'Folders'
    | 'FoldersAndItems';

/**
 * ChoiceHistoryOnInput - история выбора при вводе
 * Based on EDT com._1c.g5.v8.dt.form.model.ChoiceHistoryOnInput
 */
export type ChoiceHistoryOnInput = 
    | 'Auto'
    | 'DontUse';

/**
 * ChoiceListButton - кнопка списка выбора
 * Based on EDT com._1c.g5.v8.dt.form.model.ChoiceListButton
 */
export type ChoiceListButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * ChoiceSelectOnComplete - выбор при завершении
 * Based on EDT com._1c.g5.v8.dt.form.model.ChoiceSelectOnComplete
 */
export type ChoiceSelectOnComplete = 
    | 'Auto'
    | 'DontSelect'
    | 'SelectFirstItem'
    | 'SelectLastItem';

/**
 * ClearButton - кнопка очистки
 * Based on EDT com._1c.g5.v8.dt.form.model.ClearButton
 */
export type ClearButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type ClientApplicationFormScaleVariant = 
    | 'Auto'
    | 'Compact'
    | 'Normal'
    | 'NormalIfPossible';

export type CollapseFormItemsByImportance = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type ColumnGrouping = 
    | 'Horizontal'
    | 'Vertical'
    | 'InCell';

/**
 * ColumnLocation - расположение колонки
 * Based on EDT com._1c.g5.v8.dt.form.model.ColumnLocation
 */
export type ColumnLocation = 
    | 'Auto'
    | 'None';

/**
 * ColumnSizeChangeMode - режим изменения размера колонок
 * Based on EDT com._1c.g5.v8.dt.form.model.ColumnSizeChangeMode
 */
export type ColumnSizeChangeMode = 
    | 'Auto'
    | 'ChangeSize'
    | 'DontChangeSize';

/**
 * ColumnsGroup - группировка колонок
 * Based on EDT com._1c.g5.v8.dt.form.model.ColumnsGroup
 */
export type ColumnsGroup = 
    | 'Horizontal'
    | 'Vertical'
    | 'InCell';

export type CommandActionPurpose = 
    | 'Usual'
    | 'Create'
    | 'Finish';

/**
 * CommandBarAutoFill - автозаполнение командной панели
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandBarAutoFill
 */
export type CommandBarAutoFill = 
    | 'Auto'
    | 'Fill'
    | 'DontFill';

/**
 * CommandBarButtonRepresentation - представление кнопок командной панели
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandBarButtonRepresentation
 */
export type CommandBarButtonRepresentation = 
    | 'Auto'
    | 'Text'
    | 'Picture'
    | 'TextPicture';

/**
 * CommandBarOrientation - ориентация командной панели
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandBarOrientation
 */
export type CommandBarOrientation = 
    | 'Horizontal'
    | 'Vertical';

/**
 * CommandGroup - группа команд
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandGroup
 */
export type CommandGroup = 
    | 'NavigationPanel'
    | 'CommandBar'
    | 'FormCommandBar';

/**
 * CommandKind - вид команды
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandKind
 */
export type CommandKind = 
    | 'Ordinary'
    | 'Setting'
    | 'Help';

/**
 * CommandPlacement - размещение команды
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandPlacement
 */
export type CommandPlacement = 
    | 'Auto'
    | 'InCommandBar'
    | 'InNavigationPanel';

/**
 * CommandSource - источник команды
 * Based on EDT com._1c.g5.v8.dt.form.model.CommandSource
 */
export type CommandSource = 
    | 'Auto'
    | 'Global'
    | 'Form';

/**
 * ContextMenuMode - режим контекстного меню
 * Based on EDT com._1c.g5.v8.dt.form.model.ContextMenuMode
 */
export type ContextMenuMode = 
    | 'Auto'
    | 'Enabled'
    | 'Disabled';

/**
 * ContextMenuRepresentation - представление контекстного меню
 * Based on EDT com._1c.g5.v8.dt.form.model.ContextMenuRepresentation
 */
export type ContextMenuRepresentation = 
    | 'Auto'
    | 'Button'
    | 'ButtonAndItems'
    | 'None';

/**
 * ControlBorderType - тип границы элемента управления
 * Based on EDT com._1c.g5.v8.dt.form.model.ControlBorderType
 */
export type ControlBorderType = 
    | 'Auto'
    | 'Single'
    | 'Double'
    | 'WithoutBorder';

/**
 * CreateButton - кнопка создания
 * Based on EDT com._1c.g5.v8.dt.form.model.CreateButton
 */
export type CreateButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * CurrentRowUse - использование текущей строки
 * Based on EDT com._1c.g5.v8.dt.form.model.CurrentRowUse
 */
export type CurrentRowUse = 
    | 'Auto'
    | 'AsCurrentRow'
    | 'AsChosenRow';

/**
 * DefaultRepresentation - представление по умолчанию
 * Based on EDT com._1c.g5.v8.dt.form.model.DefaultRepresentation
 */
export type DefaultRepresentation = 
    | 'Auto'
    | 'Picture'
    | 'Text'
    | 'PictureAndText'
    | 'TextPicture';

/**
 * DendrogramOrientation - ориентация дендрограммы
 * Based on EDT com._1c.g5.v8.dt.form.model.DendrogramOrientation
 */
export type DendrogramOrientation = 
    | 'Horizontal'
    | 'Vertical';

/**
 * DisplayImportance - важность отображения
 * @see com._1c.g5.v8.dt.form.model.DisplayImportance
 */
export type DisplayImportance = 
  | 'Auto'
  | 'VeryLow'
  | 'Low'
  | 'High'
  | 'VeryHigh';

export type DrawingSelectionShowMode = 
    | 'Show'
    | 'DontShow'
    | 'Auto';

/**
 * DropListButton - кнопка выпадающего списка
 * Based on EDT com._1c.g5.v8.dt.form.model.DropListButton
 */
export type DropListButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type DynamicListKeyType = 
    | 'Auto'
    | 'FieldValue'
    | 'RowKey'
    | 'RowNumber';

/**
 * EditMode - режим редактирования
 * Based on EDT com._1c.g5.v8.dt.form.model.EditMode
 */
export type EditMode = 
    | 'Auto'
    | 'Enter'
    | 'EnterOnInput';

/**
 * EditTextUpdate - обновление редактируемого текста
 * Based on EDT com._1c.g5.v8.dt.form.model.EditTextUpdate
 */
export type EditTextUpdate = 
    | 'Auto'
    | 'DontUpdate'
    | 'OnValueChange';

/**
 * Enabled - доступность
 * Based on EDT com._1c.g5.v8.dt.form.model.Enabled
 */
export type Enabled = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * ExtendedEdit - расширенное редактирование
 * Based on EDT com._1c.g5.v8.dt.form.model.ExtendedEdit
 */
export type ExtendedEdit = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type ExtendedMethodCallType = 
    | 'Before'
    | 'After'
    | 'Override'
    | 'ChangeAndValidate';

export type FileDragMode = 
    | 'AsFile'
    | 'AsFileRef';

/**
 * FillChecking - режим проверки заполнения
 */
export type FillChecking = 
    | 'Auto'
    | 'ShowError'
    | 'DontCheck';

/**
 * FlowchartMode - режим блок-схемы
 * Based on EDT com._1c.g5.v8.dt.form.model.FlowchartMode
 */
export type FlowchartMode = 
    | 'Auto'
    | 'LeftToRight'
    | 'TopToBottom';

export type FoldersAndItems = 
    | 'Auto'
    | 'Items'
    | 'Folders'
    | 'FoldersAndItems';

/**
 * FoldersAndItemsUse - использование для папок и элементов
 * Based on EDT com._1c.g5.v8.dt.metadata.common.FoldersAndItemsUse
 */
export type FoldersAndItemsUse = 
    | 'Items'
    | 'Folders'
    | 'FoldersAndItems';

/**
 * FooterHorizontalAlign - горизонтальное выравнивание подвала
 * Based on EDT com._1c.g5.v8.dt.form.model.FooterHorizontalAlign
 */
export type FooterHorizontalAlign = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * FooterTextWrap - перенос текста подвала
 * Based on EDT com._1c.g5.v8.dt.form.model.FooterTextWrap
 */
export type FooterTextWrap = 
    | 'Auto'
    | 'Wrap'
    | 'DontWrap';

/**
 * FormBaseFontVariant - вариант базового шрифта формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormBaseFontVariant
 */
export type FormBaseFontVariant = 
    | 'Auto'
    | 'Normal'
    | 'Compact';

/**
 * FormButtonPictureLocation - расположение картинки на кнопке формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormButtonPictureLocation
 */
export type FormButtonPictureLocation = 
    | 'Auto'
    | 'Left'
    | 'Right';

/**
 * FormChildrenAlign - выравнивание дочерних элементов формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormChildrenAlign
 */
export type FormChildrenAlign = 
    | 'Auto'
    | 'Left'
    | 'Right';

/**
 * FormChildrenGroup - группировка дочерних элементов формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormChildrenGroup
 */
export type FormChildrenGroup = 
    | 'Vertical'
    | 'AlwaysHorizontal'
    | 'HorizontalIfPossible';

/**
 * FormChildrenWidth - ширина дочерних элементов формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormChildrenWidth
 */
export type FormChildrenWidth = 
    | 'Auto'
    | 'ByMaster'
    | 'Equal';

export type FormCommandBarAppearanceMode = 
    | 'Auto'
    | 'CommandBar'
    | 'UsualGroup';

export type FormConversationsRepresentation = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * FormDateSelectionMode - режим выбора даты
 * Based on EDT com._1c.g5.v8.dt.form.model.FormDateSelectionMode
 */
export type FormDateSelectionMode = 
    | 'Auto'
    | 'Single'
    | 'Interval';

/**
 * FormElementCommandBarLocation - расположение командной панели элемента формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormElementCommandBarLocation
 */
export type FormElementCommandBarLocation = 
    | 'Auto'
    | 'None'
    | 'Top'
    | 'Bottom';

export type FormElementOrientation = 
    | 'Horizontal'
    | 'Vertical'
    | 'HorizontalIfPossible';

/**
 * FormElementTitleLocation - расположение заголовка элемента формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormElementTitleLocation
 */
export type FormElementTitleLocation = 
    | 'Auto'
    | 'Left'
    | 'Top'
    | 'Bottom'
    | 'Right'
    | 'None';

/**
 * FormEnterKeyBehavior - поведение при нажатии Enter
 * Based on EDT com._1c.g5.v8.dt.form.model.FormEnterKeyBehavior
 */
export type FormEnterKeyBehavior = 
    | 'DefaultButton'
    | 'ControlNavigation';

export type FormFixedInTable = 
    | 'None'
    | 'Left'
    | 'Right';

/**
 * FormHorizontalAlign - горизонтальное выравнивание формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormHorizontalAlign
 */
export type FormHorizontalAlign = 
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * FormItemSpacing - расстояние между элементами формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormItemSpacing
 */
export type FormItemSpacing = 
    | 'Auto'
    | 'None'
    | 'Half'
    | 'Single'
    | 'OneAndAHalf'
    | 'Double';

export type FormPagesRepresentation = 
    | 'None'
    | 'TabsOnTop'
    | 'TabsOnBottom'
    | 'TabsOnLeftHorizontal'
    | 'TabsOnRightHorizontal'
    | 'Swipe'
    | 'Auto';

export type FormPagesState = 
    | 'Auto'
    | 'TitlesAndCurrentPage'
    | 'Titles'
    | 'CurrentPage';

/**
 * FormPositionInCommandBar - позиция в командной панели формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormPositionInCommandBar
 */
export type FormPositionInCommandBar = 
    | 'Auto'
    | 'InAdditionalSubmenu'
    | 'InNavigationPanel';

export type FormProgressBarRepresentation = 
    | 'Smooth'
    | 'Broken'
    | 'BrokenTilt';

/**
 * FormPurpose - назначение формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormPurpose
 */
export type FormPurpose = 
    | 'Platform'
    | 'MobileDevice'
    | 'MobileApplication'
    | 'MobilePlatform';

/**
 * FormSaveDataInSettings - сохранение данных формы в настройках
 * Based on EDT com._1c.g5.v8.dt.form.model.FormSaveDataInSettings
 */
export type FormSaveDataInSettings = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type FormTableType = 
    | 'Auto'
    | 'List'
    | 'Cards';

export type FormTimeChoiceMode = 
    | 'Auto'
    | 'DontChoose'
    | 'CustomTime'
    | 'Interval1Minute'
    | 'Interval5Minutes'
    | 'Interval10Minutes'
    | 'Interval15Minutes'
    | 'Interval15And20Minutes'
    | 'Interval20Minutes'
    | 'Interval30Minutes'
    | 'Interval60Minutes';

/**
 * FormVerticalAlign - вертикальное выравнивание формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormVerticalAlign
 */
export type FormVerticalAlign = 
    | 'Top'
    | 'Center'
    | 'Bottom';

/**
 * FormWindowMode - режим окна формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormWindowMode
 */
export type FormWindowMode = 
    | 'Normal'
    | 'Maximized'
    | 'Minimized';

/**
 * FormWindowOpeningMode - режим открытия окна формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormWindowOpeningMode
 */
export type FormWindowOpeningMode = 
    | 'Auto'
    | 'Independent'
    | 'LockOwnerWindow'
    | 'LockWholeInterface';

export type FormWindowViewMode = 
    | 'Auto'
    | 'InMainWindow'
    | 'InDialogWindow';

/**
 * FunctionalOptions - функциональные опции
 * Based on EDT com._1c.g5.v8.dt.form.model.FunctionalOptions
 */
export type FunctionalOptions = string[];

export type GanttChartIntervalsSelectionMode = 
    | 'Auto'
    | 'Multiple'
    | 'Single'
    | 'None';

export type GanttChartTableLocation = 
    | 'Auto'
    | 'Left'
    | 'Right'
    | 'None';

/**
 * GanttChartTimeScale - масштаб времени диаграммы Ганта
 * Based on EDT com._1c.g5.v8.dt.form.model.GanttChartTimeScale
 */
export type GanttChartTimeScale = 
    | 'Auto'
    | 'Year'
    | 'HalfYear'
    | 'Quarter'
    | 'Month'
    | 'TenDays'
    | 'Week'
    | 'Day'
    | 'Hour'
    | 'Minute'
    | 'Second';

export type GanttChartValuesSelectionMode = 
    | 'Auto'
    | 'Multiple'
    | 'Single'
    | 'None';

/**
 * GeographicalMapShowMode - режим отображения географической карты
 * Based on EDT com._1c.g5.v8.dt.form.model.GeographicalMapShowMode
 */
export type GeographicalMapShowMode = 
    | 'Auto'
    | 'Map'
    | 'Satellite'
    | 'Hybrid';

/**
 * GroupHorizontalAlign - горизонтальное выравнивание группы
 * Based on EDT com._1c.g5.v8.dt.form.model.GroupHorizontalAlign
 */
export type GroupHorizontalAlign = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * GroupVerticalAlign - вертикальное выравнивание группы
 * Based on EDT com._1c.g5.v8.dt.form.model.GroupVerticalAlign
 */
export type GroupVerticalAlign = 
    | 'Auto'
    | 'Top'
    | 'Center'
    | 'Bottom';

/**
 * HeaderHorizontalAlign - горизонтальное выравнивание заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.HeaderHorizontalAlign
 */
export type HeaderHorizontalAlign = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * HeaderHorizontalTextAlign - горизонтальное выравнивание текста заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.HeaderHorizontalTextAlign
 */
export type HeaderHorizontalTextAlign = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * HeaderTextWrap - перенос текста заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.HeaderTextWrap
 */
export type HeaderTextWrap = 
    | 'Auto'
    | 'Wrap'
    | 'DontWrap';

export type HierarchyPanelLocation = 
    | 'Auto'
    | 'None';

/**
 * HorizontalStretch - горизонтальное растяжение
 * Based on EDT com._1c.g5.v8.dt.form.model.HorizontalStretch
 */
export type HorizontalStretch = 
    | 'Auto'
    | 'Stretch'
    | 'DontStretch';

/**
 * Hyperlink - гиперссылка
 * Based on EDT com._1c.g5.v8.dt.form.model.Hyperlink
 */
export type Hyperlink = boolean;

/**
 * IncompleteItemChoiceMode - режим выбора незаполненного элемента
 * Based on EDT com._1c.g5.v8.dt.form.model.IncompleteItemChoiceMode
 */
export type IncompleteItemChoiceMode = 
    | 'Auto'
    | 'OnEnterPressed'
    | 'OnActivate';

/**
 * InitialCurrentRow - начальная текущая строка
 * Based on EDT com._1c.g5.v8.dt.form.model.InitialCurrentRow
 */
export type InitialCurrentRow = 
    | 'Auto'
    | 'First'
    | 'None';

export type InputFieldMultipleValuePictureShape = 
    | 'Auto'
    | 'Square'
    | 'Circle';

export type InputFieldMultipleValuePictureSize = 
    | 'Auto'
    | 'Small'
    | 'Medium'
    | 'Large';

/**
 * InterfaceType - тип интерфейса формы
 * Based on EDT com._1c.g5.v8.dt.form.model.InterfaceType
 */
export type InterfaceType = 
    | 'Auto'
    | 'Full'
    | 'Taxi'
    | 'TaxiExclusive';

/**
 * ItemAlignment - выравнивание элементов
 * @see com._1c.g5.v8.dt.form.model.ItemHorizontalAlignment
 * @see com._1c.g5.v8.dt.form.model.ItemVerticalAlignment
 */
export type ItemHorizontalAlignment = 
  | 'Auto'
  | 'Left'
  | 'Center'
  | 'Right';

export type ItemVerticalAlignment = 
  | 'Auto'
  | 'Top'
  | 'Center'
  | 'Bottom';

/**
 * ItemHorizontalLocation - горизонтальное расположение элемента
 * Based on EDT com._1c.g5.v8.dt.form.model.ItemHorizontalLocation
 */
export type ItemHorizontalLocation = 
    | 'Auto'
    | 'Left'
    | 'Center'
    | 'Right';

/**
 * ItemVerticalLocation - вертикальное расположение элемента
 * Based on EDT com._1c.g5.v8.dt.form.model.ItemVerticalLocation
 */
export type ItemVerticalLocation = 
    | 'Auto'
    | 'Top'
    | 'Center'
    | 'Bottom';

/**
 * ListChoiceMode - режим выбора списка
 * Based on EDT com._1c.g5.v8.dt.form.model.ListChoiceMode
 */
export type ListChoiceMode = 
    | 'FromList'
    | 'ChoiceList';

export type LogFormElementHeightControlVariant = 
    | 'Auto'
    | 'InFormRows'
    | 'ByContent';

export type LogFormScrollMode = 
    | 'Auto'
    | 'Use'
    | 'UseIfNecessary'
    | 'UseWithoutStretch';

/**
 * LogFormScrolling - логирование прокрутки формы
 * Based on EDT com._1c.g5.v8.dt.form.model.LogFormScrolling
 */
export type LogFormScrolling = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type LogFormTableHeightControlVariant = 
    | 'Auto'
    | 'InFormRows'
    | 'InTableRows'
    | 'ByContent';

/**
 * ManagedFormAdditionType - тип добавления управляемой формы
 * Based on EDT com._1c.g5.v8.dt.form.model.ManagedFormAdditionType
 */
export type ManagedFormAdditionType = 
    | 'SearchString'
    | 'SearchControl'
    | 'ViewStatus';

/**
 * ManagedFormButtonType - тип кнопки управляемой формы
 * Based on EDT com._1c.g5.v8.dt.form.model.ManagedFormButtonType
 */
export type ManagedFormButtonType = 
    | 'UsualButton'
    | 'Hyperlink'
    | 'Label'
    | 'CommandBarButton'
    | 'CommandBarHyperlink';

/**
 * MarkingStyle - стиль маркировки
 * Based on EDT com._1c.g5.v8.dt.form.model.MarkingStyle
 */
export type MarkingStyle = 
    | 'None'
    | 'Dash'
    | 'Line'
    | 'Arc'
    | 'Point'
    | 'Gradient'
    | 'Smooth';

export type MenuElementPlacementArea = 
    | 'MainCmdsLeft'
    | 'AutoCmds'
    | 'UserCmds'
    | 'MainCmdsRight';

/**
 * MinMaxValueMode - режим минимального/максимального значения
 * Based on EDT com._1c.g5.v8.dt.form.model.MinMaxValueMode
 */
export type MinMaxValueMode = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * ModifiesStoredData - изменяет хранимые данные
 * Based on EDT com._1c.g5.v8.dt.form.model.ModifiesStoredData
 */
export type ModifiesStoredData = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * MultiLine - многострочность
 * Based on EDT com._1c.g5.v8.dt.form.model.MultiLine
 */
export type MultiLine = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type OnFormWindowOpenLockMode = 
    | 'Auto'
    | 'DontBlock'
    | 'LockOwner'
    | 'LockWholeInterface'
    | 'Independent'
    | 'LockOwnerWindow';

/**
 * OnMainServerUnavalableBehavior - поведение при недоступности главного сервера
 * Based on EDT com._1c.g5.v8.dt.form.model.OnMainServerUnavalableBehavior
 */
export type OnMainServerUnavalableBehavior = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * OnScreenKeyboardReturnKeyText - текст клавиши возврата экранной клавиатуры
 * Based on EDT com._1c.g5.v8.dt.form.model.OnScreenKeyboardReturnKeyText
 */
export type OnScreenKeyboardReturnKeyText = 
    | 'Default'
    | 'Continue'
    | 'Done'
    | 'Go'
    | 'Next'
    | 'Search'
    | 'Send';

/**
 * OnlyInAllActions - только во всех действиях
 * Based on EDT com._1c.g5.v8.dt.form.model.OnlyInAllActions
 */
export type OnlyInAllActions = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * OpenButton - кнопка открытия
 * Based on EDT com._1c.g5.v8.dt.form.model.OpenButton
 */
export type OpenButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type Origin = 
    | 'eSource'
    | 'eAutoGenerated'
    | 'eAddedFromContext'
    | 'eAddedFromMainConf';

/**
 * PagesRepresentation - представление страниц
 * Based on EDT com._1c.g5.v8.dt.form.model.PagesRepresentation
 */
export type PagesRepresentation = 
    | 'Auto'
    | 'TabsOnTop'
    | 'TabsOnBottom'
    | 'TabsOnLeft'
    | 'TabsOnRight'
    | 'None';

/**
 * PasswordMode - режим пароля
 * Based on EDT com._1c.g5.v8.dt.form.model.PasswordMode
 */
export type PasswordMode = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * PictureBackgroundShowMode - режим отображения фона картинки
 * Based on EDT com._1c.g5.v8.dt.form.model.PictureBackgroundShowMode
 */
export type PictureBackgroundShowMode = 
    | 'Auto'
    | 'Transparent'
    | 'LeftTopPixel';

export type PictureRepresentationEffect = 
    | 'Auto'
    | 'None'
    | 'Semitransparency'
    | 'SemitransparencyAndBlur';

/**
 * PictureSize - размер изображения
 * Based on EDT com._1c.g5.v8.dt.form.model.PictureSize
 */
export type PictureSize = 
    | 'Auto'
    | 'RealSize'
    | 'Stretch'
    | 'Proportionally'
    | 'Tile';

/**
 * PlannerShowMode - режим отображения планировщика
 * Based on EDT com._1c.g5.v8.dt.form.model.PlannerShowMode
 */
export type PlannerShowMode = 
    | 'Day'
    | 'Week'
    | 'Month'
    | 'Year';

/**
 * QuickChoice - быстрый выбор
 * Based on EDT com._1c.g5.v8.dt.form.model.QuickChoice
 */
export type QuickChoice = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * RadioButtonType - тип переключателя
 * Based on EDT com._1c.g5.v8.dt.form.model.RadioButtonType
 */
export type RadioButtonType = 
    | 'RadioButton'
    | 'Tumbler';

/**
 * ReadOnly - только чтение
 * Based on EDT com._1c.g5.v8.dt.form.model.ReadOnly
 */
export type ReadOnly = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * RefreshEditStateRepresentation - представление состояния обновления редактирования
 * Based on EDT com._1c.g5.v8.dt.form.model.RefreshEditStateRepresentation
 */
export type RefreshEditStateRepresentation = 
    | 'Auto'
    | 'RefreshOnEdit'
    | 'DontRefreshOnEdit';

/**
 * RefreshRequest - запрос обновления
 * Based on EDT com._1c.g5.v8.dt.form.model.RefreshRequest
 */
export type RefreshRequest = 
    | 'Auto'
    | 'DontRefresh'
    | 'RefreshOnOpen'
    | 'RefreshOnOpenChange';

export type RefreshRequestMethod = 
    | 'None'
    | 'PullFromTop'
    | 'PullFromBottom'
    | 'PullFromTopOrBottom';

/**
 * ReportFormType - тип формы отчёта
 * Based on EDT com._1c.g5.v8.dt.form.model.ReportFormType
 */
export type ReportFormType = 
    | 'Main'
    | 'Settings'
    | 'Variant';

/**
 * ReportResultViewMode - режим просмотра результата отчёта
 * Based on EDT com._1c.g5.v8.dt.form.model.ReportResultViewMode
 */
export type ReportResultViewMode = 
    | 'Auto'
    | 'Form'
    | 'Window';

/**
 * Representation - представление
 * Based on EDT com._1c.g5.v8.dt.form.model.Representation
 */
export type Representation = 
    | 'Auto'
    | 'Weak'
    | 'Normal'
    | 'Strong';

export type RepresentationInContextMenu = 
    | 'None'
    | 'AdditionalInContextMenu'
    | 'OnlyInContextMenu'
    | 'Auto';

/**
 * RepresentationType - тип представления
 * Based on EDT com._1c.g5.v8.dt.form.model.RepresentationType
 */
export type RepresentationType = 
    | 'Auto'
    | 'TextPicture'
    | 'Picture'
    | 'Text';

/**
 * RowFilter - фильтр строк
 * Based on EDT com._1c.g5.v8.dt.form.model.RowFilter
 */
export type RowFilter = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * RowPictureMode - режим картинки строки
 * Based on EDT com._1c.g5.v8.dt.form.model.RowPictureMode
 */
export type RowPictureMode = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * RowSizeChangeMode - режим изменения размера строк
 * Based on EDT com._1c.g5.v8.dt.form.model.RowSizeChangeMode
 */
export type RowSizeChangeMode = 
    | 'Auto'
    | 'ChangeSize'
    | 'DontChangeSize';

/**
 * RowsPicture - картинка строк
 * Based on EDT com._1c.g5.v8.dt.form.model.RowsPicture
 */
export type RowsPicture = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * SaveFormDataInSettings - сохранение данных формы в настройках
 * Based on EDT com._1c.g5.v8.dt.form.model.SaveFormDataInSettings
 */
export type SaveFormDataInSettings = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type SaveTableAppearance = 
    | 'Auto'
    | 'ForUser'
    | 'ByKeyForUser'
    | 'DontUse';

/**
 * ScrollOnCompressRepresentation - представление прокрутки при сжатии
 * Based on EDT com._1c.g5.v8.dt.form.model.ScrollOnCompressRepresentation
 */
export type ScrollOnCompressRepresentation = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type SearchControlLocation = 
    | 'Auto'
    | 'None'
    | 'CommandBar';

/**
 * SearchControlMode - режим элемента поиска
 * Based on EDT com._1c.g5.v8.dt.form.model.SearchControlMode
 */
export type SearchControlMode = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * SearchOnInput - поиск при вводе
 * Based on EDT com._1c.g5.v8.dt.form.model.SearchOnInput
 */
export type SearchOnInput = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type SearchStringLocation = 
    | 'Auto'
    | 'None'
    | 'CommandBar'
    | 'Top'
    | 'Bottom'
    | 'FormCaption'
    | 'PullFromTop';

/**
 * SearchStringMode - режим строки поиска
 * Based on EDT com._1c.g5.v8.dt.form.model.SearchStringMode
 */
export type SearchStringMode = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * SelectAllOnActivate - выбор всего при активации
 * Based on EDT com._1c.g5.v8.dt.form.model.SelectAllOnActivate
 */
export type SelectAllOnActivate = 
    | 'Auto'
    | 'Select'
    | 'DontSelect';

/**
 * SelectButton - кнопка выбора
 * Based on EDT com._1c.g5.v8.dt.form.model.SelectButton
 */
export type SelectButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type SelectedRowsUse = 
    | 'Use'
    | 'DontUse'
    | 'Auto';

/**
 * SelectionMode - режим выделения
 * Based on EDT com._1c.g5.v8.dt.form.model.SelectionMode
 */
export type SelectionMode = 
    | 'SingleRow'
    | 'MultiRow';

/**
 * SelectionShowMode - режим отображения выбора
 * Based on EDT com._1c.g5.v8.dt.form.model.SelectionShowMode
 */
export type SelectionShowMode = 
    | 'WhenActive'
    | 'Always';

/**
 * SettingsAutoSave - автосохранение настроек
 * Based on EDT com._1c.g5.v8.dt.form.model.SettingsAutoSave
 */
export type SettingsAutoSave = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * ShowCloseButton - показ кнопки закрытия
 * Based on EDT com._1c.g5.v8.dt.form.model.ShowCloseButton
 */
export type ShowCloseButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * ShowInFooter - показ в подвале
 * Based on EDT com._1c.g5.v8.dt.form.model.ShowInFooter
 */
export type ShowInFooter = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * ShowInHeader - показ в заголовке
 * Based on EDT com._1c.g5.v8.dt.form.model.ShowInHeader
 */
export type ShowInHeader = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * ShowTitle - показ заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.ShowTitle
 */
export type ShowTitle = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * SkipOnInput - пропуск при вводе
 * Based on EDT com._1c.g5.v8.dt.form.model.SkipOnInput
 */
export type SkipOnInput = 
    | 'Auto'
    | 'Skip'
    | 'DontSkip';

/**
 * SpecialTextInputMode - режим специального ввода текста
 * Based on EDT com._1c.g5.v8.dt.form.model.SpecialTextInputMode
 */
export type SpecialTextInputMode = 
    | 'Auto'
    | 'None'
    | 'EmailAddress'
    | 'PhoneNumber'
    | 'URL';

/**
 * SpellCheckingOnTextInput - проверка правописания при вводе текста
 * Based on EDT com._1c.g5.v8.dt.form.model.SpellCheckingOnTextInput
 */
export type SpellCheckingOnTextInput = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * SpinButton - кнопка прокрутки
 * Based on EDT com._1c.g5.v8.dt.form.model.SpinButton
 */
export type SpinButton = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

/**
 * SpinButtonMode - режим кнопки прокрутки
 * Based on EDT com._1c.g5.v8.dt.form.model.SpinButtonMode
 */
export type SpinButtonMode = 
    | 'Auto'
    | 'Always'
    | 'WhenInputField';

export type SpreadSheetDocumentScrollBarUse = 
    | 'DontScroll'
    | 'ScrollAlways'
    | 'ScrollAuto';

export type SpreadsheetDocumentMultipleSelectionPanelViewMode = 
    | 'Auto'
    | 'DontShow'
    | 'ShowOnMultipleSelection'
    | 'ShowAlways';

export type SpreadsheetDocumentPointerType = 
    | 'Regular'
    | 'Special';

export type TableBehaviorOnHorizontalCompression = 
    | 'Auto'
    | 'HideItemsByImportance'
    | 'MoveItemsByImportance';

export type TableCellMarkType = 
    | 'None'
    | 'ShapeUnderTextOval'
    | 'IconCircle';

export type TableCurrentRowUse = 
    | 'Auto'
    | 'Choice'
    | 'SelectionPresentation'
    | 'SelectionPresentationAndChoice';

/**
 * TableFieldEditMode - режим редактирования поля таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableFieldEditMode
 */
export type TableFieldEditMode = 
    | 'Directly'
    | 'Enter'
    | 'EnterOnInput'
    | 'Auto';

/**
 * TableInitialListView - начальное представление списка таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableInitialListView
 */
export type TableInitialListView = 
    | 'Auto'
    | 'Collapsed'
    | 'ExpandTopLevel';

export type TableInitialRowActivation = 
    | 'Auto'
    | 'Activate'
    | 'NoActivate';

/**
 * TableInitialTreeView - начальное представление дерева таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableInitialTreeView
 */
export type TableInitialTreeView = 
    | 'Auto'
    | 'Collapsed'
    | 'ExpandTopLevel';

/**
 * TableRepresentation - представление таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableRepresentation
 */
export type TableRepresentation = 
    | 'Auto'
    | 'List'
    | 'HierarchicalList'
    | 'Tree';

export type TableRowActionsShowType = 
    | 'Auto'
    | 'DontShow'
    | 'ShowOnHover'
    | 'ShowAlways';

/**
 * TableRowInputMode - режим ввода строки таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableRowInputMode
 */
export type TableRowInputMode = 
    | 'EnterOnInput'
    | 'EnterOnInputEnd';

export type TableRowSelectionMode = 
    | 'Cell'
    | 'Row'
    | 'Auto';

/**
 * TableScrollBarUse - использование полосы прокрутки таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableScrollBarUse
 */
export type TableScrollBarUse = 
    | 'UseIfNecessary'
    | 'Use'
    | 'DontUse';

/**
 * TableSelectionMode - режим выбора таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableSelectionMode
 */
export type TableSelectionMode = 
    | 'SingleRow'
    | 'MultiRow';

/**
 * TextBreakMode - режим разрыва текста
 * Based on EDT com._1c.g5.v8.dt.form.model.TextBreakMode
 */
export type TextBreakMode = 
    | 'Auto'
    | 'Wrap'
    | 'Clip';

/**
 * TextEdit - редактирование текста
 * Based on EDT com._1c.g5.v8.dt.form.model.TextEdit
 */
export type TextEdit = 
    | 'Auto'
    | 'Edit'
    | 'DontEdit';

export type TextSize = 
    | 'Enlarged'
    | 'Normal'
    | 'Reduced';

/**
 * TextWrap - перенос текста
 * Based on EDT com._1c.g5.v8.dt.form.model.TextWrap
 */
export type TextWrap = 
    | 'Auto'
    | 'Wrap'
    | 'DontWrap';

/**
 * TitleLocation - расположение заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.TitleLocation
 */
export type TitleLocation = 
    | 'Auto'
    | 'Left'
    | 'Top'
    | 'Right'
    | 'Bottom'
    | 'None';

/**
 * TitleShortcut - сочетание клавиш заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.TitleShortcut
 */
export type TitleShortcut = boolean;

/**
 * TitleTextColor - цвет текста заголовка
 * Based on EDT com._1c.g5.v8.dt.form.model.TitleTextColor
 */
export type TitleTextColor = 
    | 'Auto'
    | 'Style'
    | 'Custom';

export type TooltipRepresentation = 
    | 'Auto'
    | 'None'
    | 'Balloon'
    | 'Button'
    | 'ShowAuto'
    | 'ShowTop'
    | 'ShowLeft'
    | 'ShowBottom'
    | 'ShowRight';

export type TumblerRepresentation = 
    | 'Auto'
    | 'Text'
    | 'Picture';

/**
 * TypeDomainEnabled - включение домена типов
 * Based on EDT com._1c.g5.v8.dt.form.model.TypeDomainEnabled
 */
export type TypeDomainEnabled = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * UpdateOnDataChange - обновление при изменении данных
 * Based on EDT com._1c.g5.v8.dt.form.model.UpdateOnDataChange
 */
export type UpdateOnDataChange = 
    | 'Auto'
    | 'DontUpdate'
    | 'Update';

/**
 * UseOutput - использование вывода
 * Based on EDT com._1c.g5.v8.dt.form.model.UseOutput
 */
export type UseOutput = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

export type UsualGroupBehavior = 
    | 'Usual'
    | 'Collapsible'
    | 'PopUp'
    | 'Auto';

export type UsualGroupControlRepresentation = 
    | 'TitleHyperlink'
    | 'Picture'
    | 'Button'
    | 'ButtonInParentElement';

export type UsualGroupRepresentation = 
    | 'None'
    | 'StrongSeparation'
    | 'WeakSeparation'
    | 'NormalSeparation'
    | 'Auto';

export type UsualGroupThroughAlign = 
    | 'Use'
    | 'DontUse'
    | 'Auto';

/**
 * ValueListMode - режим списка значений
 * Based on EDT com._1c.g5.v8.dt.form.model.ValueListMode
 */
export type ValueListMode = 
    | 'Auto'
    | 'List'
    | 'Chooser';

/**
 * VerticalStretch - вертикальное растяжение
 * Based on EDT com._1c.g5.v8.dt.form.model.VerticalStretch
 */
export type VerticalStretch = 
    | 'Auto'
    | 'Stretch'
    | 'DontStretch';

/**
 * ViewMode - режим отображения
 * Based on EDT com._1c.g5.v8.dt.form.model.ViewMode
 */
export type ViewMode = 
    | 'Auto'
    | 'Normal'
    | 'Preview'
    | 'QuickChoice';

export type ViewModeApplicationOnSetReportResult = 
    | 'Auto'
    | 'Apply'
    | 'DontApply';

export type ViewScalingMode = 
    | 'Auto'
    | 'Normal'
    | 'Large';

export type ViewStatusLocation = 
    | 'Auto'
    | 'None'
    | 'Top'
    | 'Bottom';

/**
 * ViewStatusMode - режим статуса просмотра
 * Based on EDT com._1c.g5.v8.dt.form.model.ViewStatusMode
 */
export type ViewStatusMode = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * WarningOnEditRepresentation - представление предупреждения при редактировании
 * Based on EDT com._1c.g5.v8.dt.form.model.WarningOnEditRepresentation
 */
export type WarningOnEditRepresentation = 
    | 'Auto'
    | 'Show'
    | 'DontShow';

export type WidthVariantInCard = 
    | 'Auto'
    | 'Full'
    | 'Half';

/**
 * ShowTitle851 - показывать заголовок (8.5.1)
 * Based on EDT com._1c.g5.v8.dt.form.model.ShowTitle851
 */
export type ShowTitle851 = 
    | 'DontShow'  // false
    | 'Show'      // true
    | 'Auto';     // auto

/**
 * NativeRenderEventType - тип события нативного рендеринга
 * Based on EDT com._1c.g5.v8.dt.form.model.NativeRenderEventType
 */
export type NativeRenderEventType = 
    | 'None'
    | 'LeftMouseButton'
    | 'RightMouseButton'
    | 'Scroll'
    | 'SelectById';

/**
 * ColumnHeight - высота колонки
 */
export type ColumnHeight = number;

/**
 * ColumnWidth - ширина колонки
 */
export type ColumnWidth = number;

/**
 * FieldHeight - высота поля
 */
export type FieldHeight = number;

/**
 * FieldWidth - ширина поля
 */
export type FieldWidth = number;

/**
 * TableHeight - высота таблицы
 */
export type TableHeight = number;

/**
 * TableWidth - ширина таблицы
 */
export type TableWidth = number;

/**
 * BorderStyle - стиль границы
 * Based on EDT com._1c.g5.v8.dt.form.model.BorderStyle
 */
export type BorderStyle = 
    | 'None'
    | 'Solid'
    | 'Double'
    | 'Dash'
    | 'DashDot'
    | 'DashDotDot'
    | 'Dot'
    | 'Groove'
    | 'Ridge'
    | 'Inset'
    | 'Outset'
    | 'Single'
    | 'Underline'
    | 'Overline'
    | 'Emboss'
    | 'Etched'
    | 'DashSmall'
    | 'Rounded';

/**
 * ComparisonType - тип сравнения
 * Based on EDT com._1c.g5.v8.dt.form.model.ComparisonType
 */
export type ComparisonType = 
    | 'Equal'
    | 'NotEqual'
    | 'Less'
    | 'LessOrEqual'
    | 'Greater'
    | 'GreaterOrEqual'
    | 'Contains'
    | 'NotContains'
    | 'InList'
    | 'NotInList'
    | 'InHierarchy'
    | 'NotInHierarchy'
    | 'InListByHierarchy'
    | 'NotInListByHierarchy'
    | 'Filled'
    | 'NotFilled'
    | 'BeginsWith'
    | 'NotBeginsWith'
    | 'Like'
    | 'NotLike';

/**
 * PostingModeUse - использование режима проведения
 * Based on EDT com._1c.g5.v8.dt.form.model.PostingModeUse
 */
export type PostingModeUse = 
    | 'Auto'
    | 'Allow'
    | 'Deny';

/**
 * ElementDataSourceInfoType - тип информации об источнике данных элемента
 * Based on EDT com._1c.g5.v8.dt.form.model.ElementDataSourceInfoType
 */
export type ElementDataSourceInfoType = 
    | 'ELEMENT'
    | 'CURRENT_DATA'
    | 'EMPTY_CURRENT_DATA'
    | 'PROPERTY_INFO'
    | 'PROPERTY_INFO_TABLE';

/**
 * ManagedFormDecorationType - типы декораций управляемой формы
 * Based on EDT com._1c.g5.v8.dt.form.model.ManagedFormDecorationType
 */
export type ManagedFormDecorationType = 
    | 'Picture'
    | 'Label';

/**
 * ManagedFormGroupType - типы групп управляемой формы
 * Based on EDT com._1c.g5.v8.dt.form.model.ManagedFormGroupType
 */
export type ManagedFormGroupType = 
    | 'UsualGroup'
    | 'Pages'
    | 'Page'
    | 'ColumnGroup'
    | 'ButtonGroup'
    | 'Popup'
    | 'CommandBar';

/**
 * ManagedFormFieldType - типы полей управляемой формы
 * Based on EDT com._1c.g5.v8.dt.form.model.ManagedFormFieldType
 */
export type ManagedFormFieldType = 
    | 'None'                        // 0
    | 'HTMLDocumentField'           // 1
    | 'InputField'                  // 2
    | 'GeographicalSchemaField'     // 3
    | 'GraphicalSchemaField'        // 4
    | 'DendrogramField'             // 5
    | 'ChartField'                  // 6
    | 'GanttChartField'             // 7
    | 'ProgressBarField'            // 8
    | 'CalendarField'               // 9
    | 'PictureField'                // 10
    | 'LabelField'                  // 11
    | 'RadioButtonField'            // 12
    | 'TrackBarField'               // 13
    | 'SpreadsheetDocumentField'    // 14
    | 'TextDocumentField'           // 15
    | 'CheckBoxField'               // 16
    | 'FormattedDocumentField'      // 17
    | 'PlannerField'                // 18
    | 'PeriodField'                 // 19
    | 'PDFDocumentField';           // 20
