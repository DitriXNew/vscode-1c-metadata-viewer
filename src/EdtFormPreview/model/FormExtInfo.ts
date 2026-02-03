/**
 * FormExtInfo - базовый интерфейс для расширенной информации формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormExtInfo
 */

import { ExtInfo } from './ExtInfo';
import { EventHandler } from './EventHandler';

export interface FormExtInfo extends ExtInfo {
    /** Обработчики событий */
    handlers?: EventHandler[];
}
