// Соответствует com._1c.g5.v8.dt.form.model.SelectedItemsActionsPanel
import { Group } from './Group';
import { AdditionContainer } from './AdditionContainer';
import { FormCommandBarAppearanceMode, ItemHorizontalAlignment } from './types';

export interface SelectedItemsActionsPanel extends Group, AdditionContainer {
    fillStdCommands: boolean;
    horizontalAlign?: ItemHorizontalAlignment;
    appearanceMode?: FormCommandBarAppearanceMode;
}
