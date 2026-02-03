/**
 * PlannerFieldExtInfo - расширенная информация для поля планировщика
 * Based on EDT com._1c.g5.v8.dt.form.model.PlannerFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';

/**
 * Расширенная информация для поля планировщика
 */
export interface PlannerFieldExtInfo extends FieldExtInfo {
    /** Ширина */
    width?: number;
    
    /** Автоматическая максимальная ширина */
    autoMaxWidth?: boolean;
    
    /** Максимальная ширина */
    maxWidth?: number;
    
    /** Минимальная ширина */
    minWidth?: number;
    
    /** Высота */
    height?: number;
    
    /** Автоматическая максимальная высота */
    autoMaxHeight?: boolean;
    
    /** Максимальная высота */
    maxHeight?: number;
    
    /** Горизонтальное растягивание */
    horizontalStretch?: boolean;
    
    /** Вертикальное растягивание */
    verticalStretch?: boolean;
    
    /** Включить начало перетаскивания */
    enableStartDrag?: boolean;
    
    /** Включить перетаскивание */
    enableDrag?: boolean;
    
    /** Гиперссылка элемента временной шкалы */
    timeScaleItemHyperlink?: boolean;
    
    /** Гиперссылка элемента измерения */
    dimensionItemHyperlink?: boolean;
    
    /** Гиперссылка перенесенного заголовка временной шкалы */
    wrappedTimeScaleHeaderHyperlink?: boolean;
}
