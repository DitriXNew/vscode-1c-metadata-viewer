/**
 * Titled - интерфейс для элементов с заголовком
 * @see com._1c.g5.v8.dt.form.model.Titled
 */
export interface LocalizedString {
  key: string;
  value: string;
}

export interface Titled {
  title?: LocalizedString | LocalizedString[] | string;
}
