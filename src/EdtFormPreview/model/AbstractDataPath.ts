// Соответствует com._1c.g5.v8.dt.form.model.AbstractDataPath
import { DataPathReferredObject } from './DataPathReferredObject';

export interface AbstractDataPath {
    segments: string[];
    objects: DataPathReferredObject[];
    extraPaths: string[];
}
