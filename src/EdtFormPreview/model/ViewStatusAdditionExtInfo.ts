/**
 * ViewStatusAdditionExtInfo - расширенная информация для дополнения статуса просмотра
 * Based on EDT com._1c.g5.v8.dt.form.model.ViewStatusAdditionExtInfo
 */

import { AdditionExtInfo } from './AdditionExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { Border } from './Border';
import { ItemHorizontalAlignment } from './ItemAlignment';

/**
 * Расширенная информация для дополнения статуса просмотра
 */
export interface ViewStatusAdditionExtInfo extends AdditionExtInfo {
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
    
    /** Горизонтальное положение */
    horizontalLocation?: ItemHorizontalAlignment;
    
    /** Цвет фона */
    backColor?: Color;
    
    /** Цвет кнопки */
    buttonColor?: Color;
    
    /** Цвет текста */
    textColor?: Color;
    
    /** Цвет текста заголовка */
    titleTextColor?: Color;
    
    /** Цвет рамки */
    borderColor?: Color;
    
    /** Шрифт */
    font?: Font;
    
    /** Шрифт заголовка */
    titleFont?: Font;
    
    /** Рамка */
    border?: Border;
}
