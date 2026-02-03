// PropertyInfoWithChildren - информация о свойстве с дочерними элементами

import { PropertyInfo } from './PropertyInfo';

/**
 * PropertyInfoWithChildren - информация о свойстве с дочерними элементами
 */
export interface PropertyInfoWithChildren extends PropertyInfo {
    /** Дочерние свойства */
    children: PropertyInfo[];
}
