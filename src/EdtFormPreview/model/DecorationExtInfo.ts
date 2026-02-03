/**
 * DecorationExtInfo - базовый интерфейс для расширенной информации декораций
 * @see com._1c.g5.v8.dt.form.model.DecorationExtInfo
 */
import { ExtInfo } from './ExtInfo';
import { EventHandler } from './EventHandler';

export interface DecorationExtInfo extends ExtInfo {
  /** Обработчики событий */
  handlers?: EventHandler[];
}
