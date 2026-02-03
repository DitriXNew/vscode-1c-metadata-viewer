/**
 * FormField - поле формы
 * @see com._1c.g5.v8.dt.form.model.FormField
 * 
 * Наследует:
 * - DataItem
 * - FormStandardCommandSource
 * - TitleStyle
 * - TooltipContainer
 * - EventHandlerContainer
 * - ExtendedTooltipHolder
 * - ContextMenuHolder
 * - SelectedItemsActionsPanelHolder
 * - AdditionSource
 * - ExtensionAdoptedProperty
 */
import { DataItem } from './DataItem';
import { TooltipContainer } from './TooltipContainer';
import { Color } from './Color';
import { Font } from './Font';
import { Picture } from './Picture';
import { EventHandler } from './EventHandler';
import { FieldExtInfo } from './FieldExtInfo';
import { InputFieldExtInfo } from './InputFieldExtInfo';
import { LabelFieldExtInfo } from './LabelFieldExtInfo';
import { CheckBoxFieldExtInfo } from './CheckBoxFieldExtInfo';
import { ImageFieldExtInfo } from './ImageFieldExtInfo';
import { ExtendedTooltip } from './ExtendedTooltip';
import { LocalizedString } from './LocalizedString';
import { AbstractDataPath } from './AbstractDataPath';
import { AppearanceVariantInCard, AutoWidthInTable, CellHyperlinkDisplayVariant, CellHyperlinkRepresentation, FormFixedInTable, ItemHorizontalAlignment, ItemVerticalAlignment, OnMainServerUnavalableBehavior, TableCellMarkType, TableFieldEditMode, WarningOnEditRepresentation, WidthVariantInCard } from './types';
import { ManagedFormFieldType } from './ManagedFormFieldType';

export interface FormField extends DataItem, TooltipContainer {
  /** Тип поля */
  type?: ManagedFormFieldType;
  
  /** Обработчики событий */
  handlers?: EventHandler[];
  
  /** Только для чтения */
  readOnly?: boolean;
  
  /** Предупреждение при редактировании */
  warningOnEditRepresentation?: WarningOnEditRepresentation;
  
  /** Текст предупреждения при редактировании */
  warningOnEdit?: LocalizedString | LocalizedString[];
  
  /** Исключенные команды */
  excludedCommands?: string[];
  
  /** Отметка обязательного заполнения */
  markRequiredComplete?: boolean;
  
  /** Горизонтальное выравнивание */
  horizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание */
  verticalAlign?: ItemVerticalAlignment;
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Режим редактирования в таблице */
  editMode?: TableFieldEditMode;
  
  /** Фиксация в таблице */
  fixingInTable?: FormFixedInTable;
  
  /** Гиперссылка ячейки */
  cellHyperlink?: boolean;
  
  /** Авто высота ячейки */
  autoCellHeight?: boolean;
  
  /** Показывать в шапке */
  showInHeader?: boolean;
  
  /** Картинка шапки */
  headerPicture?: Picture;
  
  /** Горизонтальное выравнивание шапки */
  headerHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Показывать в подвале */
  showInFooter?: boolean;
  
  /** Текст подвала */
  footerText?: LocalizedString | LocalizedString[];
  
  /** Цвет текста подвала */
  footerTextColor?: Color;
  
  /** Цвет фона подвала */
  footerBackColor?: Color;
  
  /** Шрифт подвала */
  footerFont?: Font;
  
  /** Картинка подвала */
  footerPicture?: Picture;
  
  /** Горизонтальное выравнивание подвала */
  footerHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Показывать в карточке */
  showInCard?: boolean;
  
  /** Фиксировать в карточке */
  /** Фиксировать в карточке */
  fixInCard?: boolean;
  
  /** Показывать заголовок в карточке */
  showTitleInCard?: boolean;
  
  /** Ширина в карточке */
  widthInCard?: WidthVariantInCard;
  
  /** Отметка ячейки */
  cellMark?: TableCellMarkType;
  
  /** Внешний вид в карточке */
  appearanceInCard?: AppearanceVariantInCard;
  
  /** Авто ширина в таблице */
  autoWidthInTable?: AutoWidthInTable;
  
  /** Представление гиперссылки ячейки */
  cellHyperlinkRepresentation?: CellHyperlinkRepresentation;
  
  /** Вариант отображения гиперссылки ячейки */
  cellHyperlinkDisplayVariant?: CellHyperlinkDisplayVariant;
  
  /** Путь к данным подвала */
  footerDataPath?: AbstractDataPath;
  
  /** Поведение при недоступности главного сервера */
  onMainServerUnavalableBehavior?: OnMainServerUnavalableBehavior;
  
  /** Ширина */
  width?: number;
  
  /** Высота */
  height?: number;
  
  /** Растягивать по горизонтали */
  horizontalStretch?: boolean;
  
  /** Растягивать по вертикали */
  verticalStretch?: boolean;
  
  /** Расширенная информация поля */
  extInfo?: 
    | InputFieldExtInfo 
    | LabelFieldExtInfo 
    | CheckBoxFieldExtInfo 
    | ImageFieldExtInfo
    | FieldExtInfo;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
  
  /** Контекстное меню */
  contextMenu?: any;
}
