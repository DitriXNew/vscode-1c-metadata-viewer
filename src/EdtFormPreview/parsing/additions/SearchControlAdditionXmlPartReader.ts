/**
 * Ридер для дополнения элемента управления поиском SearchControlAddition
 * По мотивам readSearchControlAddition из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractAdditionXmlPartReader } from './AbstractAdditionXmlPartReader';
import { Addition } from '../../model/Addition';
import { SearchControlAdditionExtInfo } from '../../model/SearchControlAdditionExtInfo';

/**
 * Ридер для дополнения элемента управления поиском
 */
export class SearchControlAdditionXmlPartReader extends AbstractAdditionXmlPartReader {

    /**
     * Читает SearchControlAddition из XML
     */
    read(
        node: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): Addition {
        // Читаем базовые свойства Addition
        const addition = this.readAddition(node, context, errorCollector);
        addition.type = 'SearchControl';

        // Создаем ExtInfo
        const extInfo: SearchControlAdditionExtInfo = {};

        // Размеры
        extInfo.width = this.readNumber(node.get('Width'));
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));

        // Растягивание
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

        // Цвета
        extInfo.backColor = this.readColor(node.get('BackColor'));
        extInfo.textColor = this.readColor(node.get('TextColor'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // Шрифт
        extInfo.font = this.readFont(node.get('Font'));

        addition.extInfo = extInfo;

        return addition;
    }
}
