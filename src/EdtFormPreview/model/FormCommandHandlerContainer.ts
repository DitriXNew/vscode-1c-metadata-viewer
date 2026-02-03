// FormCommandHandlerContainer - контейнер обработчика команды формы

import { CommandHandler } from './CommandHandler';
import { CommandHandlerContainer } from './CommandHandlerContainer';

/**
 * FormCommandHandlerContainer - контейнер обработчика команды формы
 */
export interface FormCommandHandlerContainer extends CommandHandlerContainer {
    /** Обработчик команды */
    handler?: CommandHandler;
}
