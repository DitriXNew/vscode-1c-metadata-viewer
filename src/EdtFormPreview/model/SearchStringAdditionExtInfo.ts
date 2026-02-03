/**
 * SearchStringAdditionExtInfo - расширенная информация для дополнения строки поиска
 * Based on EDT com._1c.g5.v8.dt.form.model.SearchStringAdditionExtInfo
 */

import { AdditionExtInfo } from './AdditionExtInfo';
import { Color, Font } from './TitleStyle';

/**
 * Расширенная информация для дополнения строки поиска
 */
export interface SearchStringAdditionExtInfo extends AdditionExtInfo {
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
