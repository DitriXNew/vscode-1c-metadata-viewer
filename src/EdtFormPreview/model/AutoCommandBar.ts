/**
 * AutoCommandBar - автоматическая командная панель
 * Based on EDT com._1c.g5.v8.dt.form.model.AutoCommandBar
 */

import { Group } from './Group';
import { ItemHorizontalAlignment, FormCommandBarAppearanceMode } from './types';

/**
 * Автоматическая командная панель
 */
export interface AutoCommandBar extends Group {
    /** Режим отображения */
    appearanceMode?: FormCommandBarAppearanceMode;
    
    /** Горизонтальное выравнивание */
    horizontalAlign?: ItemHorizontalAlignment;
    
    /** Автозаполнение */
    autoFill?: boolean;
}
