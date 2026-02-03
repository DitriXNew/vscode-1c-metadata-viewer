/**
 * Ридер для поля картинки (PictureField)
 * По мотивам readPictureField из FormChildItemsXmlPartReader в EDT
 * 
 * Примечание: В XML тип называется PictureField, но в модели EDT используется ImageFieldExtInfo
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from './AbstractFormFieldXmlPartReader';
import { FormField } from '../../model/FormField';
import { ImageFieldExtInfo } from '../../model/ImageFieldExtInfo';
import { ManagedFormFieldType } from '../../model/ManagedFormFieldType';

/**
 * Ридер для поля картинки
 */
export class PictureFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает поле картинки из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        
        // Устанавливаем тип поля
        field.type = ManagedFormFieldType.PictureField;

        // Создаём и заполняем ExtInfo (ImageFieldExtInfo)
        const extInfo: ImageFieldExtInfo = {};
        field.extInfo = extInfo;

        // === Размеры ===
        extInfo.width = this.readNumber(node.get('Width'));
        extInfo.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        extInfo.maxWidth = this.readNumber(node.get('MaxWidth'));
        extInfo.minWidth = this.readNumber(node.get('MinWidth'));
        extInfo.height = this.readNumber(node.get('Height'));
        extInfo.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        extInfo.maxHeight = this.readNumber(node.get('MaxHeight'));
        extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        extInfo.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // === Отображение картинки ===
        extInfo.pictureSize = this.readEnum(node.get('PictureSize'));

        // 8.5.1+
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.backgroundShowMode = this.readEnum(node.get('BackgroundShowMode'));
            extInfo.pictureColor = this.readColor(node.get('PictureColor'));
        }

        // Zoomable
        extInfo.zoomable = this.readBoolean(node.get('Zoomable'));

        // ImageScale
        extInfo.imageScale = this.readNumber(node.get('ImageScale'));

        // Hyperlink
        extInfo.hyperlink = this.readBoolean(node.get('Hyperlink'));

        // NonselectedPictureText
        extInfo.nonselectedPictureText = this.readLocalizedString(node.get('NonselectedPictureText'));

        // EnableStartDrag
        extInfo.enableStartDrag = this.readBoolean(node.get('EnableStartDrag'));

        // EnableDrag
        extInfo.enableDrag = this.readBoolean(node.get('EnableDrag'));

        // ValuesPicture
        extInfo.valuesPicture = this.readPicture(node.get('ValuesPicture'));

        // Border
        extInfo.border = this.readBorder(node.get('Border'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // TextColor (для текста "Нет изображения")
        extInfo.textColor = this.readColor(node.get('TextColor'));

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }
}
