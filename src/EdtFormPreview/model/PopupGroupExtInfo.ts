/**
 * PopupGroupExtInfo - расширенная информация для всплывающей группы (подменю)
 * @see com._1c.g5.v8.dt.form.model.PopupGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { Color } from './Color';
import { Picture } from './Picture';
import { ButtonImportance, ButtonRepresentation, ButtonShape, ButtonShapeRepresentation, MenuElementPlacementArea } from './types';

export interface PopupGroupExtInfo extends GroupExtInfo {
  /** Картинка */
  picture?: Picture;
  
  /** Представление */
  representation?: ButtonRepresentation;
  
  /** Область размещения */
  placementArea?: MenuElementPlacementArea;
  
  /** Источник команд */
  commandSource?: any;
  
  /** Форма кнопки */
  shape?: ButtonShape;
  
  /** Представление формы кнопки */
  shapeRepresentation?: ButtonShapeRepresentation;
  
  /** Важность */
  importance?: ButtonImportance;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
}
