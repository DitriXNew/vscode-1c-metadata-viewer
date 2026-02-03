/**
 * CatalogFormExtInfo - расширенная информация формы справочника
 * Based on EDT com._1c.g5.v8.dt.form.model.CatalogFormExtInfo
 */

import { FormExtInfo } from './FormExtInfo';
import { FoldersAndItemsUse } from './FoldersAndItemsUse';

export interface CatalogFormExtInfo extends FormExtInfo {
    /** Использование для папок и элементов */
    useForFoldersAndItems?: FoldersAndItemsUse;
}
