/**
 * TitleStyle - интерфейс для стилей заголовка
 * @see com._1c.g5.v8.dt.form.model.TitleStyle
 */
import { Color } from './Color';
import { Font } from './Font';

export { Color, Font };

export interface TitleStyle {
  titleTextColor?: Color;
  titleFont?: Font;
}
