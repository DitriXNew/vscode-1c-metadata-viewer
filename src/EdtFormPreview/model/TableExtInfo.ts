/**
 * TableExtInfo - расширенная информация для таблицы
 * Based on EDT com._1c.g5.v8.dt.form.model.TableExtInfo
 */

import { ExtInfo } from './ExtInfo';
import { EventHandler } from './EventHandler';

/**
 * Базовый интерфейс для ExtInfo таблицы
 */
export interface TableExtInfo extends ExtInfo {
    /** Обработчики событий */
    handlers?: EventHandler[];
}
