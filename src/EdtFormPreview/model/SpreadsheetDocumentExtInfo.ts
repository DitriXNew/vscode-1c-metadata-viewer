// Соответствует com._1c.g5.v8.dt.form.model.SpreadsheetDocumentExtInfo
import { FormAttributeExtInfo } from './FormAttributeExtInfo';

/**
 * SpreadsheetData - данные табличного документа
 * EDT хранит это как EObject со ссылкой на внешний .mxlx файл
 * Для предпросмотра мы храним структуру Settings элемента
 */
export interface SpreadsheetData {
    /** Присутствует ли данные */
    hasContent: boolean;
    /** Структура настроек (если парсится) */
    settings?: SpreadsheetSettings;
}

/**
 * Настройки табличного документа
 */
export interface SpreadsheetSettings {
    /** Количество колонок */
    columnCount?: number;
    /** Количество строк */
    rowCount?: number;
    /** Описания колонок */
    columns?: SpreadsheetColumn[];
    /** Описания строк */
    rows?: SpreadsheetRow[];
}

export interface SpreadsheetColumn {
    width?: number;
}

export interface SpreadsheetRow {
    height?: number;
}

export interface SpreadsheetDocumentExtInfo extends FormAttributeExtInfo {
    spreadsheetData?: SpreadsheetData;
}
