/**
 * TextDocFieldExtInfo - расширенная информация для поля текстового документа
 * Based on EDT com._1c.g5.v8.dt.form.model.TextDocFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { ItemFont } from './FormVisualEntity';
import { Color } from './Color';
import { UseOutput } from './UseOutput';

/**
 * Расширенная информация для поля текстового документа
 */
export interface TextDocFieldExtInfo extends FieldExtInfo {
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
    
    /** Цвет текста */
    textColor?: Color;
    
    /** Цвет фона */
    backColor?: Color;
    
    /** Цвет рамки */
    borderColor?: Color;
    
    /** Шрифт */
    font?: ItemFont;
}
