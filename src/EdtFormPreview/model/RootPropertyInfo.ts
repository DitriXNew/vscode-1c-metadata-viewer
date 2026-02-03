// RootPropertyInfo - корневая информация о свойстве

import { PropertyInfo } from './PropertyInfo';

/**
 * RootPropertyInfo - корневая информация о свойстве
 */
export interface RootPropertyInfo extends PropertyInfo {
    /** Идентификатор объекта формы */
    formObjectId?: number;
}
