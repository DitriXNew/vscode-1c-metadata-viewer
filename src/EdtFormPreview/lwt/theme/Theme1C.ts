/**
 * Полная система тем 1С:Предприятие
 * Порт цветов, шрифтов и размеров из EDT sources:
 * - UiUtil.java
 * - ICalendarColors.java
 * - HippoThemeImpl.java
 * - ButtonContentUI83_Base.java
 * - Grid83UI.java
 * - PresentationColorScheme.java
 */
import { Color } from './Color';
import { Font } from './Font';

// ============================================================================
// ПЕРЕЧИСЛЕНИЯ ВАРИАНТОВ ИНТЕРФЕЙСА
// ============================================================================

/**
 * Варианты интерфейса клиента 1С
 * Из com._1c.g5.v8.dt.form.service.ClientInterfaceVariant
 */
export enum ClientInterfaceVariant {
    NONE = 0,                   // Не определён
    CLASSIC_NOT_MANAGED = 1,    // Классический неуправляемый (8.0-8.1)
    CLASSIC_MANAGED = 2,        // Классический управляемый (8.2)
    TAXI = 4,                   // Такси (8.3) - основной современный
    TAXI_MOBILE = 8,            // Такси мобильный
    TAXI_MOBILE_PHONE = 16,     // Такси мобильный телефон
    TAXI_MOBILE_SMALL = 32,     // Такси мобильный маленький
    VERSION8_5 = 64,            // Интерфейс 8.5 (десктоп)
    VERSION8_5_MOBILE = 128     // Интерфейс 8.5 (мобильный)
}

/**
 * Проверка является ли интерфейс режимом 8.3+ (Такси или 8.5)
 */
export function isDrawingMode83(variant: ClientInterfaceVariant): boolean {
    return (variant & 0xF8) !== 0; // TAXI, TAXI_MOBILE, TAXI_MOBILE_PHONE, TAXI_MOBILE_SMALL, VERSION8_5, VERSION8_5_MOBILE
}

/**
 * Проверка является ли интерфейс семейством 8.5
 */
export function isVersion85Family(variant: ClientInterfaceVariant): boolean {
    return (variant & 0xC0) !== 0; // VERSION8_5, VERSION8_5_MOBILE
}

// ============================================================================
// БАЗОВЫЕ ЦВЕТА ПАЛИТРЫ 1С (G5)
// ============================================================================

/**
 * Цвета палитры G5 из PresentationColorScheme
 * Используются для построения адаптивных тем
 */
export const G5Palette = {
    FirstBrand: new Color(255, 221, 0),     // Жёлтый бренд 1С
    SecondBrand: new Color(39, 139, 249),   // Синий бренд
    Red: new Color(255, 62, 51),            // Красный (ошибки)
    Orange: new Color(255, 160, 26),        // Оранжевый (предупреждения)
    Yellow: new Color(255, 213, 0),         // Жёлтый
    Green: new Color(12, 220, 64),          // Зелёный (успех)
    LightBlue: new Color(50, 193, 250),     // Голубой
    Blue: new Color(0, 122, 255),           // Синий
    Violet: new Color(88, 85, 250),         // Фиолетовый
    Purple: new Color(185, 46, 255),        // Пурпурный
    Pink: new Color(255, 21, 204),          // Розовый
    TextLight: new Color(129, 129, 138),    // Текст (светлая тема)
    TextDark: new Color(132, 132, 140),     // Текст (тёмная тема)
    Background: new Color(153, 153, 153),   // Фон (серый)
    AdditionalLight: new Color(255, 255, 255), // Дополнительный (светлый)
    AdditionalDark: new Color(26, 26, 26),     // Дополнительный (тёмный)
    GrayLight: new Color(200, 200, 200),    // Серый (светлый)
    GrayDark: new Color(110, 110, 110)      // Серый (тёмный)
};

// ============================================================================
// ИНТЕРФЕЙС РАСШИРЕННОЙ ТЕМЫ 1С
// ============================================================================

/**
 * Полный интерфейс темы 1С со всеми цветами, шрифтами и размерами
 */
export interface I1CTheme {
    // Название темы
    name: string;
    variant: ClientInterfaceVariant;

    // === БАЗОВЫЕ ЦВЕТА ===
    formBackground: Color;          // Фон формы
    formTextColor: Color;           // Основной текст формы
    borderColor: Color;             // Стандартная граница
    disabledBorderColor: Color;     // Граница отключённых элементов

    // === ЦВЕТА ТЕКСТА ===
    autoTextColor: Color;           // Авто-текст (основной) - RGB(51,51,51)
    baseTextColor: Color;           // Базовый текст - RGB(77,77,77)
    disabledTextColor: Color;       // Отключённый текст - RGB(128,128,128)
    placeholderColor: Color;        // Подсказка в поле - RGB(200,200,200)
    negativeTextColor: Color;       // Отрицательные значения - красный

    // === ГИПЕРССЫЛКИ ===
    hyperlinkColor: Color;          // Гиперссылка - RGB(28,85,174)
    hyperlinkHoverColor: Color;     // Гиперссылка при наведении
    hyperlinkDisabledColor: Color;  // Неактивная гиперссылка

    // === ПОЛЯ ВВОДА ===
    inputBackground: Color;         // Фон поля
    inputForeground: Color;         // Текст поля
    inputBorder: Color;             // Граница поля - RGB(160,160,160)
    inputBorderFocused: Color;      // Граница в фокусе
    inputBorderReadonly: Color;     // Граница только чтение - RGB(215,215,215)
    inputBorderDisabled: Color;     // Граница отключённого

    // === КНОПКИ (Обычные) ===
    buttonBackground: Color;        // Фон кнопки
    buttonForeground: Color;        // Текст кнопки - RGB(77,77,77)
    buttonBorder: Color;            // Граница кнопки - RGB(178,178,178)
    buttonBackgroundHover: Color;   // Фон при наведении - RGB(250,219,31) жёлтый!
    buttonBackgroundPressed: Color; // Фон при нажатии
    buttonSeparator: Color;         // Разделитель кнопок - RGB(196,196,196)

    // === КНОПКИ (По умолчанию - жёлтые) ===
    defaultButtonBackground: Color; // Фон кнопки по умолчанию - RGB(255,225,0)
    defaultButtonForeground: Color; // Текст кнопки по умолчанию - чёрный
    defaultButtonBorder: Color;     // Граница кнопки по умолчанию - RGB(170,150,40)

    // === ГРУППЫ ===
    groupBackground: Color;         // Фон группы - RGB(249,249,249)
    groupBorder: Color;             // Граница группы - RGB(222,222,222)
    groupTitleColor: Color;         // Заголовок группы - RGB(0,150,70) зелёный!
    groupLineWidth: number;         // Ширина линии группы

    // === МЕНЮ ===
    menuTextColor: Color;           // Текст меню - RGB(77,77,77)
    menuShortcutColor: Color;       // Горячие клавиши - RGB(153,153,153)
    menuSelectBackground: Color;    // Фон выделения - RGB(250,219,31) жёлтый!
    menuSeparator: Color;           // Разделитель меню - RGB(217,213,194)
    menuCheckMarkBack: Color;       // Фон галочки - RGB(199,220,245)
    menuCheckMarkFrame: Color;      // Рамка галочки - RGB(158,182,233)

    // === ТАБЛИЦЫ ===
    tableBackground: Color;         // Фон таблицы - RGB(250,250,250)
    tableAlternateRow: Color;       // Чередующиеся строки
    tableHeaderBackground: Color;   // Фон заголовка
    tableHeaderForeground: Color;   // Текст заголовка - RGB(77,77,77)
    tableHeaderSeparator: Color;    // Разделитель заголовка - RGB(204,204,204)
    tableGridHorizontal: Color;     // Горизонтальная сетка - RGB(230,230,230)
    tableGridVertical: Color;       // Вертикальная сетка - RGB(255,255,255)
    tableSelectionBackground: Color; // Фон выделения - RGB(250,219,31) жёлтый!
    tableSelectionForeground: Color; // Текст выделения - чёрный
    tableActiveCellBackground: Color; // Фон активной ячейки - RGB(255,255,255)
    tableActiveCellBorder: Color;   // Рамка активной ячейки - RGB(252,207,0) оранжево-жёлтый
    tableFocusBorder: Color;        // Рамка фокуса - RGB(83,106,194) синий
    tableInactiveCurrentCell: Color; // Неактивная текущая ячейка - RGB(253,241,165)
    tableEditingBackground: Color;  // Область редактирования - RGB(253,241,165)
    tableHierarchyArrow: Color;     // Стрелка иерархии - чёрный

    // === СКРОЛЛБАРЫ ===
    scrollbarBackground: Color;     // Фон скроллбара - RGB(240,240,240)
    scrollbarThumb: Color;          // Ползунок - RGB(204,204,204)
    scrollbarThumbHover: Color;     // Ползунок при наведении - RGB(153,153,153)
    scrollbarThumbPressed: Color;   // Ползунок при нажатии - RGB(77,77,77)

    // === КАЛЕНДАРЬ/ДАТЫ ===
    calendarBackground: Color;      // Фон календаря - RGB(249,249,249)
    calendarTodayColor: Color;      // Сегодня - RGB(70,151,206)
    calendarWeekendColor: Color;    // Выходные - RGB(255,74,0)
    calendarCurrentDay: Color;      // Текущий день - RGB(0,163,61) зелёный
    calendarSelectedBackground: Color; // Выбранная дата - RGB(96,96,96)
    calendarSelectedText: Color;    // Текст выбранной даты - RGB(218,218,218)

    // === СПИСОК (LWT) ===
    listSelectedBackground: Color;  // Выбранный элемент - RGB(159,168,218)
    listHoverBackground: Color;     // При наведении - RGB(197,202,233)
    listBorder: Color;              // Граница списка - RGB(171,173,179)

    // === СТАТУС-БАР ===
    statusBackground: Color;        // Фон статуса - RGB(255,251,206)
    statusTitleColor: Color;        // Заголовок статуса - RGB(152,141,114)
    statusValueColor: Color;        // Значение статуса - RGB(85,85,85)

    // === ПРОГРЕСС-БАР ===
    progressTextColor: Color;       // Текст прогресса - RGB(140,96,35)

    // === СОСТОЯНИЯ ===
    errorColor: Color;              // Ошибка - красный
    warningColor: Color;            // Предупреждение - оранжевый
    successColor: Color;            // Успех - зелёный
    infoColor: Color;               // Информация - синий

    // === ШРИФТЫ ===
    defaultFont: Font;              // Шрифт по умолчанию
    titleFont: Font;                // Заголовок
    smallFont: Font;                // Маленький
    largeFont: Font;                // Большой

    // === РАЗМЕРЫ (в пикселях) ===
    averageCharWidth: number;       // Средняя ширина символа (10 largeFont / 8 classic)
    averageCharHeight: number;      // Средняя высота символа (16 largeFont / 13 classic)
    controlHeight: number;          // Высота контрола (22 / 19)
    editRowHeight: number;          // Высота строки редактирования (20)
    buttonRowHeight: number;        // Высота строки кнопки (20 / 19)
    commandBarRowHeight: number;    // Высота панели команд (26)
    tableRowHeight: number;         // Высота строки таблицы (26 / 19)
    checkboxWidth: number;          // Ширина чекбокса (16 / 20)
    radioWidth: number;             // Ширина радио-кнопки (16 / 20)
    scrollbarWidth: number;         // Ширина скроллбара (17)
    splitterWidth: number;          // Ширина разделителя (5)
    borderRadius: number;           // Радиус скругления (0 в 1С)
    padding: number;                // Стандартный отступ

    // === ОТСТУПЫ ===
    formMargin: { top: number; right: number; bottom: number; left: number };
    groupMargin: number;            // Отступ группы (10)
    commandBarSpacing: number;      // Расстояние между кнопками (9 mode83 / 3 mode82)
    separatorWidth: number;         // Ширина разделителя (20 mode83 / 6 mode82)
}

// ============================================================================
// ТЕМА ТАКСИ (8.3) - СОВРЕМЕННЫЙ ИНТЕРФЕЙС
// ============================================================================

/**
 * Тема Такси (8.3) - современный интерфейс 1С:Предприятие
 * Все значения из EDT sources
 */
export class TaxiTheme implements I1CTheme {
    name = 'Такси (8.3)';
    variant = ClientInterfaceVariant.TAXI;

    // === БАЗОВЫЕ ЦВЕТА ===
    formBackground = new Color(255, 255, 255);
    formTextColor = new Color(51, 51, 51);          // autoTextColor
    borderColor = new Color(178, 178, 178);          // autoBorderColor
    disabledBorderColor = new Color(215, 215, 215);  // k83DisabledBorderColor

    // === ЦВЕТА ТЕКСТА ===
    autoTextColor = new Color(51, 51, 51);
    baseTextColor = new Color(77, 77, 77);           // kNewUIBaseTextColor
    disabledTextColor = new Color(128, 128, 128);
    placeholderColor = new Color(200, 200, 200);
    negativeTextColor = new Color(255, 0, 0);

    // === ГИПЕРССЫЛКИ ===
    hyperlinkColor = new Color(28, 85, 174);         // kHyperlinkColor
    hyperlinkHoverColor = new Color(20, 65, 140);
    hyperlinkDisabledColor = new Color(100, 120, 160);

    // === ПОЛЯ ВВОДА ===
    inputBackground = new Color(255, 255, 255);
    inputForeground = new Color(51, 51, 51);
    inputBorder = new Color(160, 160, 160);          // k83NormalBorderColor
    inputBorderFocused = new Color(70, 151, 206);    // kNewUITodayTextColor
    inputBorderReadonly = new Color(215, 215, 215);  // k83ReadOnlyBorderColor
    inputBorderDisabled = new Color(215, 215, 215);

    // === КНОПКИ (Обычные) ===
    buttonBackground = new Color(255, 255, 255);     // kButtonBackColor
    buttonForeground = new Color(77, 77, 77);        // kButtonTextColor
    buttonBorder = new Color(178, 178, 178);         // autoBorderColor
    buttonBackgroundHover = new Color(250, 219, 31); // k83MenuSelectBackColor (жёлтый hover!)
    buttonBackgroundPressed = new Color(220, 190, 20);
    buttonSeparator = new Color(196, 196, 196);      // kSeparatorColor

    // === КНОПКИ (По умолчанию - жёлтые) ===
    defaultButtonBackground = new Color(255, 225, 0); // kDefButtonBackColor
    defaultButtonForeground = new Color(0, 0, 0);
    defaultButtonBorder = new Color(170, 150, 40);

    // === ГРУППЫ ===
    groupBackground = new Color(249, 249, 249);       // kNewUIBaseBrushColor
    groupBorder = new Color(222, 222, 222);           // kNewUIBorderPenColor
    groupTitleColor = new Color(0, 150, 70);          // k83GroupTitleColor (зелёный!)
    groupLineWidth = 2;

    // === МЕНЮ ===
    menuTextColor = new Color(77, 77, 77);            // k83MenuTextColor
    menuShortcutColor = new Color(153, 153, 153);     // k83MenuShortCutTextColor
    menuSelectBackground = new Color(250, 219, 31);   // k83MenuSelectBackColor
    menuSeparator = new Color(217, 213, 194);         // k83MenuSeparatorLine
    menuCheckMarkBack = new Color(199, 220, 245);     // kCheckMarkBack
    menuCheckMarkFrame = new Color(158, 182, 233);    // kCheckMarkFrame

    // === ТАБЛИЦЫ ===
    tableBackground = new Color(250, 250, 250);       // kNewUICellColor
    tableAlternateRow = new Color(242, 242, 242);     // kNewUICellAltColor
    tableHeaderBackground = new Color(249, 249, 249);
    tableHeaderForeground = new Color(77, 77, 77);    // kNewUIHeaderTextColor
    tableHeaderSeparator = new Color(204, 204, 204);  // kHeaderSeparatorColor
    tableGridHorizontal = new Color(230, 230, 230);   // kHorizontalSeparatorColor
    tableGridVertical = new Color(255, 255, 255);     // kVerticalSeparatorColor
    tableSelectionBackground = new Color(250, 219, 31); // k83RowSelectBackColor (жёлтый!)
    tableSelectionForeground = new Color(0, 0, 0);    // k83RowSelectTextColor
    tableActiveCellBackground = new Color(255, 255, 255); // kActiveCellColor
    tableActiveCellBorder = new Color(252, 207, 0);   // kActiveCellBorderColor (оранжево-жёлтый)
    tableFocusBorder = new Color(83, 106, 194);       // kFocusBorderColor (синий)
    tableInactiveCurrentCell = new Color(253, 241, 165); // kInactiveCurrentCellColor
    tableEditingBackground = new Color(253, 241, 165);   // kActiveEditingHighlightColor
    tableHierarchyArrow = new Color(0, 0, 0);

    // === СКРОЛЛБАРЫ ===
    scrollbarBackground = new Color(240, 240, 240);   // DEFAULT_SCROLLBAR_BACKGROUND_COLOR
    scrollbarThumb = new Color(204, 204, 204);        // kScrollNormalColor
    scrollbarThumbHover = new Color(153, 153, 153);   // kScrollHotColor
    scrollbarThumbPressed = new Color(77, 77, 77);    // kScrollPressedColor

    // === КАЛЕНДАРЬ/ДАТЫ ===
    calendarBackground = new Color(249, 249, 249);    // kNewUIBaseBrushColor
    calendarTodayColor = new Color(70, 151, 206);     // kNewUITodayTextColor
    calendarWeekendColor = new Color(255, 74, 0);     // kNewUIRedDayTextColor
    calendarCurrentDay = new Color(0, 163, 61);       // Зелёный
    calendarSelectedBackground = new Color(96, 96, 96);
    calendarSelectedText = new Color(218, 218, 218);

    // === СПИСОК (LWT) ===
    listSelectedBackground = new Color(159, 168, 218); // DEFAULT_LIST_ITEM_SELECTED_COLOR
    listHoverBackground = new Color(197, 202, 233);    // DEFAULT_LIST_ITEM_HOT_COLOR
    listBorder = new Color(171, 173, 179);             // DEFAULT_LIST_BORDER_COLOR

    // === СТАТУС-БАР ===
    statusBackground = new Color(255, 251, 206);       // kStatusButtonBackColor
    statusTitleColor = new Color(152, 141, 114);       // kStatusTitleColor
    statusValueColor = new Color(85, 85, 85);          // kStatusValueColor

    // === ПРОГРЕСС-БАР ===
    progressTextColor = new Color(140, 96, 35);        // kProgressTextColor

    // === СОСТОЯНИЯ ===
    errorColor = new Color(255, 0, 0);
    warningColor = new Color(255, 160, 26);
    successColor = new Color(12, 220, 64);
    infoColor = new Color(0, 122, 255);

    // === ШРИФТЫ (Arial - стандарт Такси) ===
    defaultFont = new Font('Arial, Tahoma, sans-serif', 12);
    titleFont = new Font('Arial, Tahoma, sans-serif', 14, true);
    smallFont = new Font('Arial, Tahoma, sans-serif', 10);
    largeFont = new Font('Arial, Tahoma, sans-serif', 18);

    // === РАЗМЕРЫ (largeFont режим - современный Такси) ===
    averageCharWidth = 10;
    averageCharHeight = 16;
    controlHeight = 22;
    editRowHeight = 20;
    buttonRowHeight = 20;
    commandBarRowHeight = 26;
    tableRowHeight = 26;
    checkboxWidth = 16;
    radioWidth = 16;
    scrollbarWidth = 17;
    splitterWidth = 5;
    borderRadius = 0;               // 1С не использует скругления
    padding = 4;

    // === ОТСТУПЫ (mode83) ===
    formMargin = { top: 12, right: 12, bottom: 20, left: 12 };
    groupMargin = 10;
    commandBarSpacing = 9;          // CmdBarBetweenButtonsSpacing mode83
    separatorWidth = 20;            // CmdBarSeparatorWidth mode83
}

// ============================================================================
// КЛАССИЧЕСКАЯ ТЕМА (8.2) - СОВМЕСТИМОСТЬ
// ============================================================================

/**
 * Классическая тема (8.2) - для совместимости
 * Отличия от Такси в размерах и некоторых цветах
 */
export class ClassicTheme extends TaxiTheme {
    override name = 'Классический (8.2)';
    override variant = ClientInterfaceVariant.CLASSIC_MANAGED;

    // === РАЗМЕРЫ (classic режим - компактный) ===
    override averageCharWidth = 8;
    override averageCharHeight = 13;
    override controlHeight = 19;
    override buttonRowHeight = 19;
    override tableRowHeight = 19;
    override checkboxWidth = 20;    // Больше в классическом
    override radioWidth = 20;

    // === ОТСТУПЫ (mode82 - компактные) ===
    override commandBarSpacing = 3;  // Меньше расстояние
    override separatorWidth = 6;     // Уже разделитель
}

// ============================================================================
// ТЕМА ИНТЕРФЕЙСА 8.5
// ============================================================================

/**
 * Тема интерфейса 8.5 (современный)
 * Использует шрифт Roboto
 */
export class Version85Theme extends TaxiTheme {
    override name = 'Интерфейс 8.5';
    override variant = ClientInterfaceVariant.VERSION8_5;

    // === ШРИФТЫ (Roboto - стандарт 8.5) ===
    override defaultFont = new Font('Roboto, Arial, sans-serif', 11);
    override titleFont = new Font('Roboto, Arial, sans-serif', 14, true);
    override smallFont = new Font('Roboto, Arial, sans-serif', 9);
    override largeFont = new Font('Roboto, Arial, sans-serif', 18);
}

// ============================================================================
// ТЁМНАЯ ТЕМА (для VS Code интеграции)
// ============================================================================

/**
 * Тёмная тема (адаптация для тёмного режима VS Code)
 * Инвертированные цвета с сохранением 1С стилистики
 */
export class DarkTaxiTheme implements I1CTheme {
    name = 'Такси (тёмная)';
    variant = ClientInterfaceVariant.TAXI;

    // === БАЗОВЫЕ ЦВЕТА ===
    formBackground = new Color(30, 30, 30);
    formTextColor = new Color(204, 204, 204);
    borderColor = new Color(71, 71, 71);
    disabledBorderColor = new Color(60, 60, 60);

    // === ЦВЕТА ТЕКСТА ===
    autoTextColor = new Color(204, 204, 204);
    baseTextColor = new Color(180, 180, 180);
    disabledTextColor = new Color(107, 107, 107);
    placeholderColor = new Color(100, 100, 100);
    negativeTextColor = new Color(255, 100, 100);

    // === ГИПЕРССЫЛКИ ===
    hyperlinkColor = new Color(55, 148, 255);
    hyperlinkHoverColor = new Color(80, 170, 255);
    hyperlinkDisabledColor = new Color(80, 100, 130);

    // === ПОЛЯ ВВОДА ===
    inputBackground = new Color(60, 60, 60);
    inputForeground = new Color(204, 204, 204);
    inputBorder = new Color(71, 71, 71);
    inputBorderFocused = new Color(0, 122, 204);
    inputBorderReadonly = new Color(60, 60, 60);
    inputBorderDisabled = new Color(50, 50, 50);

    // === КНОПКИ (Обычные) ===
    buttonBackground = new Color(60, 60, 60);
    buttonForeground = new Color(204, 204, 204);
    buttonBorder = new Color(71, 71, 71);
    buttonBackgroundHover = new Color(80, 70, 10);   // Тёмный жёлтый
    buttonBackgroundPressed = new Color(100, 90, 15);
    buttonSeparator = new Color(60, 60, 60);

    // === КНОПКИ (По умолчанию - тёмный жёлтый) ===
    defaultButtonBackground = new Color(200, 175, 0);
    defaultButtonForeground = new Color(0, 0, 0);
    defaultButtonBorder = new Color(150, 130, 30);

    // === ГРУППЫ ===
    groupBackground = new Color(37, 37, 38);
    groupBorder = new Color(71, 71, 71);
    groupTitleColor = new Color(0, 180, 90);         // Зелёный в тёмной теме
    groupLineWidth = 2;

    // === МЕНЮ ===
    menuTextColor = new Color(204, 204, 204);
    menuShortcutColor = new Color(128, 128, 128);
    menuSelectBackground = new Color(80, 70, 10);
    menuSeparator = new Color(60, 60, 60);
    menuCheckMarkBack = new Color(50, 70, 100);
    menuCheckMarkFrame = new Color(70, 90, 120);

    // === ТАБЛИЦЫ ===
    tableBackground = new Color(30, 30, 30);
    tableAlternateRow = new Color(37, 37, 38);
    tableHeaderBackground = new Color(45, 45, 45);
    tableHeaderForeground = new Color(204, 204, 204);
    tableHeaderSeparator = new Color(60, 60, 60);
    tableGridHorizontal = new Color(60, 60, 60);
    tableGridVertical = new Color(45, 45, 45);
    tableSelectionBackground = new Color(9, 71, 113);
    tableSelectionForeground = new Color(255, 255, 255);
    tableActiveCellBackground = new Color(45, 45, 45);
    tableActiveCellBorder = new Color(0, 122, 204);
    tableFocusBorder = new Color(100, 130, 200);
    tableInactiveCurrentCell = new Color(50, 50, 40);
    tableEditingBackground = new Color(50, 50, 40);
    tableHierarchyArrow = new Color(200, 200, 200);

    // === СКРОЛЛБАРЫ ===
    scrollbarBackground = new Color(30, 30, 30);
    scrollbarThumb = new Color(90, 90, 90);
    scrollbarThumbHover = new Color(128, 128, 128);
    scrollbarThumbPressed = new Color(170, 170, 170);

    // === КАЛЕНДАРЬ/ДАТЫ ===
    calendarBackground = new Color(37, 37, 38);
    calendarTodayColor = new Color(70, 151, 206);
    calendarWeekendColor = new Color(255, 100, 80);
    calendarCurrentDay = new Color(0, 200, 80);
    calendarSelectedBackground = new Color(80, 80, 80);
    calendarSelectedText = new Color(220, 220, 220);

    // === СПИСОК (LWT) ===
    listSelectedBackground = new Color(9, 71, 113);
    listHoverBackground = new Color(42, 45, 46);
    listBorder = new Color(71, 71, 71);

    // === СТАТУС-БАР ===
    statusBackground = new Color(50, 45, 30);
    statusTitleColor = new Color(150, 140, 120);
    statusValueColor = new Color(180, 180, 180);

    // === ПРОГРЕСС-БАР ===
    progressTextColor = new Color(180, 150, 80);

    // === СОСТОЯНИЯ ===
    errorColor = new Color(255, 100, 100);
    warningColor = new Color(255, 180, 80);
    successColor = new Color(80, 220, 100);
    infoColor = new Color(80, 160, 255);

    // === ШРИФТЫ ===
    defaultFont = new Font('Arial, Tahoma, sans-serif', 12);
    titleFont = new Font('Arial, Tahoma, sans-serif', 14, true);
    smallFont = new Font('Arial, Tahoma, sans-serif', 10);
    largeFont = new Font('Arial, Tahoma, sans-serif', 18);

    // === РАЗМЕРЫ (такие же как Такси) ===
    averageCharWidth = 10;
    averageCharHeight = 16;
    controlHeight = 22;
    editRowHeight = 20;
    buttonRowHeight = 20;
    commandBarRowHeight = 26;
    tableRowHeight = 26;
    checkboxWidth = 16;
    radioWidth = 16;
    scrollbarWidth = 17;
    splitterWidth = 5;
    borderRadius = 0;
    padding = 4;

    // === ОТСТУПЫ ===
    formMargin = { top: 12, right: 12, bottom: 20, left: 12 };
    groupMargin = 10;
    commandBarSpacing = 9;
    separatorWidth = 20;
}

// ============================================================================
// МЕНЕДЖЕР ТЕМ
// ============================================================================

/**
 * Менеджер тем 1С
 * Управляет текущей темой и предоставляет доступ к ней
 */
export class Theme1CManager {
    private static _currentTheme: I1CTheme = new TaxiTheme();
    private static _themes: Map<string, I1CTheme> = new Map([
        ['taxi', new TaxiTheme()],
        ['classic', new ClassicTheme()],
        ['version85', new Version85Theme()],
        ['dark', new DarkTaxiTheme()]
    ]);

    /**
     * Получить текущую тему
     */
    static get current(): I1CTheme {
        return this._currentTheme;
    }

    /**
     * Установить текущую тему по имени
     */
    static setTheme(name: 'taxi' | 'classic' | 'version85' | 'dark'): void {
        const theme = this._themes.get(name);
        if (theme) {
            this._currentTheme = theme;
        }
    }

    /**
     * Установить тему по варианту интерфейса
     */
    static setThemeByVariant(variant: ClientInterfaceVariant): void {
        if (isVersion85Family(variant)) {
            this._currentTheme = this._themes.get('version85')!;
        } else if (isDrawingMode83(variant)) {
            this._currentTheme = this._themes.get('taxi')!;
        } else {
            this._currentTheme = this._themes.get('classic')!;
        }
    }

    /**
     * Установить тёмную тему (для VS Code dark mode)
     */
    static setDarkMode(isDark: boolean): void {
        if (isDark) {
            this._currentTheme = this._themes.get('dark')!;
        } else {
            this._currentTheme = this._themes.get('taxi')!;
        }
    }

    /**
     * Получить все доступные темы
     */
    static getAvailableThemes(): string[] {
        return Array.from(this._themes.keys());
    }

    /**
     * Регистрация кастомной темы
     */
    static registerTheme(name: string, theme: I1CTheme): void {
        this._themes.set(name, theme);
    }
}

// ============================================================================
// ЭКСПОРТ ДЛЯ УДОБСТВА
// ============================================================================

/** Быстрый доступ к текущей теме */
export function getCurrentTheme(): I1CTheme {
    return Theme1CManager.current;
}

/** Установить тему */
export function setTheme(name: 'taxi' | 'classic' | 'version85' | 'dark'): void {
    Theme1CManager.setTheme(name);
}
