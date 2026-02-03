/**
 * FormItemTitle - заголовок элемента формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormItemTitle
 */

export interface FormItemTitle {
    title?: LocalString;
    titleFont?: Font;
    titleTextColor?: Color;
    titleBackColor?: Color;
    titleBorder?: Border;
}

import { LocalString } from './LocalString';
import { Font } from './Font';
import { Color } from './Color';
import { Border } from './Border';
