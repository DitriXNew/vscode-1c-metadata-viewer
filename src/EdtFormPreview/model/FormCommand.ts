/**
 * FormCommand - команда формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormCommand
 */

import { AdjustableBoolean } from './FormAttribute';
import { LocalizedString } from './Titled';
import { CurrentRowUse } from './CurrentRowUse';
import { Picture } from './Picture';
import { DefaultRepresentation } from './DefaultRepresentation';

/**
 * Назначение действия команды
 */
export type CommandActionPurpose = 
    | 'Auto'
    | 'GeneratePrintForm';

/**
 * Использование выделенных строк
 */
export type SelectedRowsUse = 
    | 'Auto'
    | 'DontUse';

/**
 * Обработчик команды
 */
export interface CommandHandlerContainer {
    /** Имя обработчика */
    name?: string;
}

/**
 * Команда формы
 */
export interface FormCommand {
    /** ID */
    id?: number;
    
    /** Имя */
    name?: string;
    
    /** Заголовок */
    title?: LocalizedString | string;
    
    /** Подсказка */
    toolTip?: { [key: string]: string };
    
    /** Использование */
    use?: AdjustableBoolean;
    
    /** Сочетание клавиш */
    shortcut?: string;
    
    /** Картинка */
    picture?: Picture;
    
    /** Действие */
    action?: CommandHandlerContainer;
    
    /** Назначение действия */
    actionPurpose?: CommandActionPurpose;
    
    /** Функциональные опции */
    functionalOptions?: string[];
    
    /** Представление */
    representation?: DefaultRepresentation;
    
    /** Изменяет сохраняемые данные */
    modifiesStoredData?: boolean;
    
    /** Использование текущей строки */
    currentRowUse?: CurrentRowUse;
    
    /** ID связанного элемента таблицы */
    associatedTableElementId?: number;
    
    /** Использование выделенных строк */
    selectedRowsUse?: SelectedRowsUse;
    
    /** Комментарий */
    comment?: string;
}
