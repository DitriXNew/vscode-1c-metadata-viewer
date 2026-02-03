/**
 * FlowchartFieldExtInfo - расширенная информация для поля блок-схемы
 * Based on EDT com._1c.g5.v8.dt.form.model.FlowchartFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { UseOutput } from './UseOutput';

/**
 * Расширенная информация для поля блок-схемы
 */
export interface FlowchartFieldExtInfo extends FieldExtInfo {
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
    
    /** Вывод */
    output?: UseOutput;
    
    /** Редактирование */
    edit?: boolean;
    
    /** Цвет рамки */
    borderColor?: Color;
}
