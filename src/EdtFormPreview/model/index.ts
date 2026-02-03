/**
 * EDT Form Model - экспорт всех типов модели форм EDT
 * Структура соответствует com._1c.g5.v8.dt.form.model
 */

// Все типы (type aliases) из единого файла
export * from './types';

// Дополнительные типы в отдельных файлах (содержат также const)
export * from './ManagedFormDecorationType';
export * from './ManagedFormFieldType';
export * from './ManagedFormGroupType';

// Базовые интерфейсы
export * from './LocalString';
export * from './LocalStringType';
export * from './LocalizedString';
export * from './NamedElement';
export * from './Color';
export * from './Font';
export * from './Border';
export * from './Picture';
export * from './Shortcut';
export * from './Period';
export * from './AccountTypeValue';
export * from './HeaderFooterFont';

// Базовые элементы
export * from './FormVisualEntity';
export * from './Titled';
export * from './Visible';
export * from './TitleStyle';
export * from './TooltipContainer';
export * from './UserVisible';
export * from './FormVisibilityValue';
export * from './FormItemTitle';
export * from './ConditionalAppearance';
export * from './HandlerContainer';
export * from './FormItemContainer';

// PropertyInfo и наследники
export { PropertyInfo, ElementDataSourceInfo } from './PropertyInfo';
export * from './PropertyInfoWithChildren';
export * from './ColumnPropertyInfo';
export * from './CombinedPropertyInfo';
export * from './RootPropertyInfo';

// Пути данных
export { DataPath, AbstractDataPath } from './DataPath';
export * from './MultiLanguageDataPath';
export * from './IrresolvableDataPath';
export * from './DataPathReferredObject';

// Обработчики событий
export { EventHandler, EventHandlerContainer } from './EventHandler';
export * from './EventHandlerExtension';
export * from './CommandHandler';
export { CommandHandlerContainer } from './CommandHandlerContainer';
export * from './CommandHandlerExtension';

// Контейнеры
export * from './AdditionContainer';
export * from './AdditionSource';

// Холдеры
export * from './ExtendedTooltipHolder';
export * from './ContextMenuHolder';
export * from './CommandBarHolder';
export * from './TableHolder';
export * from './RowActionsPanelHolder';
export * from './SelectedItemsActionsPanelHolder';

// ExtInfo базовые
export * from './ExtInfo';
export * from './GroupExtInfo';
export * from './FieldExtInfo';
export * from './DecorationExtInfo';
export * from './AdditionExtInfo';
export * from './TableExtInfo';

// GroupExtInfo наследники
export * from './UsualGroupExtInfo';
export { PagesGroupExtInfo } from './PagesGroupExtInfo';
export * from './PageGroupExtInfo';
export * from './CommandBarExtInfo';
export * from './ButtonGroupExtInfo';
export * from './ColumnGroupExtInfo';
export * from './PopupGroupExtInfo';

// FieldExtInfo наследники
export * from './InputFieldExtInfo';
export * from './LabelFieldExtInfo';
export { CheckBoxFieldExtInfo } from './CheckBoxFieldExtInfo';
export * from './ImageFieldExtInfo';
export { RadioButtonsFieldExtInfo } from './RadioButtonsFieldExtInfo';
export * from './CalendarFieldExtInfo';
export * from './ChartFieldExtInfo';
export { ProgressBarFieldExtInfo } from './ProgressBarFieldExtInfo';
export * from './TrackBarFieldExtInfo';
export * from './PeriodFieldExtInfo';
export * from './SpreadSheetDocFieldExtInfo';
export * from './TextDocFieldExtInfo';
export * from './FormattedDocFieldExtInfo';
export * from './HtmlFieldExtInfo';
export * from './GanttChartFieldExtInfo';
export * from './DendrogramFieldExtInfo';
export * from './PlannerFieldExtInfo';
export * from './GeographicalMapFieldExtInfo';
export * from './FlowchartFieldExtInfo';
export * from './PDFDocumentFieldExtInfo';

// DecorationExtInfo наследники
export * from './LabelDecorationExtInfo';
export * from './PictureDecorationExtInfo';

// TableExtInfo наследники
export * from './DynamicListTableExtInfo';

// AdditionExtInfo наследники
export * from './SearchStringAdditionExtInfo';
export * from './SearchControlAdditionExtInfo';
export * from './ViewStatusAdditionExtInfo';

// Основные элементы формы
export { FormItem } from './FormItem';
export * from './DataItem';
export * from './Group';
export * from './FormGroup';
export * from './FormField';
export * from './Decoration';
export * from './Table';
export * from './Button';
export * from './Addition';

// Tooltip и меню
export * from './ExtendedTooltip';
export * from './ContextMenu';
export { AutoCommandBar } from './AutoCommandBar';

// Панели действий
export * from './RowActionsPanel';
export * from './SelectedItemsActionsPanel';

// Реквизиты
export { AbstractFormAttribute } from './AbstractFormAttribute';
export { FormAttribute, FormAttributeColumn, FormAttributeAdditionalColumns, TypeDescription } from './FormAttribute';
export * from './FormAttributeExtInfo';

// Команды
export { FormCommand } from './FormCommand';
export * from './FormStandardCommand';
export * from './FormStandardCommandSource';
export * from './FormCommandHandlerContainer';
export * from './FormExtensionCommandHandlerContainer';
export * from './FormCommandInterface';
export * from './FormCommandInterfaceItem';
export * from './FormCommandInterfaceItems';
export * from './FormCommandPanelGlobalCommandSource';

// Параметры
export * from './FormParameter';
export * from './FormChoiceParameterLink';
export * from './FormChoiceListDesTimeValue';
export * from './FormTypeLink';
export * from './FormPicture';

// Значения списка
export * from './ValueListItem';
export * from './ValueListExtInfo';

// Источники данных
export * from './AbstractFormDataSourceInfo';
export { RootElementDataSourceInfo } from './RootElementDataSourceInfo';
export * from './IElementDataSourceInfoProvider';
export * from './IPropertyInfoProvider';

// Расширения
export * from './ExtensionAdoptedProperty';
export * from './NativeRenderEvent';
export * from './DataCompositionConditionalAppearance';

// FormExtInfo базовый и наследники
export * from './FormExtInfo';
export * from './ObjectFormExtInfo';
export * from './CatalogFormExtInfo';
export * from './DocumentFormExtInfo';
export * from './BusinessProcessFormExtInfo';
export * from './BusinessProcesFormExtInfo';
export * from './TaskFormExtInfo';
export * from './RecordSetFormExtInfo';
export * from './ReportFormExtInfo';
export { DynamicListExtInfo } from './DynamicListExtInfo';
export * from './DynamicListFormExtInfo';
export * from './InformationRegisterManagerFormExtInfo';
export * from './ConstantsFormExtInfo';
export * from './SettingsComposerFormExtInfo';
export * from './ChartOfCharacteristicTypesFormExtInfo';
export * from './TableObjectFormExtInfo';
export * from './TableRecordFormExtInfo';
export * from './CubeRecordFormExtInfo';
export * from './CubeRecordSetFormExtInfo';

// Специальные ExtInfo
export * from './ChartExtInfo';
export * from './DendrogramExtInfo';
export * from './GanttChartExtInfo';
export * from './GeographicalSchemaExtInfo';
export * from './GraphicalSchemeExtInfo';
export * from './PlannerExtInfo';
export * from './SpreadsheetDocumentExtInfo';

// Главный интерфейс формы
export * from './Form';
