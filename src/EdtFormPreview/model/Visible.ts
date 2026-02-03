/**
 * Visible - интерфейс для элементов с видимостью и доступностью
 * @see com._1c.g5.v8.dt.form.model.Visible
 */
import { UserVisible } from './UserVisible';

export { UserVisible };

export interface Visible {
  visible?: boolean;
  enabled?: boolean;
  userVisible?: UserVisible;
}
