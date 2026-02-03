/**
 * AdditionExtInfo - расширенная информация для дополнения (Addition)
 * Based on EDT com._1c.g5.v8.dt.form.model.AdditionExtInfo
 */

import { ExtInfo } from './ExtInfo';
import { EventHandler } from './EventHandler';

/**
 * Базовый интерфейс для ExtInfo дополнения
 */
export interface AdditionExtInfo extends ExtInfo {
    /** Обработчики событий */
    handlers?: EventHandler[];
}
