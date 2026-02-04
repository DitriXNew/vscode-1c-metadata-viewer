/**
 * Тема оформления для контролов 1С форм
 * Порт из com._1c.g5.v8.dt.form.presentation.theme.IPresentationTheme
 */
import { Color } from './Color';
import { Font } from './Font';

/**
 * Интерфейс темы оформления
 */
export interface ITheme {
    // Основные цвета
    background: Color;
    foreground: Color;
    border: Color;

    // Цвета для контролов
    inputBackground: Color;
    inputForeground: Color;
    inputBorder: Color;
    inputBorderFocused: Color;

    // Кнопки
    buttonBackground: Color;
    buttonForeground: Color;
    buttonBorder: Color;
    buttonBackgroundHover: Color;
    buttonBackgroundPressed: Color;

    // Группы
    groupBackground: Color;
    groupBorder: Color;
    groupTitleForeground: Color;

    // Таблицы
    tableHeaderBackground: Color;
    tableHeaderForeground: Color;
    tableRowBackground: Color;
    tableRowAlternateBackground: Color;
    tableGridColor: Color;
    tableSelectionBackground: Color;
    tableSelectionForeground: Color;

    // Состояния
    disabledForeground: Color;
    disabledBackground: Color;
    errorColor: Color;
    warningColor: Color;

    // Дополнительные цвета
    inputBorderActive: Color;
    placeholderForeground: Color;
    selectionBackground: Color;

    // Контролы общие
    controlBackground: Color;
    controlHoverBackground: Color;
    controlPressedBackground: Color;
    focusBorder: Color;

    // Scrollbar
    scrollbarTrack: Color;
    scrollbarThumb: Color;
    scrollbarThumbHover: Color;
    scrollbarThumbActive: Color;

    // Разделители
    separator: Color;
    separatorShadow: Color;
    separatorDark: Color;
    separatorLight: Color;

    // Шрифты
    defaultFont: Font;
    titleFont: Font;
    smallFont: Font;

    // Размеры
    borderRadius: number;
    controlHeight: number;
    padding: number;
}

/**
 * Светлая тема (1С стиль)
 */
export class LightTheme implements ITheme {
    // Основные цвета
    background = Color.fromHex('#FFFFFF');
    foreground = Color.fromHex('#000000');
    border = Color.fromHex('#C0C0C0');

    // Цвета для контролов
    inputBackground = Color.fromHex('#FFFFFF');
    inputForeground = Color.fromHex('#000000');
    inputBorder = Color.fromHex('#ABADB3');
    inputBorderFocused = Color.fromHex('#569DE5');

    // Кнопки
    buttonBackground = Color.fromHex('#E1E1E1');
    buttonForeground = Color.fromHex('#000000');
    buttonBorder = Color.fromHex('#ADADAD');
    buttonBackgroundHover = Color.fromHex('#C9DEF5');
    buttonBackgroundPressed = Color.fromHex('#A4C8E8');

    // Группы
    groupBackground = Color.fromHex('#F0F0F0');
    groupBorder = Color.fromHex('#DFDFDF');
    groupTitleForeground = Color.fromHex('#333333');

    // Таблицы
    tableHeaderBackground = Color.fromHex('#F7F7F7');
    tableHeaderForeground = Color.fromHex('#000000');
    tableRowBackground = Color.fromHex('#FFFFFF');
    tableRowAlternateBackground = Color.fromHex('#F5F5F5');
    tableGridColor = Color.fromHex('#E0E0E0');
    tableSelectionBackground = Color.fromHex('#CCE8FF');
    tableSelectionForeground = Color.fromHex('#000000');

    // Состояния
    disabledForeground = Color.fromHex('#A0A0A0');
    disabledBackground = Color.fromHex('#F0F0F0');
    errorColor = Color.fromHex('#FF0000');
    warningColor = Color.fromHex('#FFA500');

    // Дополнительные цвета
    inputBorderActive = Color.fromHex('#569DE5');
    placeholderForeground = Color.fromHex('#A0A0A0');
    selectionBackground = new Color(255, 225, 0); // 1С жёлтый

    // Контролы общие
    controlBackground = Color.fromHex('#E1E1E1');
    controlHoverBackground = Color.fromHex('#C9DEF5');
    controlPressedBackground = Color.fromHex('#A4C8E8');
    focusBorder = Color.fromHex('#569DE5');

    // Scrollbar
    scrollbarTrack = Color.fromHex('#F0F0F0');
    scrollbarThumb = Color.fromHex('#C1C1C1');
    scrollbarThumbHover = Color.fromHex('#A8A8A8');
    scrollbarThumbActive = Color.fromHex('#787878');

    // Разделители
    separator = Color.fromHex('#C0C0C0');
    separatorShadow = Color.fromHex('#FFFFFF');
    separatorDark = Color.fromHex('#A0A0A0');
    separatorLight = Color.fromHex('#FFFFFF');

    // Шрифты
    defaultFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 12);
    titleFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 14, true);
    smallFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 10);

    // Размеры
    borderRadius = 2;
    controlHeight = 22;
    padding = 4;
}

/**
 * Тёмная тема
 */
export class DarkTheme implements ITheme {
    // Основные цвета
    background = Color.fromHex('#1E1E1E');
    foreground = Color.fromHex('#CCCCCC');
    border = Color.fromHex('#474747');

    // Цвета для контролов
    inputBackground = Color.fromHex('#3C3C3C');
    inputForeground = Color.fromHex('#CCCCCC');
    inputBorder = Color.fromHex('#474747');
    inputBorderFocused = Color.fromHex('#007ACC');

    // Кнопки
    buttonBackground = Color.fromHex('#3C3C3C');
    buttonForeground = Color.fromHex('#CCCCCC');
    buttonBorder = Color.fromHex('#474747');
    buttonBackgroundHover = Color.fromHex('#505050');
    buttonBackgroundPressed = Color.fromHex('#007ACC');

    // Группы
    groupBackground = Color.fromHex('#252526');
    groupBorder = Color.fromHex('#474747');
    groupTitleForeground = Color.fromHex('#CCCCCC');

    // Таблицы
    tableHeaderBackground = Color.fromHex('#2D2D2D');
    tableHeaderForeground = Color.fromHex('#CCCCCC');
    tableRowBackground = Color.fromHex('#1E1E1E');
    tableRowAlternateBackground = Color.fromHex('#252526');
    tableGridColor = Color.fromHex('#3C3C3C');
    tableSelectionBackground = Color.fromHex('#094771');
    tableSelectionForeground = Color.fromHex('#FFFFFF');

    // Состояния
    disabledForeground = Color.fromHex('#6B6B6B');
    disabledBackground = Color.fromHex('#2D2D2D');
    errorColor = Color.fromHex('#F14C4C');
    warningColor = Color.fromHex('#CCA700');

    // Дополнительные цвета
    inputBorderActive = Color.fromHex('#007ACC');
    placeholderForeground = Color.fromHex('#6B6B6B');
    selectionBackground = new Color(255, 225, 0); // 1С жёлтый

    // Контролы общие
    controlBackground = Color.fromHex('#3C3C3C');
    controlHoverBackground = Color.fromHex('#505050');
    controlPressedBackground = Color.fromHex('#007ACC');
    focusBorder = Color.fromHex('#007ACC');

    // Scrollbar
    scrollbarTrack = Color.fromHex('#2D2D2D');
    scrollbarThumb = Color.fromHex('#5A5A5A');
    scrollbarThumbHover = Color.fromHex('#6E6E6E');
    scrollbarThumbActive = Color.fromHex('#8A8A8A');

    // Разделители
    separator = Color.fromHex('#474747');
    separatorShadow = Color.fromHex('#3C3C3C');
    separatorDark = Color.fromHex('#2D2D2D');
    separatorLight = Color.fromHex('#5A5A5A');

    // Шрифты
    defaultFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 12);
    titleFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 14, true);
    smallFont = new Font('Segoe UI, Tahoma, Arial, sans-serif', 10);

    // Размеры
    borderRadius = 2;
    controlHeight = 22;
    padding = 4;
}

/**
 * Текущая тема
 */
let currentTheme: ITheme = new LightTheme();

/**
 * Получает текущую тему
 */
export function getTheme(): ITheme {
    return currentTheme;
}

/**
 * Устанавливает текущую тему
 */
export function setTheme(theme: ITheme): void {
    currentTheme = theme;
}

// Импортируем тему 1С для адаптера
import { TaxiTheme, DarkTaxiTheme, I1CTheme } from './Theme1C';

/**
 * Адаптер для преобразования I1CTheme в ITheme
 * Позволяет использовать TaxiTheme с существующими контролами
 */
export class Theme1CAdapter implements ITheme {
    constructor(private _source: I1CTheme) {}

    // Основные цвета
    get background(): Color { return this._source.formBackground; }
    get foreground(): Color { return this._source.formTextColor; }
    get border(): Color { return this._source.borderColor; }

    // Цвета для контролов
    get inputBackground(): Color { return this._source.inputBackground; }
    get inputForeground(): Color { return this._source.inputForeground; }
    get inputBorder(): Color { return this._source.inputBorder; }
    get inputBorderFocused(): Color { return this._source.inputBorderFocused; }

    // Кнопки
    get buttonBackground(): Color { return this._source.buttonBackground; }
    get buttonForeground(): Color { return this._source.buttonForeground; }
    get buttonBorder(): Color { return this._source.buttonBorder; }
    get buttonBackgroundHover(): Color { return this._source.buttonBackgroundHover; }
    get buttonBackgroundPressed(): Color { return this._source.buttonBackgroundPressed; }

    // Группы
    get groupBackground(): Color { return this._source.groupBackground; }
    get groupBorder(): Color { return this._source.groupBorder; }
    get groupTitleForeground(): Color { return this._source.groupTitleColor; }

    // Таблицы
    get tableHeaderBackground(): Color { return this._source.tableHeaderBackground; }
    get tableHeaderForeground(): Color { return this._source.tableHeaderForeground; }
    get tableRowBackground(): Color { return this._source.tableBackground; }
    get tableRowAlternateBackground(): Color { return this._source.tableAlternateRow; }
    get tableGridColor(): Color { return this._source.tableGridHorizontal; }
    get tableSelectionBackground(): Color { return this._source.tableSelectionBackground; }
    get tableSelectionForeground(): Color { return this._source.tableSelectionForeground; }

    // Состояния
    get disabledForeground(): Color { return this._source.disabledTextColor; }
    get disabledBackground(): Color { return this._source.groupBackground; }
    get errorColor(): Color { return this._source.errorColor; }
    get warningColor(): Color { return this._source.warningColor; }

    // Дополнительные цвета
    get inputBorderActive(): Color { return this._source.inputBorderFocused; }
    get placeholderForeground(): Color { return this._source.placeholderColor; }
    get selectionBackground(): Color { return this._source.tableSelectionBackground; }

    // Контролы общие
    get controlBackground(): Color { return this._source.buttonBackground; }
    get controlHoverBackground(): Color { return this._source.buttonBackgroundHover; }
    get controlPressedBackground(): Color { return this._source.buttonBackgroundPressed; }
    get focusBorder(): Color { return this._source.tableFocusBorder; }

    // Scrollbar
    get scrollbarTrack(): Color { return this._source.scrollbarBackground; }
    get scrollbarThumb(): Color { return this._source.scrollbarThumb; }
    get scrollbarThumbHover(): Color { return this._source.scrollbarThumbHover; }
    get scrollbarThumbActive(): Color { return this._source.scrollbarThumbPressed; }

    // Разделители
    get separator(): Color { return this._source.buttonSeparator; }
    get separatorShadow(): Color { return this._source.formBackground; }
    get separatorDark(): Color { return this._source.borderColor; }
    get separatorLight(): Color { return this._source.formBackground; }

    // Шрифты
    get defaultFont(): Font { return this._source.defaultFont; }
    get titleFont(): Font { return this._source.titleFont; }
    get smallFont(): Font { return this._source.smallFont; }

    // Размеры
    get borderRadius(): number { return this._source.borderRadius; }
    get controlHeight(): number { return this._source.controlHeight; }
    get padding(): number { return this._source.padding; }

    // Доступ к исходной 1С теме
    get source1C(): I1CTheme { return this._source; }
}

/**
 * Создаёт адаптированную тему 1С
 */
export function createTaxiTheme(): ITheme {
    return new Theme1CAdapter(new TaxiTheme());
}

/**
 * Создаёт тёмную адаптированную тему 1С
 */
export function createDarkTaxiTheme(): ITheme {
    return new Theme1CAdapter(new DarkTaxiTheme());
}
