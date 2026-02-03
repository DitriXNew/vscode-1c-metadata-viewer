/**
 * Decoration - декорация формы (надпись или картинка)
 * @see com._1c.g5.v8.dt.form.model.Decoration
 * 
 * Наследует:
 * - FormItem
 * - Titled
 * - Visible
 * - TooltipContainer
 */
import { FormItem } from './FormItem';
import { Titled } from './Titled';
import { LocalizedString } from './LocalizedString';
import { Visible } from './Visible';
import { TooltipContainer } from './TooltipContainer';
import { Color } from './Color';
import { Font } from './Font';
import { DecorationExtInfo } from './DecorationExtInfo';
import { LabelDecorationExtInfo } from './LabelDecorationExtInfo';
import { PictureDecorationExtInfo } from './PictureDecorationExtInfo';
import { ExtendedTooltip } from './ExtendedTooltip';
import { EventHandler } from './EventHandler';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './types';
import { ManagedFormDecorationType } from './ManagedFormDecorationType';

export interface Decoration extends FormItem, Titled, Visible, TooltipContainer {
  /** Тип декорации */
  type?: ManagedFormDecorationType;
  
  /** Форматированная */
  formatted?: boolean;
  
  /** Ширина */
  width?: number;
  
  /** Авто максимальная ширина */
  autoMaxWidth?: boolean;
  
  /** Максимальная ширина */
  maxWidth?: number;
  
  /** Минимальная ширина */
  minWidth?: number;
  
  /** Высота */
  height?: number;
  
  /** Авто максимальная высота */
  autoMaxHeight?: boolean;
  
  /** Максимальная высота */
  maxHeight?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Пропускать при вводе */
  skipOnInput?: boolean;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Горячая клавиша */
  shortcut?: string;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Расширенная информация декорации */
  extInfo?: 
    | LabelDecorationExtInfo 
    | PictureDecorationExtInfo
    | DecorationExtInfo;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
  
  /** Контекстное меню */
  contextMenu?: any;

  /** Обработчики событий */
  handlers?: EventHandler[];
}
