/**
 * LocalStringType - тип локализованной строки
 * Based on EDT com._1c.g5.v8.dt.form.model.LocalStringType
 */

export interface LocalStringType {
    content?: LocalStringContent[];
}

export interface LocalStringContent {
    key?: string;
    value?: string;
}
