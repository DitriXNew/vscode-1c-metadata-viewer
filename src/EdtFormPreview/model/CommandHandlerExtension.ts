// CommandHandlerExtension - расширение обработчика команды

import { CommandHandler } from './CommandHandler';
import { ExtendedMethodCallType } from './ExtendedMethodCallType';

/**
 * CommandHandlerExtension - расширение обработчика команды
 */
export interface CommandHandlerExtension extends CommandHandler {
    /** Тип вызова метода */
    callType?: ExtendedMethodCallType;
}
