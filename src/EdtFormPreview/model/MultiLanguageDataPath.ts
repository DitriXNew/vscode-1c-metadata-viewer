// Соответствует com._1c.g5.v8.dt.form.model.MultiLanguageDataPath
import { DataPath } from './DataPath';
import { AbstractDataPath } from './AbstractDataPath';
import { DataPathReferredObject } from './DataPathReferredObject';

export interface MultiLanguageDataPath extends DataPath {
    activeLanguage: number;
    paths: AbstractDataPath[];
    objects: DataPathReferredObject[];
}
