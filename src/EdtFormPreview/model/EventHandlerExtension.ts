// EventHandlerExtension - расширение обработчика события

import { EventHandler } from './EventHandler';
import { ExtendedMethodCallType } from './ExtendedMethodCallType';

/**
 * EventHandlerExtension - расширение обработчика события
 */
export interface EventHandlerExtension extends EventHandler {
    /** Тип вызова метода */
    callType?: ExtendedMethodCallType;
}
