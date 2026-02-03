/**
 * ImageFieldExtInfo - расширенная информация для поля картинки
 * @see com._1c.g5.v8.dt.form.model.ImageFieldExtInfo
 */
import { FieldExtInfo } from './FieldExtInfo';
import { Color, Font } from './TitleStyle';
import { Picture } from './PageGroupExtInfo';
import { Border } from './LabelFieldExtInfo';
import { LocalizedString } from './Titled';

export type PictureSize = 
  | 'Auto'
  | 'AutoSize'
  | 'Proportionally'
  | 'Stretch'
  | 'Tile'
  | 'RealSize';

export type PictureBackgroundShowMode = 
  | 'Auto'
  | 'Transparent'
  | 'LeftTopPixel';

export type FileDragMode = 
  | 'Auto'
  | 'AsFile'
  | 'AsFileRef';

export interface ImageFieldExtInfo extends FieldExtInfo {
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
  
  /** Размер картинки */
  pictureSize?: PictureSize;
  
  /** Режим отображения фона */
  backgroundShowMode?: PictureBackgroundShowMode;
  
  /** Цвет картинки */
  pictureColor?: Color;
  
  /** Масштабируемая */
  zoomable?: boolean;
  
  /** Масштаб изображения */
  imageScale?: number;
  
  /** Гиперссылка */
  hyperlink?: boolean;
  
  /** Текст невыбранной картинки */
  nonselectedPictureText?: LocalizedString | LocalizedString[] | string;
  
  /** Разрешить начало перетаскивания */
  enableStartDrag?: boolean;
  
  /** Разрешить перетаскивание */
  enableDrag?: boolean;
  
  /** Картинка значений */
  valuesPicture?: Picture;
  
  /** Цвет текста */
  textColor?: Color;
  
  /** Граница */
  border?: Border;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Шрифт */
  font?: Font;
  
  /** Режим перетаскивания файла */
  fileDragMode?: FileDragMode;
}
