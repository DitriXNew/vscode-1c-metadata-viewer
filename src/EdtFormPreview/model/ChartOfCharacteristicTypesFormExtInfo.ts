/**
 * ChartOfCharacteristicTypesFormExtInfo - расширенная информация формы плана видов характеристик
 * Based on EDT com._1c.g5.v8.dt.form.model.ChartOfCharacteristicTypesFormExtInfo
 */

import { FormExtInfo } from './FormExtInfo';
import { FoldersAndItemsUse } from './types';

export interface ChartOfCharacteristicTypesFormExtInfo extends FormExtInfo {
    /** Использование для папок и элементов */
    useForFoldersAndItems?: FoldersAndItemsUse;
}
