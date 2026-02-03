// CommandHandlerExtension - расширение обработчика команды

import { CommandHandler } from './CommandHandler';
import { ExtendedMethodCallType } from './types';

/**
 * CommandHandlerExtension - расширение обработчика команды
 */
export interface CommandHandlerExtension extends CommandHandler {
    /** Тип вызова метода */
    callType?: ExtendedMethodCallType;
}
