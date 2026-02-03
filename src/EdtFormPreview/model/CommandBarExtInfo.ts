/**
 * CommandBarExtInfo - расширенная информация для командной панели
 * @see com._1c.g5.v8.dt.form.model.CommandBarExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { FormCommandBarAppearanceMode, ItemHorizontalAlignment } from './types';

export interface CommandBarExtInfo extends GroupExtInfo {
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Режим отображения */
  appearanceMode?: FormCommandBarAppearanceMode;
  
  /** Источник команд */
  commandSource?: any;
}
