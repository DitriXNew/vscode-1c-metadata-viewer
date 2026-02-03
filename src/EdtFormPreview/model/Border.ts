/**
 * Border - граница
 * Based on EDT com._1c.g5.v8.dt.form.model.Border
 */

export interface Border {
    ref?: string;
    style?: BorderStyle;
    color?: Color;
    width?: number;
}

import { Color } from './Color';

export type BorderStyle = 
    | 'None'
    | 'Solid'
    | 'Double'
    | 'Dash'
    | 'DashDot'
    | 'DashDotDot'
    | 'Dot'
    | 'Groove'
    | 'Ridge'
    | 'Inset'
    | 'Outset'
    | 'Single'
    | 'Underline'
    | 'Overline'
    | 'Emboss'
    | 'Etched'
    | 'DashSmall'
    | 'Rounded';
