/**
 * PDFDocumentFieldExtInfo - расширенная информация для поля PDF документа
 * Based on EDT com._1c.g5.v8.dt.form.model.PDFDocumentFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { UseOutput } from './UseOutput';
import { ViewStatusLocation } from './ViewStatusLocation';

/**
 * Расширенная информация для поля PDF документа
 */
export interface PDFDocumentFieldExtInfo extends FieldExtInfo {
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
    
    /** Масштаб */
    scale?: number;
    
    /** Номер текущей страницы */
    currentPageNumber?: number;
    
    /** Ориентация */
    orientation?: number;
    
    /** Расположение строки состояния просмотра */
    viewStatusLocation?: ViewStatusLocation;
}
