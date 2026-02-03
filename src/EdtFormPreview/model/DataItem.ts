/**
 * DataItem - базовый интерфейс для элементов с данными (поля, кнопки, таблицы)
 * @see com._1c.g5.v8.dt.form.model.DataItem
 * 
 * Наследует:
 * - FormItem (id, name, displayImportance)
 * - Titled (title)
 * - TitleStyle (titleTextColor, titleFont)
 * - Visible (visible, enabled, userVisible)
 */
import { FormItem } from './FormItem';
import { Titled, LocalizedString } from './Titled';
import { TitleStyle, Color } from './TitleStyle';
import { Visible, UserVisible } from './Visible';
import { AbstractDataPath } from './DataPath';

export type FormElementTitleLocation = 
  | 'Auto'
  | 'None'
  | 'Left'
  | 'Top'
  | 'Right'
  | 'Bottom';

export interface DataItem extends FormItem, Titled, TitleStyle, Visible {
  /** Путь к данным */
  dataPath?: AbstractDataPath;
  
  /** Элемент по умолчанию */
  defaultItem?: boolean;
  
  /** Пропускать при вводе */
  skipOnInput?: boolean;
  
  /** Цвет фона заголовка */
  titleBackColor?: Color;
  
  /** Расположение заголовка */
  titleLocation?: FormElementTitleLocation;
  
  /** Высота заголовка */
  titleHeight?: number;
  
  /** Горячая клавиша */
  shortcut?: string;
}
