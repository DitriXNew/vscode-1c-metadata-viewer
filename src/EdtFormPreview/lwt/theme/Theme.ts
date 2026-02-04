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
