// Соответствует com._1c.g5.v8.dt.form.model.CommandBarHolder
import { AutoCommandBar } from './AutoCommandBar';
import { FormElementCommandBarLocation } from './types';

export interface CommandBarHolder {
    commandBarLocation?: FormElementCommandBarLocation;
    showCommandBar?: boolean;
    autoCommandBar?: AutoCommandBar;
    topCommandBar?: AutoCommandBar;
    bottomCommandBar?: AutoCommandBar;
    fabCommandBar?: AutoCommandBar;
}
