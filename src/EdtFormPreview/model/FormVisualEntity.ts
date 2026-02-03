/**
 * FormVisualEntity - базовый интерфейс для всех визуальных элементов формы
 * @see com._1c.g5.v8.dt.form.model.FormVisualEntity
 */

/**
 * Шрифт (Font) - расширенная версия для ExtInfo
 * @see com._1c.g5.v8.dt.mcore.Font
 */
export interface ItemFont {
    /** Имя шрифта */
    name?: string;
    /** Размер */
    size?: number;
    /** Полужирный */
    bold?: boolean;
    /** Курсив */
    italic?: boolean;
    /** Подчеркнутый */
    underline?: boolean;
    /** Зачеркнутый */
    strikeout?: boolean;
    /** Стиль шрифта (для предопределенных шрифтов) */
    style?: string;
}

export interface FormVisualEntity {
  userChangedProperties?: Map<string, boolean>;
}
