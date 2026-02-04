/**
 * Экспорт модуля темы
 */
export { Color } from './Color';
export { Font } from './Font';
export { ITheme, LightTheme, DarkTheme, getTheme, setTheme } from './Theme';

// Полная система тем 1С
export {
    ClientInterfaceVariant,
    isDrawingMode83,
    isVersion85Family,
    G5Palette,
    I1CTheme,
    TaxiTheme,
    ClassicTheme,
    Version85Theme,
    DarkTaxiTheme,
    Theme1CManager,
    getCurrentTheme,
    setTheme as setTheme1C
} from './Theme1C';

// Расширенные стили контролов
export {
    // Skin интерфейсы
    ISkinElementWithCustomization,
    ISkinElementWithShadow,
    ISkinForm,
    ISkinPanel,
    ISkinPages,
    ISkinCalendar,
    
    // Стили контролов
    Button83Styles,
    MenuCheckMarkStyles,
    InputFieldStyles,
    Table83Styles,
    Table81Styles,
    TableSizes,
    CalendarStyles,
    ScrollbarStyles,
    ProgressBarStyles,
    TabControlStyles,
    TumblerStyles,
    ViewStatusStyles,
    SpreadsheetStyles,
    MenuSeparatorStyles,
    DragDropStyles,
    TabSizes,
    IconSizes,
    ShadowStyles,
    
    // HippoTheme размеры
    HippoThemeLargeFont,
    HippoThemeClassic,
    
    // Функции работы с цветом
    blendColors,
    lightenColor,
    darkenColor,
    getDisabledColor,
    
    // Все стили вместе
    All1CStyles
} from './ControlStyles';
