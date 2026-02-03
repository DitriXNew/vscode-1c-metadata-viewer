/**
 * FieldExtInfo - базовый интерфейс для расширенной информации полей
 * @see com._1c.g5.v8.dt.form.model.FieldExtInfo
 * 
 * Наследует:
 * - ExtInfo
 * - EventHandlerContainer (handlers)
 */
import { ExtInfo } from './ExtInfo';
import { EventHandler } from './EventHandler';

export interface FieldExtInfo extends ExtInfo {
  /** Обработчики событий */
  handlers?: EventHandler[];
}
