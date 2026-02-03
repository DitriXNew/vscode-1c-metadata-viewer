/**
 * DendrogramFieldExtInfo - расширенная информация для поля дендрограммы
 * Based on EDT com._1c.g5.v8.dt.form.model.DendrogramFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';

/**
 * Расширенная информация для поля дендрограммы
 */
export interface DendrogramFieldExtInfo extends FieldExtInfo {
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
}
