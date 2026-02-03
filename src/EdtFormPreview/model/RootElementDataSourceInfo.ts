// RootElementDataSourceInfo - корневая информация об источнике данных элемента

import { ElementDataSourceInfo } from './ElementDataSourceInfo';

/**
 * RootElementDataSourceInfo - корневая информация об источнике данных элемента
 */
export interface RootElementDataSourceInfo extends ElementDataSourceInfo {
    /** Идентификатор объекта формы */
    formObjectId?: number;
    
    /** Идентификатор объекта таблицы */
    tableObjectId?: number;
}
