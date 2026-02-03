// Соответствует com._1c.g5.v8.dt.form.model.FormAttributeAdditionalColumns
import { AbstractDataPath } from './AbstractDataPath';
import { FormAttributeColumn } from './FormAttributeColumn';

export interface FormAttributeAdditionalColumns {
    tablePath?: AbstractDataPath;
    columns: FormAttributeColumn[];
}
