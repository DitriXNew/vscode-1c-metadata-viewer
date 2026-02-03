/**
 * SpreadSheetDocFieldExtInfo - расширенная информация для поля табличного документа
 * Based on EDT com._1c.g5.v8.dt.form.model.SpreadSheetDocFieldExtInfo
 */

import { FieldExtInfo } from './FieldExtInfo';
import { ItemFont } from './FormVisualEntity';
import { Color } from './Color';
import { SelectionShowMode } from './SelectionShowMode';
import { UseOutput } from './UseOutput';

/**
 * Тип указателя табличного документа
 */
export type SpreadsheetDocumentPointerType = 
    | 'Default'
    | 'Special';

/**
 * Режим отображения кнопки действий ячейки
 */
export type CellActionsButtonViewMode = 
    | 'Auto'
    | 'Always'
    | 'Never';

/**
 * Режим отображения панели множественного выбора
 */
export type SpreadsheetDocumentMultipleSelectionPanelViewMode = 
    | 'Auto'
    | 'Show'
    | 'Hide';

/**
 * Использование полосы прокрутки табличного документа
 */
export type SpreadSheetDocumentScrollBarUse = 
    | 'Use'
    | 'DontUse'
    | 'Auto';

/**
 * Режим отображения выделения рисунка
 */
export type DrawingSelectionShowMode = 
    | 'Always'
    | 'WhenActive'
    | 'Never';

/**
 * Режим масштабирования отображения
 */
export type ViewScalingMode = 
    | 'Auto'
    | 'Normal'
    | 'MultiplePages'
    | 'PageWidth'
    | 'WholePage';

/**
 * Расширенная информация для поля табличного документа
 */
export interface SpreadSheetDocFieldExtInfo extends FieldExtInfo {
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
    
    /** Показывать сетку */
    showGrid?: boolean;
    
    /** Показывать заголовки */
    showHeaders?: boolean;
    
    /** Показывать имена ячеек */
    showCellNames?: boolean;
    
    /** Показывать имена строк и колонок */
    showRowAndColumnNames?: boolean;
    
    /** Тип указателя */
    pointerType?: SpreadsheetDocumentPointerType;
    
    /** Режим отображения кнопки действий ячейки */
    cellActionsButtonViewMode?: CellActionsButtonViewMode;
    
    /** Режим отображения панели множественного выбора */
    spreadsheetDocumentMultipleSelectionPanelViewMode?: SpreadsheetDocumentMultipleSelectionPanelViewMode;
    
    /** Вертикальная полоса прокрутки */
    verticalScrollBar?: SpreadSheetDocumentScrollBarUse;
    
    /** Горизонтальная полоса прокрутки */
    horizontalScrollBar?: SpreadSheetDocumentScrollBarUse;
    
    /** Черно-белый вид */
    blackAndWhiteView?: boolean;
    
    /** Защита */
    protection?: boolean;
    
    /** Режим отображения выделения */
    selectionShowMode?: SelectionShowMode;
    
    /** Режим отображения выделения рисунка */
    drawingSelectionShowMode?: DrawingSelectionShowMode;
    
    /** Вывод */
    output?: UseOutput;
    
    /** Редактирование */
    edit?: boolean;
    
    /** Показывать группы */
    showGroups?: boolean;
    
    /** Включить начало перетаскивания */
    enableStartDrag?: boolean;
    
    /** Включить перетаскивание */
    enableDrag?: boolean;
    
    /** Цвет рамки */
    borderColor?: Color;
    
    /** Режим масштабирования отображения */
    viewScalingMode?: ViewScalingMode;
}
