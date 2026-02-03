/**
 * Border - граница
 * Based on EDT com._1c.g5.v8.dt.form.model.Border
 */

import { Color } from './Color';
import { BorderStyle } from './types';

export interface Border {
    ref?: string;
    style?: BorderStyle;
    color?: Color;
    width?: number;
}
