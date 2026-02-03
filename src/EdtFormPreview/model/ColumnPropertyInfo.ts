// Соответствует com._1c.g5.v8.dt.form.model.ColumnPropertyInfo
import { PropertyInfo } from './PropertyInfo';

export interface ColumnPropertyInfo extends PropertyInfo {
    // Расширяет PropertyInfo, hasChildren() проверяет наличие дочерних propertyInfos
}
