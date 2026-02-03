/**
 * FormCommand - команда формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormCommand
 */

import { LocalizedString } from './LocalizedString';
import { Picture } from './Picture';
import { AdjustableBoolean, CommandActionPurpose, CurrentRowUse, DefaultRepresentation, SelectedRowsUse } from './types';

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
    
    /** Действие (имя обработчика или команда) */
    action?: string;
    
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
    
    /** ID связанного элемента таблицы (8.3.15+) */
    associatedTableElementId8315?: string;
    
    /** Использование выделенных строк */
    selectedRowsUse?: SelectedRowsUse;
    
    /** Комментарий */
    comment?: string;
}
