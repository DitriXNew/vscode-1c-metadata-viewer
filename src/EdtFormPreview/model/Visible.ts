/**
 * Visible - интерфейс для элементов с видимостью и доступностью
 * @see com._1c.g5.v8.dt.form.model.Visible
 */
export interface UserVisible {
  common?: boolean;
}

export interface Visible {
  visible?: boolean;
  enabled?: boolean;
  userVisible?: UserVisible;
}
