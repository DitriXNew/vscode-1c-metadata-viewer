/**
 * TitleStyle - интерфейс для стилей заголовка
 * @see com._1c.g5.v8.dt.form.model.TitleStyle
 */
export interface Color {
  red?: number;
  green?: number;
  blue?: number;
}

export interface Font {
  name?: string;
  height?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikeout?: boolean;
}

export interface TitleStyle {
  titleTextColor?: Color;
  titleFont?: Font;
}
