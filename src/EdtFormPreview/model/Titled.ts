/**
 * Titled - интерфейс для элементов с заголовком
 * @see com._1c.g5.v8.dt.form.model.Titled
 */
import { LocalizedString } from './LocalizedString';

export interface Titled {
  title?: LocalizedString | string;
}
