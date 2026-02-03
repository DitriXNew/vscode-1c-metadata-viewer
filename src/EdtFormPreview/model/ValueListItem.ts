/**
 * ValueListItem - элемент списка значений
 * Based on EDT com._1c.g5.v8.dt.form.model.ValueListItem
 */

/**
 * Элемент списка значений
 */
export interface ValueListItem {
    /** Представление (локализованное) */
    presentation?: { [key: string]: string };
    
    /** Состояние отметки */
    checkState?: number;
    
    /** Значение */
    value?: any;
}
