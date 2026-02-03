/**
 * CommandBarExtInfo - расширенная информация для командной панели
 * @see com._1c.g5.v8.dt.form.model.CommandBarExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { ItemHorizontalAlignment } from './ItemAlignment';

export type FormCommandBarAppearanceMode = 
  | 'Auto'
  | 'Compact'
  | 'Normal';

export interface CommandBarExtInfo extends GroupExtInfo {
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Режим отображения */
  appearanceMode?: FormCommandBarAppearanceMode;
  
  /** Источник команд */
  commandSource?: any;
}
