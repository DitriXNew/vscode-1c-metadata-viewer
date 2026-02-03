/**
 * InputFieldExtInfo - расширенная информация для поля ввода
 * @see com._1c.g5.v8.dt.form.model.InputFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color, Font } from './TitleStyle';
import { Picture } from './PageGroupExtInfo';

export type ChoiceHistoryOnInput = 
  | 'Auto'
  | 'DontUse';

export type ChoiceButtonRepresentation = 
  | 'Auto'
  | 'None'
  | 'DropDownListButton'
  | 'ChoiceButton'
  | 'DropDownListAndChoiceButton';

export type AutoShowClearButtonMode = 
  | 'Auto'
  | 'DontShow';

export type AutoShowOpenButtonMode = 
  | 'Auto'
  | 'DontShow';

export type EditTextUpdate = 
  | 'Auto'
  | 'OnValueChange'
  | 'DontUpdate';

export type SpecialTextInputMode = 
  | 'Auto'
  | 'None'
  | 'SearchInList'
  | 'SelectOnInput';

export interface InputFieldExtInfo extends FieldExtInfo {
  /** Ширина */
  width?: number;
  
  /** Авто максимальная ширина */
  autoMaxWidth?: boolean;
  
  /** Максимальная ширина */
  maxWidth?: number;
  
  /** Минимальная ширина */
  minWidth?: number;
  
  /** Высота */
  height?: number;
  
  /** Авто максимальная высота */
  autoMaxHeight?: boolean;
  
  /** Максимальная высота */
  maxHeight?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Перенос текста */
  wrap?: boolean;
  
  /** Режим пароля */
  passwordMode?: boolean;
  
  /** Многострочный режим */
  multiLine?: boolean;
  
  /** Расширенное редактирование */
  extendedEdit?: boolean;
  
  /** Маска */
  mask?: string;
  
  /** Кнопка списка выбора */
  listChoiceMode?: boolean;
  
  /** Режим выбора */
  chooseType?: boolean;
  
  /** Редактирование текста */
  textEdit?: boolean;
  
  /** История выбора при вводе */
  choiceHistoryOnInput?: ChoiceHistoryOnInput;
  
  /** Представление кнопки выбора */
  choiceButtonRepresentation?: ChoiceButtonRepresentation;
  
  /** Авто показ кнопки очистки */
  autoShowClearButtonMode?: AutoShowClearButtonMode;
  
  /** Авто показ кнопки открытия */
  autoShowOpenButtonMode?: AutoShowOpenButtonMode;
  
  /** Обновление текста редактирования */
  editTextUpdate?: EditTextUpdate;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Кнопка открытия */
  openButton?: boolean;
  
  /** Кнопка создания */
  createButton?: boolean;
  
  /** Кнопка очистки */
  clearButton?: boolean;
  
  /** Кнопка выбора */
  dropListButton?: boolean;
  
  /** Кнопка счётчика */
  spinButton?: boolean;
  
  /** Режим специального ввода текста */
  specialTextInputMode?: SpecialTextInputMode;
  
  /** Формат редактирования */
  editFormat?: string;
  
  /** Формат */
  format?: string;
  
  /** Область домена типа включена */
  typeDomainEnabled?: boolean;
}
