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
}
