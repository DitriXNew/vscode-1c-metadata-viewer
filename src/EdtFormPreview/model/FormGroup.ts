/**
 * FormGroup - группа элементов формы
 * @see com._1c.g5.v8.dt.form.model.FormGroup
 * 
 * Наследует:
 * - Group
 * - ExtendedTooltipHolder
 * - ExtensionAdoptedProperty
 */
import { Group } from './Group';
import { ManagedFormGroupType } from './ManagedFormGroupType';
import { GroupExtInfo } from './GroupExtInfo';
import { UsualGroupExtInfo } from './UsualGroupExtInfo';
import { PagesGroupExtInfo } from './PagesGroupExtInfo';
import { PageGroupExtInfo } from './PageGroupExtInfo';
import { CommandBarExtInfo } from './CommandBarExtInfo';
import { ButtonGroupExtInfo } from './ButtonGroupExtInfo';
import { ColumnGroupExtInfo } from './ColumnGroupExtInfo';
import { PopupGroupExtInfo } from './PopupGroupExtInfo';

export interface ExtendedTooltip {
  name: string;
  id: number;
  type?: string;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
}

export interface FormGroup extends Group {
  /** Тип группы */
  type?: ManagedFormGroupType;
  
  /** Расширенная информация группы */
  extInfo?: 
    | UsualGroupExtInfo 
    | PagesGroupExtInfo 
    | PageGroupExtInfo 
    | CommandBarExtInfo
    | ButtonGroupExtInfo
    | ColumnGroupExtInfo
    | PopupGroupExtInfo
    | GroupExtInfo;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
}
