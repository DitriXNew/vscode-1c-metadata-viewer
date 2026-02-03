/**
 * DynamicListTableExtInfo - расширенная информация для таблицы динамического списка
 * Based on EDT com._1c.g5.v8.dt.form.model.DynamicListTableExtInfo
 */

import { TableExtInfo } from './TableExtInfo';
import { UpdateOnDataChange } from './UpdateOnDataChange';
import { FoldersAndItemsUse } from './FoldersAndItemsUse';

/**
 * Стандартный период
 */
export interface StandardPeriod {
    /** Дата начала */
    startDate?: string;
    /** Дата окончания */
    endDate?: string;
    /** Вариант периода */
    variant?: string;
}

/**
 * Расширенная информация для таблицы динамического списка
 */
export interface DynamicListTableExtInfo extends TableExtInfo {
    /** Автообновление */
    autoRefresh?: boolean;
    
    /** Период автообновления (секунды) */
    autoRefreshPeriod?: number;
    
    /** Период */
    period?: StandardPeriod;
    
    /** Выбор папок и элементов */
    choiceFoldersAndItems?: FoldersAndItemsUse;
    
    /** Восстанавливать текущую строку */
    restoreCurrentRow?: boolean;
    
    /** Родитель верхнего уровня */
    topLevelParent?: any;
    
    /** Показывать корень */
    showRoot?: boolean;
    
    /** Разрешить выбор корня */
    allowRootChoice?: boolean;
    
    /** Разрешить получение URL текущей строки */
    allowGettingCurrentRowURL?: boolean;
    
    /** Обновление при изменении данных */
    updateOnDataChange?: UpdateOnDataChange;
    
    /** Группа пользовательских настроек */
    userSettingsGroup?: string;
}
