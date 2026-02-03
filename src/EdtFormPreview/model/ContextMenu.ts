/**
 * ContextMenu - контекстное меню
 * Based on EDT com._1c.g5.v8.dt.form.model.ContextMenu
 */

import { Group } from './Group';

/**
 * Контекстное меню
 */
export interface ContextMenu extends Group {
    /** Автозаполнение */
    autoFill?: boolean;
}
