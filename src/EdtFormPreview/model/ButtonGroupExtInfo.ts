/**
 * ButtonGroupExtInfo - расширенная информация для группы кнопок
 * @see com._1c.g5.v8.dt.form.model.ButtonGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ButtonGroupRepresentation, MenuElementPlacementArea } from './types';

export interface ButtonGroupExtInfo extends GroupExtInfo {
  /** Источник команд */
  commandSource?: any;
  
  /** Представление */
  representation?: ButtonGroupRepresentation;
  
  /** Область размещения */
  placementArea?: MenuElementPlacementArea;
}
