/**
 * PagesGroupExtInfo - расширенная информация для группы страниц (вкладок)
 * @see com._1c.g5.v8.dt.form.model.PagesGroupExtInfo
 */
import { GroupExtInfo } from './GroupExtInfo';
import { CurrentRowUse } from './CurrentRowUse';
import { PagesRepresentation } from './PagesRepresentation';

export type FormPagesRepresentation = PagesRepresentation;

export interface PagesGroupExtInfo extends GroupExtInfo {
  /** Представление страниц */
  pagesRepresentation?: FormPagesRepresentation;
  
  /** Использование текущей строки */
  currentRowUse?: CurrentRowUse;
  
  /** Связанный элемент таблицы */
  associatedTableElementId?: number;
}
