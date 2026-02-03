/**
 * CheckBoxFieldExtInfo - расширенная информация для поля флажка
 * @see com._1c.g5.v8.dt.form.model.CheckBoxFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color, Font } from './TitleStyle';
import { LocalizedString } from './Titled';

export type CheckBoxKind = 
  | 'Auto'
  | 'CheckBox'
  | 'Tumbler'
  | 'PushButton'
  | 'Switch';

export type TumblerRepresentation = 
  | 'Auto'
  | 'LeftAndRight'
  | 'UpAndDown';

export interface CheckBoxFieldExtInfo extends FieldExtInfo {
  /** Тип флажка */
  checkBoxType?: CheckBoxKind;
  
  /** Представление тумблера */
  tumblerRepresentation?: TumblerRepresentation;
  
  /** Три состояния */
  threeState?: boolean;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Формат редактирования */
  editFormat?: LocalizedString | LocalizedString[] | string;
  
  /** Высота заголовка элемента */
  itemTitleHeight?: number;
  
  /** Ширина элемента */
  itemWidth?: number;
  
  /** Высота элемента */
  itemHeight?: number;
  
  /** Равная ширина элементов */
  equalElementsWidth?: boolean;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
}
