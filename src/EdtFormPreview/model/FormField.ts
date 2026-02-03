/**
 * FormField - поле формы
 * @see com._1c.g5.v8.dt.form.model.FormField
 * 
 * Наследует:
 * - DataItem
 * - TitleStyle
 * - TooltipContainer
 * - EventHandlerContainer
 */
import { DataItem } from './DataItem';
import { TooltipContainer } from './TooltipContainer';
import { ManagedFormFieldType } from './ManagedFormFieldType';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './Color';
import { Font } from './Font';
import { Picture } from './Picture';
import { EventHandler } from './EventHandler';
import { FieldExtInfo } from './FieldExtInfo';
import { InputFieldExtInfo } from './InputFieldExtInfo';
import { LabelFieldExtInfo } from './LabelFieldExtInfo';
import { CheckBoxFieldExtInfo } from './CheckBoxFieldExtInfo';
import { ImageFieldExtInfo } from './ImageFieldExtInfo';
import { ExtendedTooltip } from './ExtendedTooltip';
import { FormFixedInTable } from './ColumnGroupExtInfo';
import { TableFieldEditMode } from './TableFieldEditMode';
import { WarningOnEditRepresentation } from './WarningOnEditRepresentation';

export interface FormField extends DataItem, TooltipContainer {
  /** Тип поля */
  type?: ManagedFormFieldType;
  
  /** Обработчики событий */
  handlers?: EventHandler[];
  
  /** Только для чтения */
  readOnly?: boolean;
  
  /** Предупреждение при редактировании */
  warningOnEditRepresentation?: WarningOnEditRepresentation;
  
  /** Отметка обязательного заполнения */
  markRequiredComplete?: boolean;
  
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание */
  verticalAlign?: ItemVerticalAlignment;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Режим редактирования в таблице */
  editMode?: TableFieldEditMode;
  
  /** Фиксация в таблице */
  fixingInTable?: FormFixedInTable;
  
  /** Гиперссылка ячейки */
  cellHyperlink?: boolean;
  
  /** Авто высота ячейки */
  autoCellHeight?: boolean;
  
  /** Показывать в шапке */
  showInHeader?: boolean;
  
  /** Картинка шапки */
  headerPicture?: Picture;
  
  /** Горизонтальное выравнивание шапки */
  headerHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Показывать в подвале */
  showInFooter?: boolean;
  
  /** Цвет текста подвала */
  footerTextColor?: Color;
  
  /** Цвет фона подвала */
  footerBackColor?: Color;
  
  /** Шрифт подвала */
  footerFont?: Font;
  
  /** Картинка подвала */
  footerPicture?: Picture;
  
  /** Горизонтальное выравнивание подвала */
  footerHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Показывать в карточке */
  showInCard?: boolean;
  
  /** Фиксировать в карточке */
  fixInCard?: boolean;
  
  /** Ширина */
  width?: number;
  
  /** Высота */
  height?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Расширенная информация поля */
  extInfo?: 
    | InputFieldExtInfo 
    | LabelFieldExtInfo 
    | CheckBoxFieldExtInfo 
    | ImageFieldExtInfo
    | FieldExtInfo;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
  
  /** Контекстное меню */
  contextMenu?: any;
}
