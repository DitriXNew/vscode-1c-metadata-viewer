/**
 * TooltipContainer - интерфейс для элементов с подсказками
 * @see com._1c.g5.v8.dt.form.model.TooltipContainer
 */
import { LocalizedString } from './LocalizedString';

export interface TooltipContainer {
  toolTip?: LocalizedString | LocalizedString[] | string;
  toolTipRepresentation?: ToolTipRepresentation;
}

export type ToolTipRepresentation = 
  | 'Auto'
  | 'None'
  | 'Balloon'
  | 'Button'
  | 'ShowTop'
  | 'ShowBottom';
