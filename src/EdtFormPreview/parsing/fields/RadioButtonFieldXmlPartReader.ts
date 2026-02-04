/**
 * Ридер для поля переключателя (RadioButtonField)
 * По мотивам readRadioButtonField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from './AbstractFormFieldXmlPartReader';
import { FormField } from '../../model/FormField';
import { RadioButtonsFieldExtInfo } from '../../model/RadioButtonsFieldExtInfo';
import { FormChoiceListDesTimeValue } from '../../model/FormChoiceListDesTimeValue';

/**
 * Ридер для поля переключателя
 */
export class RadioButtonFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает поле переключателя из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        
        // Устанавливаем тип поля
        field.type = 'RadioButtonField';

        // Создаём и заполняем ExtInfo (RadioButtonsFieldExtInfo)
        const extInfo: RadioButtonsFieldExtInfo = {};
        field.extInfo = extInfo;

        // RadioButtonType (RadioButtonsType в модели)
        extInfo.radioButtonsType = this.readEnum(node.get('RadioButtonType'));

        // ItemWidth
        extInfo.itemWidth = this.readNumber(node.get('ItemWidth'));

        // ItemHeight
        extInfo.itemHeight = this.readNumber(node.get('ItemHeight'));

        // ItemTitleHeight
        extInfo.itemTitleHeight = this.readNumber(node.get('ItemTitleHeight'));

        // ColumnsCount
        extInfo.columnsCount = this.readNumber(node.get('ColumnsCount'));

        // EqualColumnsWidth (EqualElementsWidth в модели)
        extInfo.equalElementsWidth = this.readBoolean(node.get('EqualColumnsWidth'));

        // ChoiceList/Item/Value
        // Ищем элементы с разными namespace префиксами (xr:Item или Item)
        const choiceListNode = node.get('ChoiceList');
        let choiceListItems = choiceListNode.getAll('xr:Item');
        if (choiceListItems.length === 0) {
            choiceListItems = choiceListNode.getAll('Item');
        }
        if (choiceListItems.length > 0) {
            extInfo.choiceList = choiceListItems.map(item => this.readChoiceListItem(item));
        }

        // Font
        extInfo.font = this.readFont(node.get('Font'));

        // TextColor
        extInfo.textColor = this.readColor(node.get('TextColor'));

        // BackColor
        extInfo.backColor = this.readColor(node.get('BackColor'));

        // BorderColor
        extInfo.borderColor = this.readColor(node.get('BorderColor'));

        // 8.5.1+
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // TumblerRepresentation
            extInfo.tumblerRepresentation = this.readEnum(node.get('TumblerRepresentation'));

            // HorizontalStretch
            extInfo.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

            // Orientation
            extInfo.orientation = this.readEnum(node.get('Orientation'));
        }

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }

    /**
     * Читает элемент списка выбора
     * Структура XML: xr:Item/xr:Value[@xsi:type="FormChoiceListDesTimeValue"]/Presentation/v8:item/v8:content
     */
    private readChoiceListItem(node: XmlNode): FormChoiceListDesTimeValue {
        const item: FormChoiceListDesTimeValue = {
            presentation: {}
        };
        
        // Value содержит вложенный объект с Presentation и Value
        // xr:Value.Presentation.v8:item.v8:content - текст опции
        // xr:Value.Value - числовое значение
        const valueNode = node.get('xr:Value');
        if (valueNode.exists()) {
            // Presentation находится внутри xr:Value
            const presentationNode = valueNode.get('Presentation');
            if (presentationNode.exists()) {
                item.presentation = this.readLocalizedString(presentationNode) ?? {};
            }
            
            // Числовое значение в Value.Value
            const innerValueNode = valueNode.get('Value');
            if (innerValueNode.exists()) {
                item.value = innerValueNode.text();
            }
        } else {
            // Fallback для старого формата
            const presentationNode = node.get('Presentation');
            if (presentationNode.exists()) {
                item.presentation = this.readLocalizedString(presentationNode) ?? {};
            }
            item.value = this.readValue(node.get('Value'));
        }
        
        // Picture
        item.picture = this.readPicture(node.get('Picture'));
        
        return item;
    }
}
