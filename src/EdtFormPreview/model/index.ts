/**
 * EDT Form Model - экспорт всех типов модели форм EDT
 * Структура соответствует com._1c.g5.v8.dt.form.model
 */

// Базовые типы
export * from './FormVisualEntity';
export * from './Titled';
export * from './Visible';
export * from './TitleStyle';
export * from './TooltipContainer';
export * from './EventHandler';
export * from './DataPath';
export * from './ItemAlignment';
export * from './DisplayImportance';
export * from './PropertyInfo';

// Базовые интерфейсы и утилиты
export * from './LocalString';
export * from './LocalStringType';
export * from './Color';
export * from './Font';
export * from './Border';
export * from './Picture';
export * from './Shortcut';
export * from './Period';
export * from './UserVisible';
export * from './FormVisibilityValue';
export * from './FormItemTitle';
export * from './ConditionalAppearance';
export * from './HandlerContainer';
export * from './FormItemContainer';

// Enums - базовые типы
export * from './ManagedFormGroupType';
export * from './ManagedFormFieldType';
export * from './ManagedFormDecorationType';
export * from './ManagedFormAdditionType';

// Enums - группы
export * from './FormChildrenGroup';
export * from './FormChildrenAlign';
export * from './FormChildrenWidth';
export * from './FormItemSpacing';
export * from './ChildrenTitleLocation';
export * from './ColumnsGroup';
export * from './PagesRepresentation';

// Enums - заголовки и расположение
export * from './FormElementTitleLocation';
export * from './TitleLocation';
export * from './TitleShortcut';
export * from './TitleTextColor';
export * from './HeaderHorizontalAlign';
export * from './HeaderHorizontalTextAlign';
export * from './HeaderTextWrap';
export * from './FooterHorizontalAlign';
export * from './FooterTextWrap';

// Enums - выравнивание
export * from './FormHorizontalAlign';
export * from './FormVerticalAlign';
export * from './GroupHorizontalAlign';
export * from './GroupVerticalAlign';
export * from './ItemHorizontalLocation';
export * from './ItemVerticalLocation';
export * from './CellHorizontalAlign';
export * from './CellVerticalAlign';
export * from './HorizontalStretch';
export * from './VerticalStretch';

// Enums - размеры
export * from './AutoWidth';
export * from './AutoHeight';
export * from './AutoMaxWidth';
export * from './AutoMaxHeight';
export * from './ColumnWidth';
export * from './ColumnHeight';
export * from './FieldWidth';
export * from './FieldHeight';
export * from './TableWidth';
export * from './TableHeight';
export * from './ColumnLocation';
export * from './ColumnSizeChangeMode';
export * from './RowSizeChangeMode';

// Enums - кнопки
export * from './ButtonShape';
export * from './ButtonShapeRepresentation';
export * from './ButtonImportance';
export * from './ButtonRepresentation';
export * from './FormButtonPictureLocation';
export * from './ManagedFormButtonType';
export * from './ChoiceButtonRepresentation';
export * from './AutoShowOpenButtonMode';
export * from './AutoShowClearButtonMode';
export * from './CreateButton';
export * from './SelectButton';
export * from './OpenButton';
export * from './ClearButton';
export * from './SpinButton';
export * from './ChoiceListButton';
export * from './DropListButton';
export * from './SpinButtonMode';

// Enums - поля ввода
export * from './EditTextUpdate';
export * from './ChoiceHistoryOnInput';
export * from './SearchOnInput';
export * from './TextEdit';
export * from './TextWrap';
export * from './TextBreakMode';
export * from './MultiLine';
export * from './ExtendedEdit';
export * from './PasswordMode';
export * from './SpecialTextInputMode';
export * from './AutoCapitalizationOnTextInput';
export * from './AutoCorrectionOnTextInput';
export * from './SpellCheckingOnTextInput';
export * from './OnScreenKeyboardReturnKeyText';

// Enums - выбор
export * from './QuickChoice';
export * from './ListChoiceMode';
export * from './ChoiceFoldersAndItems';
export * from './ChoiceSelectOnComplete';
export * from './IncompleteItemChoiceMode';
export * from './AutoChoiceIncomplete';
export * from './SelectAllOnActivate';
export * from './TypeDomainEnabled';
export * from './ValueListMode';
export * from './FoldersAndItemsUse';

// Enums - таблицы
export * from './TableSelectionMode';
export * from './TableRowInputMode';
export * from './TableScrollBarUse';
export * from './TableRepresentation';
export * from './TableFieldEditMode';
export * from './TableInitialTreeView';
export * from './TableInitialListView';
export * from './CurrentRowUse';
export * from './RowFilter';
export * from './RowPictureMode';
export * from './RowsPicture';
export * from './SelectionMode';
export * from './SelectionShowMode';
export * from './EditMode';
export * from './InitialCurrentRow';
export * from './UpdateOnDataChange';
export * from './RefreshRequest';

// Enums - формы
export * from './BasicFormType';
export * from './FormPurpose';
export * from './FormWindowMode';
export * from './FormWindowOpeningMode';
export * from './FormEnterKeyBehavior';
export * from './FormBaseFontVariant';
export * from './FormSaveDataInSettings';
export * from './FormPositionInCommandBar';
export * from './AllowFormClose';
export * from './AutoSaveOnClose';
export * from './ShowTitle';
export * from './ShowCloseButton';
export * from './RefreshEditStateRepresentation';
export * from './ReportFormType';
export * from './SettingsAutoSave';
export * from './LogFormScrolling';
export * from './ScrollOnCompressRepresentation';
export * from './FormDateSelectionMode';
export * from './WarningOnEditRepresentation';

// Enums - командная панель
export * from './CommandBarAutoFill';
export * from './CommandBarOrientation';
export * from './CommandBarButtonRepresentation';
export * from './AutoCommandBar';

// Enums - контекстное меню
export * from './ContextMenuMode';
export * from './ContextMenuRepresentation';

// Enums - команды
export * from './CommandKind';
export * from './CommandSource';
export * from './CommandPlacement';
export * from './CommandGroup';
export * from './OnlyInAllActions';
export * from './ModifiesStoredData';
export * from './Representation';
export * from './RepresentationType';

// Enums - состояния
export * from './Enabled';
export * from './ReadOnly';
export * from './SkipOnInput';
export * from './Behavior';
export * from './ShowInHeader';
export * from './ShowInFooter';
export * from './SaveFormDataInSettings';
export * from './DefaultRepresentation';
export * from './ViewMode';
export * from './UseOutput';

// Enums - разные
export * from './CheckBoxKind';
export * from './RadioButtonType';
export * from './PictureSize';
export * from './MarkingStyle';
export * from './AutoTime';
export * from './AutoMarkIncomplete';
export * from './AutoNavigationOnChange';
export * from './MinMaxValueMode';
export * from './ControlBorderType';
export * from './Hyperlink';
export * from './FunctionalOptions';
export * from './AssociatedTableElementId';
export * from './SearchStringMode';
export * from './SearchControlMode';
export * from './ViewStatusMode';
export * from './HeaderFooterFont';

// Enums - специальные поля
export * from './CalendarShowMode';
export * from './ChartType';
export * from './ChartLabelType';
export * from './GanttChartTimeScale';
export * from './PlannerShowMode';
export * from './DendrogramOrientation';
export * from './GeographicalMapShowMode';
export * from './FlowchartMode';

// Tooltip
export * from './ExtendedTooltip';

// ExtInfo базовые
export * from './ExtInfo';
export * from './GroupExtInfo';
export * from './FieldExtInfo';
export * from './DecorationExtInfo';

// GroupExtInfo наследники
export * from './UsualGroupExtInfo';
export * from './PagesGroupExtInfo';
export * from './PageGroupExtInfo';
export * from './CommandBarExtInfo';
export * from './ButtonGroupExtInfo';
export * from './ColumnGroupExtInfo';
export * from './PopupGroupExtInfo';

// FieldExtInfo наследники
export * from './InputFieldExtInfo';
export * from './LabelFieldExtInfo';
export * from './CheckBoxFieldExtInfo';
export * from './ImageFieldExtInfo';
export * from './RadioButtonsFieldExtInfo';
export * from './CalendarFieldExtInfo';
export * from './ChartFieldExtInfo';
export * from './ProgressBarFieldExtInfo';
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

// Основные элементы формы
export * from './FormItem';
export * from './DataItem';
export * from './Group';
export * from './FormGroup';
export * from './FormField';
export * from './Decoration';
export * from './Table';
export * from './Button';

// TableExtInfo наследники
export * from './TableExtInfo';
export * from './DynamicListTableExtInfo';

// AdditionExtInfo наследники
export * from './AdditionExtInfo';
export * from './SearchStringAdditionExtInfo';
export * from './SearchControlAdditionExtInfo';
export * from './ViewStatusAdditionExtInfo';

// Элемент дополнения
export * from './Addition';

// Реквизиты, команды, параметры
export * from './FormAttribute';
export * from './FormCommand';
export * from './FormParameter';
export * from './ContextMenu';

// Главный интерфейс формы
export * from './Form';

// Дополнительные типы элементов
export * from './FormStandardCommand';
export * from './ValueListItem';

// Типы FormExtInfo для разных видов форм
export * from './FormExtInfo';
export * from './CatalogFormExtInfo';
export * from './DocumentFormExtInfo';
export * from './ObjectFormExtInfo';
export * from './BusinessProcessFormExtInfo';
export * from './TaskFormExtInfo';
export * from './RecordSetFormExtInfo';
export * from './ReportFormExtInfo';
export * from './DynamicListExtInfo';
export * from './DynamicListFormExtInfo';
export * from './InformationRegisterManagerFormExtInfo';
export * from './ConstantsFormExtInfo';
export * from './SettingsComposerFormExtInfo';
export * from './ChartOfCharacteristicTypesFormExtInfo';

// Дополнительные интерфейсы
export * from './PropertyInfo';

// Новые типы из EDT 8.5 (только те, которые ещё не экспортированы)

// Типы данных
export * from './AbstractFormDataSourceInfo';
export * from './AccountTypeValue';
export * from './AdditionContainer';
export * from './AdditionSource';
export * from './AppearanceVariantInCard';
export * from './AutofillHint';
export * from './AutoWidthInTable';
export * from './CardBehaviorOnVerticalCompression';
export * from './CardPictureAndTitleAlignVariant';
export * from './CardRepresentationType';
export * from './CellHyperlinkDisplayVariant';
export * from './CellHyperlinkRepresentation';
export * from './CellHyperlinksRepresentation';
export * from './ColumnPropertyInfo';
export * from './CombinedPropertyInfo';
export * from './CommandBarHolder';
export * from './CommandHandler';
export * from './CommandHandlerExtension';
export * from './ContextMenuHolder';
export * from './DataPathReferredObject';
export * from './ExtendedMethodCallType';
export * from './ExtendedTooltipHolder';
export * from './ExtensionAdoptedProperty';
export * from './EventHandlerExtension';
export * from './FoldersAndItems';
export * from './FormChoiceParameterLink';
export * from './FormCommandHandlerContainer';
export * from './FormCommandInterfaceItem';
export * from './FormCommandInterfaceItems';
export * from './FormExtensionCommandHandlerContainer';
export * from './FormPagesState';
export * from './FormPicture';
export * from './FormStandardCommandSource';
export * from './FormTableType';
export * from './FormTimeChoiceMode';
export * from './FormTypeLink';
export * from './HierarchyPanelLocation';
export * from './InputFieldMultipleValuePictureShape';
export * from './InputFieldMultipleValuePictureSize';
export * from './IrresolvableDataPath';
export * from './LogFormElementHeightControlVariant';
export * from './LogFormTableHeightControlVariant';
export * from './MultiLanguageDataPath';
export * from './NativeRenderEvent';
export * from './PictureRepresentationEffect';
export * from './PropertyInfoWithChildren';
export * from './RefreshRequestMethod';
export * from './RootElementDataSourceInfo';
export * from './RootPropertyInfo';
export * from './RowActionsPanel';
export * from './RowActionsPanelHolder';
export * from './SaveTableAppearance';
export * from './SearchControlLocation';
export * from './SearchStringLocation';
export * from './SelectedItemsActionsPanel';
export * from './SelectedItemsActionsPanelHolder';
export * from './TableBehaviorOnHorizontalCompression';
export * from './TableCellMarkType';
export * from './TableCurrentRowUse';
export * from './TableHolder';
export * from './TableInitialRowActivation';
export * from './TableRowActionsShowType';
export * from './TableRowSelectionMode';
export * from './TextSize';
export * from './TooltipRepresentation';
export * from './WidthVariantInCard';

// ExtInfo для разных типов объектов
export * from './BusinessProcesFormExtInfo';
export * from './ChartExtInfo';
export * from './CubeRecordFormExtInfo';
export * from './CubeRecordSetFormExtInfo';
export * from './DendrogramExtInfo';
export * from './GanttChartExtInfo';
export * from './GeographicalSchemaExtInfo';
export * from './GraphicalSchemeExtInfo';
export * from './PlannerExtInfo';
export * from './SpreadsheetDocumentExtInfo';
export * from './TableObjectFormExtInfo';
export * from './TableRecordFormExtInfo';
export * from './ValueListExtInfo';

// Интерфейсы провайдеров
export * from './IElementDataSourceInfoProvider';
export * from './IPropertyInfoProvider';

// Дополнительные типы формы
export * from './InterfaceType';
export * from './FormElementCommandBarLocation';
export * from './FormCommandPanelGlobalCommandSource';
export * from './OnMainServerUnavalableBehavior';
export * from './DataCompositionConditionalAppearance';
export * from './FormCommandInterface';
export * from './PictureBackgroundShowMode';
export * from './FormFixedInTable';
export * from './AutoShowStateMode';
export * from './ReportResultViewMode';
export * from './AdjustableBoolean';