// EventHandlerContainer - контейнер обработчиков событий

import { EventHandler } from './EventHandler';

/**
 * EventHandlerContainer - контейнер обработчиков событий
 */
export interface EventHandlerContainer {
    /** Список обработчиков событий */
    handlers?: EventHandler[];
}
