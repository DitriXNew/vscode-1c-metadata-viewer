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
import { Color, Font } from './TitleStyle';
import { Picture } from './PageGroupExtInfo';
import { ExtendedTooltip } from './FormGroup';
import { ButtonRepresentation, ButtonShape, ButtonShapeRepresentation, ButtonImportance } from './PopupGroupExtInfo';
import { MenuElementPlacementArea } from './ButtonGroupExtInfo';
import { EventHandler } from './EventHandler';

export type ManagedFormButtonType = 
  | 'Usual'
  | 'CommandBarButton'
  | 'Hyperlink'
  | 'CommandBarHyperlink';

export type ButtonLocationInCommandBar = 
  | 'Auto'
  | 'InCommandBar'
  | 'InAdditionalSubmenu'
  | 'InCommandBarAndInAdditionalSubmenu';

export type FormButtonPictureLocation = 
  | 'Auto'
  | 'Left'
  | 'Right'
  | 'Top'
  | 'Bottom';

export type RepresentationInContextMenu = 
  | 'Auto'
  | 'Text'
  | 'Picture'
  | 'PictureAndText';

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
  
  /** Высота картинки */
  pictureHeight?: number;
  
  /** Расположение в командной панели */
  locationInCommandBar?: ButtonLocationInCommandBar;
  
  /** Представление в контекстном меню */
  representationInContextMenu?: RepresentationInContextMenu;
  
  /** Уникальность команды */
  commandUniqueness?: boolean;
  
  /** Показывать как карточку */
  showAsCard?: boolean;
  
  /** Расширенная подсказка */
  extendedTooltip?: ExtendedTooltip;
}
