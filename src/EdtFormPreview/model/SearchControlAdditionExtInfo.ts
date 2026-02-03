/**
 * SearchControlAdditionExtInfo - расширенная информация для дополнения элемента управления поиском
 * Based on EDT com._1c.g5.v8.dt.form.model.SearchControlAdditionExtInfo
 */

import { AdditionExtInfo } from './AdditionExtInfo';
import { Color, Font } from './TitleStyle';

/**
 * Расширенная информация для дополнения элемента управления поиском
 */
export interface SearchControlAdditionExtInfo extends AdditionExtInfo {
    /** Ширина */
    width?: number;
    
    /** Автоматическая максимальная ширина */
    autoMaxWidth?: boolean;
    
    /** Максимальная ширина */
    maxWidth?: number;
    
    /** Минимальная ширина */
    minWidth?: number;
    
    /** Горизонтальное растягивание */
    horizontalStretch?: boolean;
    
    /** Цвет фона */
    backColor?: Color;
    
    /** Цвет текста */
    textColor?: Color;
    
    /** Цвет рамки */
    borderColor?: Color;
    
    /** Шрифт */
    font?: Font;
}
