/**
 * FormParameter - параметр формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormParameter
 */

import { TypeDescription } from './FormAttribute';

/**
 * Параметр формы
 */
export interface FormParameter {
    /** Имя */
    name?: string;
    
    /** Тип значения */
    valueType?: TypeDescription;
    
    /** Ключевой параметр */
    keyParameter?: boolean;
    
    /** Комментарий */
    comment?: string;
}
