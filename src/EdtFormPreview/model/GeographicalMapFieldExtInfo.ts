/**
 * GeographicalMapFieldExtInfo - расширенная информация для поля географической карты
 * Based on EDT com._1c.g5.v8.dt.form.model.GeographicalMapFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { UseOutput } from './types';

/**
 * Расширенная информация для поля географической карты
 */
export interface GeographicalMapFieldExtInfo extends FieldExtInfo {
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
    
    /** Цвет рамки */
    borderColor?: Color;
}
