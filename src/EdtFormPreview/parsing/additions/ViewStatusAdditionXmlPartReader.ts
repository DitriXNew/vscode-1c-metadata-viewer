/**
 * Ридер для дополнения статуса просмотра ViewStatusAddition
 * По мотивам readViewStatusAddition из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractAdditionXmlPartReader } from './AbstractAdditionXmlPartReader';
import { Addition } from '../../model/Addition';
import { ViewStatusAdditionExtInfo } from '../../model/ViewStatusAdditionExtInfo';

/**
 * Ридер для дополнения статуса просмотра
 */
export class ViewStatusAdditionXmlPartReader extends AbstractAdditionXmlPartReader {

    /**
     * Читает ViewStatusAddition из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): Addition {
        // Читаем базовые свойства Addition
        const addition = this.readAddition(node, context, errorCollector);
        addition.type = 'ViewStatus';

        // Создаем ExtInfo
        const extInfo: ViewStatusAdditionExtInfo = {};

        // Размеры
        extInfo.width = this.readNumber(node.get('Width'));
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));

        // Растягивание
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

        // Положение
        extInfo.horizontalLocation = this.readEnum(node.get('HorizontalLocation'));

        // Цвета
        extInfo.backColor = this.readColor(node.get('BackColor'));
        extInfo.buttonColor = this.readColor(node.get('ButtonColor'));
        extInfo.textColor = this.readColor(node.get('TextColor'));
        extInfo.titleTextColor = this.readColor(node.get('TitleTextColor'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // Шрифты
        extInfo.font = this.readFont(node.get('Font'));
        extInfo.titleFont = this.readFont(node.get('TitleFont'));

        // Рамка
        extInfo.border = this.readBorder(node.get('Border'));

        addition.extInfo = extInfo;

        return addition;
    }
}
