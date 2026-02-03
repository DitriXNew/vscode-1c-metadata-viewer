/**
 * Group - базовый интерфейс для групп элементов формы
 * @see com._1c.g5.v8.dt.form.model.Group
 * 
 * Наследует:
 * - FormItem
 * - FormItemContainer (items)
 * - Visible (visible, enabled)
 * - Titled (title)
 * - TitleStyle (titleTextColor, titleFont)
 * - TooltipContainer (toolTip)
 */
import { FormItem } from './FormItem';
import { Titled } from './Titled';
import { LocalizedString } from './LocalizedString';
import { TitleStyle } from './TitleStyle';
import { Visible } from './Visible';
import { TooltipContainer } from './TooltipContainer';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';

export interface Group extends FormItem, Titled, TitleStyle, Visible, TooltipContainer {
  /** Дочерние элементы */
  items?: FormItem[];
  
  /** Только для чтения */
  readOnly?: boolean;
  
  /** Разрешить изменение содержимого */
  enableContentChange?: boolean;
  
  /** Горячая клавиша */
  shortcut?: string;
  
  /** Ширина */
  width?: number;
  
  /** Высота */
  height?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Может быть вырождена */
  degeneratable?: boolean;
}
