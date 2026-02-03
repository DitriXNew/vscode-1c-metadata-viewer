// Соответствует com._1c.g5.v8.dt.form.model.FormCommandInterfaceItem
import { AbstractDataPath } from './AbstractDataPath';
import { CommandKind } from './CommandKind';

export interface FormCommandInterfaceItem {
    command?: any; // Command
    type?: CommandKind;
    commandParameter?: AbstractDataPath;
    group?: any; // CommandGroup
    index?: number;
    userVisible?: string; // AdjustableBoolean
}
