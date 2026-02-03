/**
 * Addition - элемент дополнения формы (строка поиска, статус и др.)
 * Based on EDT com._1c.g5.v8.dt.form.model.Addition
 */

import { FormItem } from './FormItem';
import { AdditionExtInfo } from './AdditionExtInfo';
import { ItemVerticalAlignment, ManagedFormAdditionType, MenuElementPlacementArea } from './types';

/**
 * Элемент дополнения формы
 */
export interface Addition extends FormItem {
    /** Тип дополнения */
    type?: ManagedFormAdditionType;
    
    /** Источник */
    source?: string;
    
    /** Горизонтальное выравнивание группы */
    groupHorizontalAlign?: string;
    
    /** Вертикальное выравнивание группы */
    groupVerticalAlign?: ItemVerticalAlignment;
    
    /** Область размещения */
    placementArea?: MenuElementPlacementArea;
    
    /** Расширенная информация */
    extInfo?: AdditionExtInfo;
    
    /** Заголовок */
    title?: string;
    
    /** Подсказка */
    toolTip?: string;
    
    /** Видимость */
    visible?: boolean;
}
