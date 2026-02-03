/**
 * PictureDecorationXmlPartReader - ридер декорации-картинки
 * @see com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader#readPictureDecoration
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractDecorationXmlPartReader } from './AbstractDecorationXmlPartReader';
import { Decoration } from '../../model/Decoration';
import { PictureDecorationExtInfo } from '../../model/PictureDecorationExtInfo';

/**
 * Ридер для декорации-картинки
 */
export class PictureDecorationXmlPartReader extends AbstractDecorationXmlPartReader {

    /**
     * Читает PictureDecoration
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): Decoration {
        // Читаем общие свойства декорации
        const decoration = this.readDecoration(node, context, errorCollector);
        
        // Устанавливаем тип
        decoration.type = 'Picture';

        // Создаём ExtInfo
        const extInfo: PictureDecorationExtInfo = {};
        decoration.extInfo = extInfo;

        // Picture
        extInfo.picture = this.readPicture(node.get('Picture'));

        // PictureSize
        extInfo.pictureSize = this.readEnum(node.get('PictureSize'));

        // 8.5.1+
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.backgroundShowMode = this.readEnum(node.get('BackgroundShowMode'));
            extInfo.pictureColor = this.readColor(node.get('PictureColor'));
        }

        // Hyperlink
        extInfo.hyperlink = this.readBoolean(node.get('Hyperlink'));

        // Zoomable
        extInfo.zoomable = this.readBoolean(node.get('Zoomable'));

        // ImageScale
        extInfo.imageScale = this.readNumber(node.get('ImageScale'));

        // NonselectedPictureText
        extInfo.nonselectedPictureText = this.readLocalizedString(node.get('NonselectedPictureText'));

        // EnableStartDrag
        extInfo.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));

        // EnableDrag
        extInfo.enableDrag = this.readBoolean(node.get('EnableDrag'));

        // Border
        extInfo.border = this.readBorder(node.get('Border'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // 8.3.13+
        if (this.versionIsAtLeast(context, '8.3.13')) {
            extInfo.fileDragMode = this.readEnum(node.get('FileDragMode'));
        }

        // Обработчики событий записываются и в decoration, и в extInfo
        // Пока записываем только в decoration
        // TODO: возможно нужно записывать в оба места

        return decoration;
    }
}
