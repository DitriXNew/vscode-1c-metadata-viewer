/**
 * LabelDecorationXmlPartReader - ридер декорации-надписи
 * @see com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader#readLabelDecoration
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractDecorationXmlPartReader } from './AbstractDecorationXmlPartReader';
import { Decoration } from '../../model/Decoration';
import { LabelDecorationExtInfo } from '../../model/LabelDecorationExtInfo';

/**
 * Ридер для декорации-надписи
 */
export class LabelDecorationXmlPartReader extends AbstractDecorationXmlPartReader {

    /**
     * Читает LabelDecoration
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): Decoration {
        // Читаем общие свойства декорации
        const decoration = this.readDecoration(node, context, errorCollector);
        
        // Устанавливаем тип
        decoration.type = 'Label';

        // Создаём ExtInfo
        const extInfo: LabelDecorationExtInfo = {};
        decoration.extInfo = extInfo;

        // Hyperlink
        extInfo.hyperlink = this.readBoolean(node.get('Hyperlink'));

        // HorizontalAlign
        extInfo.horizontalAlign = this.readEnum(node.get('HorizontalAlign'));

        // VerticalAlign
        extInfo.verticalAlign = this.readEnum(node.get('VerticalAlign'));

        // TitleHeight
        extInfo.titleHeight = this.readNumber(node.get('TitleHeight'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // Border
        extInfo.border = this.readBorder(node.get('Border'));

        // Обработчики событий записываются и в decoration, и в extInfo
        // Пока записываем только в decoration
        // TODO: возможно нужно записывать в оба места

        return decoration;
    }
}
