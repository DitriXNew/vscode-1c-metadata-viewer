// Соответствует com._1c.g5.v8.dt.form.model.AbstractFormAttribute
import { Titled } from './Titled';
import { FillChecking } from './FillChecking';

export interface AbstractFormAttribute extends Titled {
    name: string;
    id: number;
    valueType?: any; // TypeDescription
    view?: string; // AdjustableBoolean
    edit?: string; // AdjustableBoolean
    fillChecking?: FillChecking;
    functionalOptions: string[];
}
