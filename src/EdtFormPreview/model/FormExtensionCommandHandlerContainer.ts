// FormExtensionCommandHandlerContainer - контейнер обработчиков команд расширения формы

import { CommandHandlerContainer } from './CommandHandlerContainer';
import { CommandHandlerExtension } from './CommandHandlerExtension';

/**
 * FormExtensionCommandHandlerContainer - контейнер обработчиков команд расширения формы
 */
export interface FormExtensionCommandHandlerContainer extends CommandHandlerContainer {
    /** Список обработчиков команд расширения */
    handlers?: CommandHandlerExtension[];
}
