// Соответствует com._1c.g5.v8.dt.form.model.ElementDataSourceInfo
import { AbstractFormDataSourceInfo } from './AbstractFormDataSourceInfo';
import { AbstractDataPath } from './AbstractDataPath';
import { ElementDataSourceInfoType } from './types';

export interface ElementDataSourceInfo extends AbstractFormDataSourceInfo {
    elementDataSourceInfos?: ElementDataSourceInfo[];
    type?: ElementDataSourceInfoType;
    dataPath?: AbstractDataPath;
    parent?: ElementDataSourceInfo;
}
