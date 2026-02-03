/**
 * PropertyInfo - информация о свойстве
 * Based on EDT com._1c.g5.v8.dt.form.model.PropertyInfo
 */

/**
 * Информация о свойстве
 */
export interface PropertyInfo {
    /** Имя свойства */
    name?: string;
    /** Значение */
    value?: any;
}

/**
 * Информация о источнике данных элемента
 */
export interface ElementDataSourceInfo {
    /** Путь к данным */
    dataPath?: string;
    /** ID элемента */
    elementId?: number;
    /** Источник */
    source?: string;
}
