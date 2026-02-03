/**
 * LabelDecorationExtInfo - расширенная информация для декорации надписи
 * @see com._1c.g5.v8.dt.form.model.LabelDecorationExtInfo
 */
import { DecorationExtInfo } from './DecorationExtInfo';
import { Color } from './Color';
import { Border } from './Border';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './types';

export interface LabelDecorationExtInfo extends DecorationExtInfo {
  /** Гиперссылка */
  hyperlink?: boolean;
  
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание */
  verticalAlign?: ItemVerticalAlignment;
  
  /** Высота заголовка */
  titleHeight?: number;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Граница */
  border?: Border;
}
