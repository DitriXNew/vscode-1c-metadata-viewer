/**
 * HandlerContainer - контейнер обработчиков
 * Based on EDT com._1c.g5.v8.dt.form.model.HandlerContainer
 */
import { EventHandler } from './EventHandler';

export { EventHandler };

export interface HandlerContainer {
    handlers?: EventHandler[];
}
