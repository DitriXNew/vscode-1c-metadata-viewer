/**
 * Расширенные стили контролов 1С
 * Порт из EDT sources - детальные параметры для каждого типа контрола
 */
import { Color } from './Color';

// ============================================================================
// SKIN СТИЛИ ЭЛЕМЕНТОВ (из SkinXXXImpl классов)
// ============================================================================

/**
 * Базовые свойства скина элемента с кастомизацией
 */
export interface ISkinElementWithCustomization {
    font?: string;                  // PresentationFont
    backColor?: Color;             // PresentationColor
    textColor?: Color;             // PresentationColor
    borderColor?: Color;           // PresentationColor
}

/**
 * Свойства скина с тенью
 */
export interface ISkinElementWithShadow {
    shadowStartColor: Color;       // Начало градиента тени
    shadowCenterColor: Color;      // Середина
    shadowEndColor: Color;         // Конец
}

/**
 * Скин формы
 */
export interface ISkinForm extends ISkinElementWithShadow {
    viewerPadding: { left: number; top: number; right: number; bottom: number };
    viewerPrimarySelectionColor: Color;
    viewerSecondarySelectionColor: Color;
    backgroundColor: Color;
    borderColor: Color;
    titleStartColor: Color;
    titleEndColor: Color;
    titleFont: string;
    titleTextColor: Color;
    titlePadding: { left: number; top: number; right: number; bottom: number };
}

/**
 * Скин панели
 */
export interface ISkinPanel extends ISkinElementWithShadow {
    backColor: Color;
    borderColor: Color;
}

/**
 * Скин страниц (вкладок)
 */
export interface ISkinPages {
    titleFont: string;
    titleTextColor: Color;
}

/**
 * Скин календаря
 */
export interface ISkinCalendar {
    font: string;
    borderColor: Color;
    daySize: { width: number; height: number };
    shortMonthWidth: number;
    todayPanelHeight: number;
}

// ============================================================================
// СТИЛИ КНОПОК
// ============================================================================

/**
 * Стили кнопок 8.3 из ButtonContentUI83_Base.java
 */
export const Button83Styles = {
    // Кнопка по умолчанию (DefaultButton) - жёлтая
    defaultButtonBackground: new Color(255, 225, 0),      // kDefButtonBackColor #FFE100
    defaultButtonBorder: new Color(170, 150, 40),         // kDefButtonBorderColor #AA9628

    // Состояния overlay
    disabledOverlayColor: new Color(255, 255, 255),       // белый overlay
    disabledOverlayAlpha: 0.40,                           // 40% прозрачность (102/255)
    
    activeBorderOverlayColor: new Color(0, 0, 0),         // чёрный overlay рамки
    activeBorderOverlayAlpha: 0.30,                       // 30% прозрачность (76/255)
    
    hoveredOverlayAlpha: 0.09,                            // 9% (23/255)

    // Тени и градиенты
    shadowAlpha: 0.25,                                    // 25% (64/255)
    pressedInnerShadowAlpha: 0.15,
    bottomBorderOverlayAlpha: 0.15,
    lightGradientAlpha: 0.25,
    darkGradientAlpha: 0.08,

    // Геометрия
    cornerRadius: 2,
    
    // Разделитель
    separatorColor: new Color(196, 196, 196)              // kSeparatorColor #C4C4C4
};

/**
 * Стили меню галочки
 */
export const MenuCheckMarkStyles = {
    background: new Color(199, 220, 245),                 // kCheckMarkBack #C7DCF5
    frame: new Color(158, 182, 233)                       // kCheckMarkFrame #9EB6E9
};

// ============================================================================
// СТИЛИ ПОЛЕЙ ВВОДА
// ============================================================================

/**
 * Стили полей ввода из FieldControl.java
 */
export const InputFieldStyles = {
    hintColor: new Color(200, 200, 200),                  // HINT_COLOR #C8C8C8 - placeholder
    textDisabledColor: new Color(128, 128, 128),          // TEXT_DISABLED_COLOR #808080
    margin: 4                                              // MARGIN в px
};

// ============================================================================
// СТИЛИ ТАБЛИЦ (Grid)
// ============================================================================

/**
 * Полные стили таблиц 8.3 из Grid83UI.java
 */
export const Table83Styles = {
    // Фоны ячеек
    cellBackground: new Color(242, 242, 242),             // CELL_BACKGROUND_COLOR #F2F2F2
    alternativeRowColor: new Color(250, 250, 250),        // m_rgbAlternativeColor #FAFAFA

    // Иерархия
    hierarchyArrowColor: new Color(0, 0, 0),              // kHierarchyArrowColor

    // Выделение (Selection) - жёлтое!
    selectedBackground: new Color(250, 219, 31),          // k83SelectedBkgrndColor #FADB1F
    selectedText: new Color(0, 0, 0),                     // k83SelectedTextColor

    // Активная ячейка
    activeCellBackground: new Color(255, 255, 255),       // k83ActiveCellBackgroundColor
    activeCellBorder: new Color(252, 207, 0),             // k83ActiveCellBorderColor #FCCF00 золотистая
    inactiveCurrentCell: new Color(253, 241, 165),        // k83InactiveCurrentCellColor #FDF1A5

    // Область редактирования
    editingAreaActive: new Color(253, 241, 165),          // k83EditingAreaSelectionBackColorActive
    editingAreaInactive: new Color(254, 248, 210),        // k83EditingAreaSelectionBackColorInactive

    // Разделители горизонтальные
    horizontalDataDelimiter: new Color(230, 230, 230),    // k83HorizontalDataDelimiterColor #E6E6E6
    // Разделители вертикальные
    verticalDataDelimiter: new Color(255, 255, 255),      // k83VerticalDataDelimiterColor
    compoundCellDelimiter: new Color(255, 255, 255),      // k83CompoundCellDelimiterColor
    activeCellVerticalDelimiter: new Color(255, 255, 255),
    activeCellHorizontalDelimiter: new Color(230, 230, 230),
    activeCompoundCellDelimiter: new Color(255, 255, 255),

    // Заголовки
    headerDelimiter: new Color(204, 204, 204),            // k83HeaderDelimiterColor #CCCCCC
    headerText: new Color(77, 77, 77),                    // k83HeaderTextColor #4D4D4D
    headerAndDataDelimiter: new Color(204, 204, 204),     // k83HeaderAndDataDelimiterColor
    headerCompoundCellDelimiter: new Color(204, 204, 204),

    // Фокус и фиксированные области
    focusRectColor: new Color(83, 106, 194),              // k83FocusRectColor #536AC2 синий
    fixedAreaDelimiter: new Color(204, 204, 204),         // k83FixedAreaDelimiterColor
    internalCellRect: new Color(255, 255, 255),           // k83InternalCellRectColor
    buttonBackColor: new Color(255, 255, 255)             // kButtonBackColorRGB
};

/**
 * Стили таблиц дизайна 8.1 (классический)
 */
export const Table81Styles = {
    verticalDataDelimiter: new Color(206, 213, 218),      // m_verticalDataDelimiterColor #CED5DA
    compoundCellDelimiter: new Color(242, 242, 242),      // m_compoundCellDelimiterColor #F2F2F2
    activeCellVerticalDelimiter: new Color(181, 203, 229), // m_activeCellVerticalDelimiterColor #B5CBE5
    activeCompoundCellDelimiter: new Color(191, 214, 242)  // m_activeCompoundCellDelimiterColor #BFD6F2
};

/**
 * Размеры элементов таблицы
 */
export const TableSizes = {
    gridImageSize: { width: 16, height: 16 },             // kGridImageSize
    maxGridLineSize: 10,
    colIndentSize: { width: 2, height: 0 },               // kColIndentSize
    columnHierarchySize: 9,
    columnHierarchyOffset: 2,
    columnHierarchySize2: 11,
    headerSizeMargin: 5,                                  // kHeaderSizeMargin
    gridStdFontHeightMargin: 2,
    treeExpandIconWidth: 9,
    treeExpandIconHeight: 9,
    treeExpandIconShift: 8,
    columnTextHSpace: 3,                                  // gColumnTextHSpace
    columnItemsHSpace: 2,                                 // gColumnItemsHSpace
    columnItemsVSpace: 0,
    columnCheckVSpace: 2,
    textOffset: 1,                                        // kTextOffset
    textLeftOffset: 1,
    layerLineOffset: 11,
    layerLineWidth: 19,
    requiredFieldYOffset: 1,
    defaultGridCellWidth: 20,                             // kDefaultGridCellWidth
    hierListIcon83Size: { width: 13, height: 13 },
    minTableWidth: 100,                                   // Минимальная ширина таблицы
    minTableHeight: 50                                    // Минимальная высота таблицы
};

// ============================================================================
// СТИЛИ КАЛЕНДАРЯ
// ============================================================================

/**
 * Стили календаря из ICalendarColors.java
 */
export const CalendarStyles = {
    // Базовые цвета
    baseBrushColor: new Color(249, 249, 249),             // kNewUIBaseBrushColor #F9F9F9
    basePenColor: new Color(225, 225, 255),               // kNewUIBasePenColor #E1E1FF
    baseTextColor: new Color(77, 77, 77),                 // kNewUIBaseTextColor #4D4D4D
    todayTextColor: new Color(70, 151, 206),              // kNewUITodayTextColor #4697CE
    holidayPenColor: new Color(255, 74, 0),               // kNewUIHolydayPenColor #FF4A00

    // Рамки
    controlBoldBorderColor: new Color(230, 230, 230),     // kNewUIControlBoldBorderColor #E6E6E6
    controlThinBorderColor: new Color(102, 102, 102),     // kNewUIControlThinBorderColor #666666
    borderPenColor: new Color(222, 222, 222),             // kNewUIBorderPenColor #DEDEDE
    borderDarkPenColor: new Color(121, 121, 121),         // kNewUIBorderDarkPenColor #797979
    backBrushColor: new Color(255, 255, 255),             // kNewUIBackBrushColor (white)

    // Ячейки
    cellDarkColor: new Color(240, 240, 240),              // kNewUICellDarkColor #F0F0F0
    selectedCellBrushColor: new Color(96, 96, 96),        // kNewUISelectedCellBrushColor #606060
    selectedCellPenColor: new Color(78, 78, 78),          // kNewUISelectedCellPenColor #4E4E4E
    selectedCellTextColor: new Color(218, 218, 218),      // kNewUISelectedCellTextColor #DADADA

    // Текущий/Фокус
    currentPanelBorderColor: new Color(255, 215, 92),     // kNewUICurrentPanelBorderColor #FFD75C золотистая
    currentCellPenColor: new Color(0, 163, 61),           // kNewUICurrentCellPenColor #00A33D зелёная
    yearPopupBorderPenColor: new Color(138, 138, 138),    // kNewUIYearPopupBorderPenColor #8A8A8A

    // Дополнительные цвета для рендеринга
    panelBackground: new Color(255, 255, 255),            // Фон панели календаря (белый)
    headerBackground: new Color(249, 249, 249),           // Фон заголовка
    headerTitleTextColor: new Color(51, 51, 51),          // Цвет текста заголовка
    navButtonTextColor: new Color(100, 100, 100),         // Цвет стрелок навигации
    weekDayBackground: new Color(249, 249, 249),          // Фон строки дней недели
    weekDayTextColor: new Color(51, 51, 51),              // Цвет текста дней недели
    weekendTextColor: new Color(255, 74, 0),              // Цвет выходных (красноватый)
    weekNumberBackground: new Color(245, 245, 245),       // Фон номера недели
    weekNumberTextColor: new Color(160, 160, 160),        // Цвет текста номера недели
    otherMonthTextColor: new Color(180, 180, 180),        // Цвет дней других месяцев
    selectedDayBackground: new Color(255, 225, 0),        // Фон выбранного дня (жёлтый 1С)
    selectedDayTextColor: new Color(51, 51, 51),          // Текст выбранного дня
    hoveredDayBackground: new Color(250, 219, 31),        // Фон дня при наведении
    todayBorderColor: new Color(70, 151, 206),            // Рамка сегодняшнего дня

    // Размеры
    borderGap: 12                                          // kNewUIBorderGap
};

// ============================================================================
// СТИЛИ СКРОЛЛБАРОВ
// ============================================================================

/**
 * Стили полосы прокрутки из ScrollbarControl.java
 */
export const ScrollbarStyles = {
    normalColor: new Color(204, 204, 204),                // NORMAL_COLOR #CCCCCC
    hotColor: new Color(153, 153, 153),                   // HOT_COLOR #999999
    pressedColor: new Color(77, 77, 77)                   // PRESSED_COLOR #4D4D4D
};

// ============================================================================
// СТИЛИ ПРОЧИХ КОНТРОЛОВ
// ============================================================================

/**
 * Прогресс-бар
 */
export const ProgressBarStyles = {
    textColor: new Color(140, 96, 35)                     // PROGRESS_TEXT_COLOR #8C6023 коричневый
};

/**
 * Вкладки (TabControl)
 */
export const TabControlStyles = {
    textColorDisabled: new Color(153, 153, 153)           // TEXT_COLOR_DISABLED #999999
};

/**
 * Тумблер (TumblerControl)
 */
export const TumblerStyles = {
    backColor: new Color(255, 255, 255),                  // backColorRGB (auto)
    borderColor: new Color(160, 160, 160)                 // borderColorRGB (auto) #A0A0A0
};

/**
 * Статус просмотра (ViewStatusControl)
 */
export const ViewStatusStyles = {
    buttonBackground: new Color(255, 251, 206),           // BUTTON_BACK_RGB #FFFBCE светло-жёлтый
    titleTextColor: new Color(152, 141, 114),             // TITLE_TEXT_COLOR #988D72 коричневатый
    valueTextColor: new Color(85, 85, 85)                 // VALUE_TEXT_COLOR #555555 тёмно-серый
};

/**
 * Табличный документ (SpreadsheetDocumentControl)
 */
export const SpreadsheetStyles = {
    selectionColor: new Color(211, 217, 239),             // SELECTION_COLOR #D3D9EF голубоватый
    gridColor: new Color(229, 229, 229)                   // GRID_COLOR #E5E5E5
};

/**
 * Разделитель меню
 */
export const MenuSeparatorStyles = {
    lineColor: new Color(217, 213, 194)                   // LINE_RGB #D9D5C2 бежевая
};

/**
 * Drag & Drop
 */
export const DragDropStyles = {
    dndColor: new Color(0, 150, 0),                       // DND_COLOR #009600 зелёный
    borderWidth: 1,
    dropLineWidth: 3
};

// ============================================================================
// РАЗМЕРЫ ВКЛАДОК (TabDraw)
// ============================================================================

/**
 * Размеры вкладок
 */
export const TabSizes = {
    offset: 2,                                            // eOffset
    additionalOffsetX: 4,
    activeTabOffsetCx: 0,
    activeTabOffsetCy: 2,
    smallSlant1: 1,
    smallSlant2: 1,
    internalXOffset: 4,
    internalYOffset: 0,
    gradientDepth: 32,
    addDown: 1,
    leftRightHorIncrease: 4,
    closeButtonOffset: 8,
    slit: 6,                                              // kSlit - щель между вкладками (старый режим)
    slit83: -1,                                           // kSlit83 - нет щели (8.3)
    addSize: 4,
    picText: 6,                                           // расстояние картинка-текст
    beautyOffset: 2,
    tabPrepareSub: 5,
    maxPictureWidth: 96,
    maxPictureHeight: 64,
    defaultScrollerHeight: 14
};

// ============================================================================
// РАЗМЕРЫ ИКОНОК
// ============================================================================

/**
 * Стандартные размеры иконок
 */
export const IconSizes = {
    obj16: { width: 16, height: 16 },                     // Стандартный размер иконки
    small: { width: 12, height: 12 },
    medium: { width: 24, height: 24 },
    large: { width: 32, height: 32 }
};

// ============================================================================
// WYSIWYG ТЕНИ
// ============================================================================

export const ShadowStyles = {
    pixels: 4                                              // SHADOW_PIXELS
};

// ============================================================================
// ФУНКЦИИ СМЕШИВАНИЯ ЦВЕТОВ (из GraphicUtils.java)
// ============================================================================

/**
 * Alpha-blending цветов
 */
export function blendColors(background: Color, foreground: Color, alpha: number): Color {
    const beta = 1 - alpha;
    return new Color(
        Math.round(foreground.r * alpha + background.r * beta),
        Math.round(foreground.g * alpha + background.g * beta),
        Math.round(foreground.b * alpha + background.b * beta)
    );
}

/**
 * Осветление цвета
 */
export function lightenColor(source: Color, percent: number): Color {
    const factor = 255 * percent / 100;
    return new Color(
        Math.min(255, Math.round(source.r + factor)),
        Math.min(255, Math.round(source.g + factor)),
        Math.min(255, Math.round(source.b + factor))
    );
}

/**
 * Затемнение цвета
 */
export function darkenColor(source: Color, percent: number): Color {
    const factor = 255 * percent / 100;
    return new Color(
        Math.max(0, Math.round(source.r - factor)),
        Math.max(0, Math.round(source.g - factor)),
        Math.max(0, Math.round(source.b - factor))
    );
}

/**
 * Получение цвета для disabled состояния
 * Смешивает текст и фон для создания приглушённого цвета
 */
export function getDisabledColor(background: Color, foreground: Color): Color {
    // Упрощённая версия - усредняем с фоном
    return blendColors(background, foreground, 0.5);
}

// ============================================================================
// HIPPO THEME ПОЛНЫЕ СВОЙСТВА (HippoThemeImpl.java)
// ============================================================================

/**
 * Полные свойства темы HippoTheme
 * Значения для режима largeFont (современный Такси)
 */
export const HippoThemeLargeFont = {
    baseDpi: 96,
    averageCharacterWidth: 10,
    averageCharacterHeight: 16,
    defaultTextFieldWidth: 240,
    rightExtTooltipMaximumWidth: 300,
    alignedHoleMaximumWidth: 200,
    compressedElementMinimumWidth: 50,
    defaultCheckboxWidth: 16,
    defaultRadioWidth: 16,
    defaultTableImageWidth: 16,
    verticalScrollerWidth: 17,
    commandBarMinimumWidth: 29,
    
    // Горизонтальные отступы
    noneHorizontalSpacing: 0,
    halfHorizontalSpacing: 5,
    singleHorizontalSpacing: 10,
    oneAndHalfHorizontalSpacing: 15,
    doubleHorizontalSpacing: 20,
    
    // Вертикальные отступы
    noneVerticalSpacing: 0,
    halfVerticalSpacing: 4.5,
    singleVerticalSpacing: 9.0,
    oneAndHalfVerticalSpacing: 13.5,
    doubleVerticalSpacing: 18.0,
    
    // Отступы заголовка
    titleMargin: { top: 5, right: 20, bottom: 5, left: 10 },
    titleExtMargin: { top: 5, right: 20, bottom: 5, left: 10 },
    titleMarginAdditional: { top: 4, right: 4, bottom: 4, left: 4 },
    
    // Группы
    groupBackroundPadding: { horizontal: 5, vertical: 5 },
    groupHorizontalMargin: 10,
    groupLineMargin: 10,
    groupLineWidth: 2,
    
    // Гиперссылки
    hyperlinkImageMargin: 4,
    
    // Страницы (вкладки)
    pagesHorizontalMargin: 10,
    pagesHorizontalPadding: 10,
    
    // Таблицы
    tableTreeMargin: 40,
    tableHierarhicalListMargin: 20,
    tableVerticalMargin: 20,
    minTableWidth: 40,
    gridPictStdSize: 16,
    gridColumnHorIndent: 4.0,
    
    // Разделитель
    splitterWidth: 5,
    
    // Панель команд (mode83)
    cmdBarBetweenButtonsSpacing: 9,
    cmdBarSeparatorWidth: 20,
    
    // Высоты строк
    editRowHeight: 20,
    commandBarRowHeight: 26,
    commandBarRowGap: 14,
    buttonSingleRowHeight: 20,
    buttonMultiRowHeight: 20,
    normalRowHeight: 13,
    checkRadioRowHeight: 18,
    
    // Высоты строк таблицы
    tableUpperRowHeight: 27,
    tableUpperRowGap: 14,
    tableRowHeight: 26,
    tableRowGap: 13,
    tableLowerRowHeight: 28,
    tableLowerRowGap: 15,
    tableSingleRowHeight: 28,
    tableSingleRowGap: 15,
    tableHeaderLowerRowHeight: 29,
    tableHeaderLowerRowGap: 15,
    tableFooterLowerRowHeight: 29,
    tableFooterLowerRowGap: 15,
    tableHeaderUpperRowHeight: 27,
    tableHeaderUpperRowGap: 6,
    tableHeaderRowHeight: 27,
    tableHeaderRowGap: 14,
    tableFooterUpperRowHeight: 27,
    tableFooterUpperRowGap: 6,
    
    // Страницы (вкладки) высоты
    pagesTopRowWithoutPictureMarginHeight: 29,
    pagesTopRowWithoutPictureMarginGap: 16,
    pagesTopRowWithoutPicturePaddingHeight: 28,
    pagesTopRowWithPictureMarginHeight: 32,
    pagesTopRowWithPictureMarginGap: 19,
    pagesTopRowWithPicturePaddingHeight: 31,
    pagesDownRowMarginHeight: 28,
    pagesDownRowPaddingHeight: 23
};

/**
 * Свойства темы для режима classic (классический 8.2)
 */
export const HippoThemeClassic = {
    ...HippoThemeLargeFont,
    
    // Изменённые значения для classic
    averageCharacterWidth: 8,
    averageCharacterHeight: 13,
    defaultCheckboxWidth: 20,
    defaultRadioWidth: 20,
    
    // Вертикальные отступы (меньше)
    halfVerticalSpacing: 3.0,
    singleVerticalSpacing: 6.0,
    oneAndHalfVerticalSpacing: 9.0,
    doubleVerticalSpacing: 12.0,
    
    // Высоты строк (меньше)
    buttonSingleRowHeight: 19,
    buttonMultiRowHeight: 19,
    checkRadioRowHeight: 16,
    tableRowHeight: 19,
    
    // Панель команд (mode82 - компактнее)
    cmdBarBetweenButtonsSpacing: 3,
    cmdBarSeparatorWidth: 6
};

// ============================================================================
// ЭКСПОРТ ВСЕХ СТИЛЕЙ ОДНИМ ОБЪЕКТОМ
// ============================================================================

/**
 * Все стили 1С в одном объекте для удобного доступа
 */
export const All1CStyles = {
    button83: Button83Styles,
    menuCheckMark: MenuCheckMarkStyles,
    inputField: InputFieldStyles,
    table83: Table83Styles,
    table81: Table81Styles,
    tableSizes: TableSizes,
    calendar: CalendarStyles,
    scrollbar: ScrollbarStyles,
    progressBar: ProgressBarStyles,
    tabControl: TabControlStyles,
    tumbler: TumblerStyles,
    viewStatus: ViewStatusStyles,
    spreadsheet: SpreadsheetStyles,
    menuSeparator: MenuSeparatorStyles,
    dragDrop: DragDropStyles,
    tabSizes: TabSizes,
    iconSizes: IconSizes,
    shadow: ShadowStyles,
    hippoLargeFont: HippoThemeLargeFont,
    hippoClassic: HippoThemeClassic
};
