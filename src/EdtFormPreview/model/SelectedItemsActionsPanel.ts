// Соответствует com._1c.g5.v8.dt.form.model.SelectedItemsActionsPanel
import { Group } from './Group';
import { AdditionContainer } from './AdditionContainer';
import { ItemHorizontalAlignment } from './ItemHorizontalAlignment';
import { FormCommandBarAppearanceMode } from './FormCommandBarAppearanceMode';

export interface SelectedItemsActionsPanel extends Group, AdditionContainer {
    fillStdCommands: boolean;
    horizontalAlign?: ItemHorizontalAlignment;
    appearanceMode?: FormCommandBarAppearanceMode;
}
