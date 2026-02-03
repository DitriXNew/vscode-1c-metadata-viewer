/**
 * InputFieldExtInfo - расширенная информация для поля ввода
 * @see com._1c.g5.v8.dt.form.model.InputFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color } from './Color';
import { Font } from './Font';
import { Picture } from './Picture';
import { ChoiceHistoryOnInput } from './ChoiceHistoryOnInput';
import { ChoiceButtonRepresentation } from './ChoiceButtonRepresentation';
import { LocalizedString } from './LocalizedString';
import { AutoShowClearButtonMode } from './AutoShowClearButtonMode';
import { AutoShowOpenButtonMode } from './AutoShowOpenButtonMode';
import { EditTextUpdate } from './EditTextUpdate';
import { SpecialTextInputMode } from './SpecialTextInputMode';

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
  
  /** Кнопка выпадающего списка */
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
  
  /** Отметка отрицательных */
  markNegatives?: boolean;
  
  // === Multiple Values (8.3.23+) ===
  
  /** Шрифт множественных значений */
  multipleValuesFont?: Font;
  
  /** Гиперссылка множественных значений */
  multipleValuesHyperlink?: boolean;
  
  /** Цвет текста множественных значений */
  multipleValuesTextColor?: Color;
  
  /** Цвет фона множественных значений */
  multipleValuesBackColor?: Color;
  
  /** Разрешить ввод пустых множественных значений */
  allowInputEmptyMultipleValues?: boolean;
  
  /** Разрешить дубликаты множественных значений */
  allowMultipleValuesDuplicates?: boolean;
  
  /** Расширенное редактирование множественных значений */
  extendedEditMultipleValues?: boolean;
  
  /** Размер картинки множественного значения */
  multipleValuePictureSize?: string;
  
  /** Форма картинки множественного значения */
  multipleValuePictureShape?: string;
  
  /** Показывать флажки в выпадающем списке */
  showCheckBoxesInDropList?: boolean;
  
  /** Картинка множественных значений */
  multipleValuesPicture?: Picture;
  
  /** Путь к данным множественного значения */
  multipleValueDataPath?: any;
  
  /** Путь к картинке множественного значения */
  multipleValuePictureDataPath?: any;
  
  /** Путь к представлению множественного значения */
  multipleValuePresentDataPath?: any;
  
  // === Кнопки ===
  
  /** Кнопка выбора */
  choiceButton?: boolean;
  
  /** Картинка кнопки выбора */
  choiceButtonPicture?: Picture;
  
  // === Выбор и незавершённый ввод ===
  
  /** Авто выбор незавершённого */
  autoChoiceIncomplete?: string;
  
  /** Быстрый выбор */
  quickChoice?: string;
  
  /** Выбор папок и элементов */
  choiceFoldersAndItems?: string;
  
  /** Авто отметка незавершённого */
  autoMarkIncomplete?: string;
  
  /** Режим выбора незавершённого элемента */
  incompleteChoiceMode?: string;
  
  // === Ограничения значений ===
  
  /** Минимальное значение */
  minValue?: any;
  
  /** Максимальное значение */
  maxValue?: any;
  
  /** Форма выбора */
  choiceForm?: string;
  
  /** Связи параметров выбора */
  choiceParameterLinks?: any[];
  
  /** Параметры выбора */
  choiceParameters?: any[];
  
  /** Доступные типы */
  availableTypes?: any;
  
  // === Список выбора ===
  
  /** Список выбора */
  choiceList?: any[];
  
  /** Кнопка списка выбора */
  choiceListButton?: boolean;
  
  /** Высота списка выбора */
  choiceListHeight?: number;
  
  /** Ширина выпадающего списка */
  dropListWidth?: number;
  
  /** Связь типа */
  typeLink?: any;
  
  // === 8.5.1+ ===
  
  /** Вариант контроля высоты */
  heightControlVariant?: string;
  
  /** Авто коррекция при вводе текста */
  autoCorrectionOnTextInput?: string;
  
  /** Проверка орфографии при вводе текста */
  spellCheckingOnTextInput?: string;
  
  /** Авто капитализация при вводе текста */
  autoCapitalizationOnTextInput?: string;
  
  /** Текст кнопки возврата экранной клавиатуры */
  onScreenKeyboardReturnKeyText?: string;
  
  /** Подсказка ввода */
  inputHint?: LocalizedString;
  
  /** Подсказка автозаполнения */
  autofillHint?: string;
  
  /** Заголовок кнопки выбора */
  choiceButtonTitle?: any;
  
  /** Режим выбора времени */
  timeChoiceMode?: string;
  
  /** Картинка */
  picture?: Picture;
  
  /** Подсказка выпадающего списка */
  dropListHint?: any;
  
  /** Размер текста */
  textSize?: string;
}
