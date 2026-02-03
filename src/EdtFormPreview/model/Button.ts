/**
 * Button - кнопка формы
 * @see com._1c.g5.v8.dt.form.model.Button
 * 
 * Наследует:
 * - DataItem
 * - ExtendedTooltipHolder
 */
import { DataItem } from './DataItem';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { Color } from './Color';
import { Font } from './Font';
import { Picture } from './Picture';
import { ExtendedTooltip } from './ExtendedTooltip';
import { ButtonShape } from './ButtonShape';
import { ButtonShapeRepresentation } from './ButtonShapeRepresentation';
import { ButtonImportance } from './ButtonImportance';
import { MenuElementPlacementArea } from './MenuElementPlacementArea';
import { EventHandler } from './EventHandler';
import { ManagedFormButtonType } from './ManagedFormButtonType';
import { FormButtonPictureLocation } from './FormButtonPictureLocation';
import { ButtonRepresentation } from './ButtonRepresentation';
import { ButtonLocationInCommandBar } from './ButtonLocationInCommandBar';
import { RepresentationInContextMenu } from './RepresentationInContextMenu';

export interface Button extends DataItem {
  /** Тип кнопки */
  type?: ManagedFormButtonType;
  
  /** Имя команды */
  commandName?: string;
  
  /** Параметр */
  parameter?: any;
  
  /** Обработчики событий */
  handlers?: EventHandler[];
  
  /** Важность кнопки */
  buttonImportance?: ButtonImportance;
  
  /** Представление */
  representation?: ButtonRepresentation;
  
  /** Кнопка по умолчанию */
  defaultButton?: boolean;
  
  /** Только в Ещё */
  onlyInAllActions?: boolean;
  
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
  
  /** Горизонтальное выравнивание в группе */
  groupHorizontalAlign?: ItemHorizontalAlignment;
  
  /** Вертикальное выравнивание в группе */
  groupVerticalAlign?: ItemVerticalAlignment;
  
  /** Область размещения */
  placementArea?: MenuElementPlacementArea;
  
  /** Флажок */
  check?: boolean;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Цвет фона */
  backColor?: Color;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Картинка */
  picture?: Picture;
  
  /** Форма кнопки */
  shape?: ButtonShape;
  
  /** Представление формы кнопки */
  shapeRepresentation?: ButtonShapeRepresentation;
  
  /** Расположение картинки */
  pictureLocation?: FormButtonPictureLocation;
  
  /** Картинка фона */
  backPicture?: Picture;
  
  /** Эффект картинки фона */
  backPictureEffect?: string;
  
  /** Высота картинки */
  pictureHeight?: number;
  
  /** Выравнивание картинки и заголовка в карточке */
  cardPictureAndTitleAlign?: string;
  
  /** Расположение в командной панели */
  locationInCommandBar?: ButtonLocationInCommandBar;
  
  /** Представление в контекстном меню */
  representationInContextMenu?: RepresentationInContextMenu;
  
  /** Представление подсказки */
  toolTipRepresentation?: string;
  
  /** Уникальность команды */
  commandUniqueness?: boolean;
  
  /** Поведение при недоступности главного сервера */
  onMainServerUnavalableBehavior?: string;
  
  /** Показывать как карточку */
  showAsCard?: boolean;
  
  /** Внешнее имя */
  extName?: string;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
}
