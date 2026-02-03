/**
 * DocumentFormExtInfo - расширенная информация формы документа
 * Based on EDT com._1c.g5.v8.dt.form.model.DocumentFormExtInfo
 */

import { FormExtInfo } from './FormExtInfo';
import { AutoTime } from './AutoTime';

export type PostingModeUse = 
    | 'Auto'
    | 'Allow'
    | 'Deny';

export interface DocumentFormExtInfo extends FormExtInfo {
    /** Авто время */
    autoTime?: AutoTime;
    
    /** Использование режима проведения */
    usePostingMode?: PostingModeUse;
    
    /** Перепроведение при записи */
    repostOnWrite?: boolean;
}
