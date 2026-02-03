/**
 * FormStandardCommand - стандартная команда формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormStandardCommand
 */

import { DefaultRepresentation } from './DefaultRepresentation';
import { SelectedRowsUse } from './SelectedRowsUse';
import { CurrentRowUse } from './CurrentRowUse';
import { Picture } from './Picture';

/**
 * Стандартная команда формы
 */
export interface FormStandardCommand {
    /** Имя */
    name?: string;
    
    /** Текст */
    text?: string;
    
    /** Подсказка */
    tooltip?: string;
    
    /** Сочетание клавиш */
    shortcut?: string;
    
    /** Картинка */
    picture?: Picture;
    
    /** Команда по умолчанию */
    defaultCommand?: boolean;
    
    /** Представление */
    representation?: DefaultRepresentation;
    
    /** Важная */
    important?: boolean;
    
    /** Изменяет данные */
    modifiesData?: boolean;
    
    /** Использует дополнительный параметр */
    usesExtraParameter?: boolean;
    
    /** Верхняя командная панель формы */
    topFormCommandBar?: boolean;
    
    /** Видимость пользователю */
    userVisible?: boolean;
    
    /** Создать кнопку */
    createButton?: boolean;
    
    /** Использование текущей строки */
    currentRowUse?: CurrentRowUse;
    
    /** Использование выделенных строк */
    selectedRowsUse?: SelectedRowsUse;
}
