/**
 * PictureDecorationExtInfo - расширенная информация для декорации картинки
 * @see com._1c.g5.v8.dt.form.model.PictureDecorationExtInfo
 */
import { DecorationExtInfo } from './DecorationExtInfo';
import { Color } from './Color';
import { Picture } from './Picture';
import { Border } from './Border';
import { PictureSize } from './PictureSize';
import { PictureBackgroundShowMode } from './PictureBackgroundShowMode';
import { FileDragMode } from './FileDragMode';
import { LocalizedString } from './LocalizedString';

export interface PictureDecorationExtInfo extends DecorationExtInfo {
  /** Картинка */
  picture?: Picture;
  
  /** Гиперссылка */
  hyperlink?: boolean;
  
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
  
  /** Текст невыбранной картинки */
  nonselectedPictureText?: LocalizedString | LocalizedString[] | string;
  
  /** Разрешить начало перетаскивания */
  enableStartDrag?: boolean;
  
  /** Разрешить перетаскивание */
  enableDrag?: boolean;
  
  /** Граница */
  border?: Border;
  
  /** Цвет границы */
  borderColor?: Color;
  
  /** Режим перетаскивания файла */
  fileDragMode?: FileDragMode;
}
