/**
 * GanttChartFieldExtInfo - расширенная информация для поля диаграммы Ганта
 * Based on EDT com._1c.g5.v8.dt.form.model.GanttChartFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { Table } from './Table';
import { GanttChartIntervalsSelectionMode, GanttChartTableLocation, GanttChartValuesSelectionMode } from './types';

/**
 * Расширенная информация для поля диаграммы Ганта
 */
export interface GanttChartFieldExtInfo extends FieldExtInfo {
    /** Встроенная таблица (8.3.20+) */
    autoTable?: Table;

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
    
    /** Расположение таблицы */
    tableLocation?: GanttChartTableLocation;
    
    /** Режим выбора значений */
    valuesSelectionMode?: GanttChartValuesSelectionMode;
    
    /** Режим выбора интервалов */
    intervalsSelectionMode?: GanttChartIntervalsSelectionMode;
    
    /** Показывать горизонтальные линии */
    showHorizontalLinesFlag?: boolean;
    
    /** Показывать вертикальные линии */
    showVerticalLinesFlag?: boolean;
}
