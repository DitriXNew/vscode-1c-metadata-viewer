// Соответствует com._1c.g5.v8.dt.form.model.CombinedPropertyInfo
import { PropertyInfo } from './PropertyInfo';

export interface CombinedPropertyInfo extends PropertyInfo {
    extensionProjectPropInfo: PropertyInfo;
    parentProjectPropInfo: PropertyInfo;
}
