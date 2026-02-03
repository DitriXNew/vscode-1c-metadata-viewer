// Соответствует com._1c.g5.v8.dt.form.model.ElementDataSourceInfo
import { AbstractFormDataSourceInfo } from './AbstractFormDataSourceInfo';
import { AbstractDataPath } from './AbstractDataPath';

export type ElementDataSourceInfoType = 
    | 'ELEMENT'
    | 'CURRENT_DATA'
    | 'EMPTY_CURRENT_DATA'
    | 'PROPERTY_INFO'
    | 'PROPERTY_INFO_TABLE';

export interface ElementDataSourceInfo extends AbstractFormDataSourceInfo {
    elementDataSourceInfos?: ElementDataSourceInfo[];
    type?: ElementDataSourceInfoType;
    dataPath?: AbstractDataPath;
    parent?: ElementDataSourceInfo;
}
