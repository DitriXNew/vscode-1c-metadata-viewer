/**
 * DynamicListExtInfo - расширенная информация динамического списка
 * Based on EDT com._1c.g5.v8.dt.form.model.DynamicListExtInfo
 */

import { FormAttributeExtInfo } from './FormAttributeExtInfo';
import { DynamicListKeyType } from './types';

export interface DynamicListExtInfo extends FormAttributeExtInfo {
    /** Текст запроса */
    queryText?: string;
    
    /** Основная таблица */
    mainTable?: string;
    
    /** Динамическое чтение данных */
    dynamicDataRead?: boolean;
    
    /** Авто заполнение доступных полей */
    autoFillAvailableFields?: boolean;
    
    /** Произвольный запрос */
    customQuery?: boolean;
    
    /** Авто сохранение пользовательских настроек */
    autoSaveUserSettings?: boolean;
    
    /** Получение представлений невидимых полей */
    getInvisibleFieldPresentations?: boolean;
    
    /** Тип ключа */
    keyType?: DynamicListKeyType;
    
    /** Поля ключа */
    keyField?: string;

    /** Поля (8.3.18+) */
    fields?: DynamicListField[];

    /** Вычисляемые поля (8.3.18+) */
    calculatedFields?: DynamicListCalculatedField[];

    /** Параметры (8.3.18+) */
    parameters?: DynamicListParameter[];
}

/**
 * Поле динамического списка
 */
export interface DynamicListField {
    name?: string;
    alias?: string;
    expression?: string;
}

/**
 * Вычисляемое поле динамического списка
 */
export interface DynamicListCalculatedField {
    name?: string;
    expression?: string;
}

/**
 * Параметр динамического списка
 */
export interface DynamicListParameter {
    name?: string;
    value?: string;
}
