/**
 * ConditionalAppearance - условное оформление
 * Based on EDT com._1c.g5.v8.dt.form.model.ConditionalAppearance
 */

export interface ConditionalAppearance {
    items?: ConditionalAppearanceItem[];
}

export interface ConditionalAppearanceItem {
    use?: boolean;
    filter?: ConditionalAppearanceFilter;
    appearance?: Appearance;
    fields?: string[];
}

export interface ConditionalAppearanceFilter {
    items?: ConditionalAppearanceFilterItem[];
}

export interface ConditionalAppearanceFilterItem {
    use?: boolean;
    left?: string;
    comparisonType?: ComparisonType;
    right?: any;
}

export interface Appearance {
    font?: Font;
    textColor?: Color;
    backColor?: Color;
    border?: Border;
    visible?: boolean;
    enabled?: boolean;
    text?: string;
    picture?: Picture;
}

import { Font } from './Font';
import { Color } from './Color';
import { Border } from './Border';
import { Picture } from './Picture';

export type ComparisonType = 
    | 'Equal'
    | 'NotEqual'
    | 'Less'
    | 'LessOrEqual'
    | 'Greater'
    | 'GreaterOrEqual'
    | 'Contains'
    | 'NotContains'
    | 'InList'
    | 'NotInList'
    | 'InHierarchy'
    | 'NotInHierarchy'
    | 'InListByHierarchy'
    | 'NotInListByHierarchy'
    | 'Filled'
    | 'NotFilled'
    | 'BeginsWith'
    | 'NotBeginsWith'
    | 'Like'
    | 'NotLike';
