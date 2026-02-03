/**
 * Ридер для поля ввода (InputField)
 * По мотивам readInputField из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { AbstractFormFieldXmlPartReader } from './AbstractFormFieldXmlPartReader';
import { FormField } from '../../model/FormField';
import { InputFieldExtInfo } from '../../model/InputFieldExtInfo';

/**
 * Ридер для поля ввода
 */
export class InputFieldXmlPartReader extends AbstractFormFieldXmlPartReader {

    /**
     * Читает поле ввода из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormField {
        // Читаем базовые свойства FormField
        const field = this.readFormField(node, context, errorCollector);
        
        // Устанавливаем тип поля
        field.type = 'InputField';

        // Создаём и заполняем ExtInfo
        const extInfo: InputFieldExtInfo = {};
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

        // === Основные свойства ===
        extInfo.wrap = this.readBoolean(node.get('Wrap'));
        extInfo.passwordMode = this.readBoolean(node.get('PasswordMode'));
        extInfo.multiLine = this.readBoolean(node.get('MultiLine'));
        extInfo.extendedEdit = this.readBoolean(node.get('ExtendedEdit'));
        extInfo.markNegatives = this.readBoolean(node.get('MarkNegatives'));
        extInfo.dropListButton = this.readBoolean(node.get('DropListButton'));

        // === Multiple Values (8.3.23+) ===
        if (this.versionIsAtLeast(context, '8.3.23')) {
            extInfo.multipleValuesFont = this.readFont(node.get('MultipleValuesFont'));
            extInfo.multipleValuesHyperlink = this.readBoolean(node.get('MultipleValuesHyperlink'));
            extInfo.multipleValuesTextColor = this.readColor(node.get('MultipleValuesTextColor'));
            extInfo.multipleValuesBackColor = this.readColor(node.get('MultipleValuesBackColor'));
            extInfo.allowInputEmptyMultipleValues = this.readBoolean(node.get('AllowInputEmptyMultipleValues'));
            extInfo.allowMultipleValuesDuplicates = this.readBoolean(node.get('AllowMultipleValuesDuplicates'));
            extInfo.extendedEditMultipleValues = this.readBoolean(node.get('ExtendedEditMultipleValues'));
            extInfo.multipleValuePictureSize = this.readEnum(node.get('MultipleValuePictureSize'));
            extInfo.multipleValuePictureShape = this.readEnum(node.get('MultipleValuePictureShape'));
            extInfo.showCheckBoxesInDropList = this.readBoolean(node.get('ShowCheckBoxesInDropList'));
            extInfo.multipleValuesPicture = this.readPicture(node.get('MultipleValuesPicture'));
            extInfo.multipleValueDataPath = this.readDataPath(node.get('MultipleValueDataPath'));
            extInfo.multipleValuePictureDataPath = this.readDataPath(node.get('MultipleValuePictureDataPath'));
            extInfo.multipleValuePresentDataPath = this.readDataPath(node.get('MultipleValuePresentDataPath'));
        }

        // === Кнопки ===
        extInfo.choiceButton = this.readBoolean(node.get('ChoiceButton'));
        extInfo.choiceButtonRepresentation = this.readEnum(node.get('ChoiceButtonRepresentation'));
        extInfo.choiceButtonPicture = this.readPicture(node.get('ChoiceButtonPicture'));
        extInfo.clearButton = this.readBoolean(node.get('ClearButton'));
        extInfo.spinButton = this.readBoolean(node.get('SpinButton'));
        extInfo.openButton = this.readBoolean(node.get('OpenButton'));
        extInfo.createButton = this.readBoolean(node.get('CreateButton'));

        // === Редактирование ===
        extInfo.mask = this.readString(node.get('Mask'));
        extInfo.autoChoiceIncomplete = this.readEnum(node.get('AutoChoiceIncomplete'));
        extInfo.quickChoice = this.readEnum(node.get('QuickChoice'));
        extInfo.choiceFoldersAndItems = this.readEnum(node.get('ChoiceFoldersAndItems'));
        extInfo.format = this.readString(node.get('Format'));
        extInfo.editFormat = this.readString(node.get('EditFormat'));
        extInfo.autoMarkIncomplete = this.readEnum(node.get('AutoMarkIncomplete'));
        extInfo.chooseType = this.readBoolean(node.get('ChooseType'));
        extInfo.incompleteChoiceMode = this.readEnum(node.get('IncompleteChoiceMode'));
        extInfo.typeDomainEnabled = this.readBoolean(node.get('TypeDomainEnabled'));
        extInfo.textEdit = this.readBoolean(node.get('TextEdit'));
        extInfo.editTextUpdate = this.readEnum(node.get('EditTextUpdate'));

        // === Ограничения ===
        extInfo.minValue = this.readValue(node.get('MinValue'));
        extInfo.maxValue = this.readValue(node.get('MaxValue'));

        // === Выбор ===
        extInfo.choiceForm = this.readString(node.get('ChoiceForm'));

        // ChoiceParameterLinks/Link
        const choiceParameterLinks = node.get('ChoiceParameterLinks').getAll('Link');
        if (choiceParameterLinks.length > 0) {
            extInfo.choiceParameterLinks = choiceParameterLinks.map(link => this.readChoiceParameterLink(link));
        }

        // ChoiceParameters
        extInfo.choiceParameters = this.readChoiceParameters(node.get('ChoiceParameters'));

        // AvailableTypes
        extInfo.availableTypes = this.readTypeDescription(node.get('AvailableTypes'));

        // ListChoiceMode
        extInfo.listChoiceMode = this.readBoolean(node.get('ListChoiceMode'));

        // ChoiceList/Item/Value
        const choiceListItems = node.get('ChoiceList').getAll('Item');
        if (choiceListItems.length > 0) {
            extInfo.choiceList = choiceListItems.map(item => this.readValue(item.get('Value')));
        }

        extInfo.choiceListButton = this.readBoolean(node.get('ChoiceListButton'));
        extInfo.choiceListHeight = this.readNumber(node.get('ChoiceListHeight'));
        extInfo.dropListWidth = this.readNumber(node.get('DropListWidth'));

        // === Оформление ===
        extInfo.textColor = this.readColor(node.get('TextColor'));
        extInfo.backColor = this.readColor(node.get('BackColor'));
        extInfo.borderColor = this.readColor(node.get('BorderColor'));
        extInfo.font = this.readFont(node.get('Font'));

        // TypeLink
        extInfo.typeLink = this.readDataPath(node.get('TypeLink'));

        // === 8.3.9+ ===
        if (this.versionIsAtLeast(context, '8.3.9')) {
            extInfo.heightControlVariant = this.readEnum(node.get('HeightControlVariant'));
            extInfo.autoShowClearButtonMode = this.readEnum(node.get('AutoShowClearButtonMode'));
            extInfo.autoShowOpenButtonMode = this.readEnum(node.get('AutoShowOpenButtonMode'));
            extInfo.autoCorrectionOnTextInput = this.readEnum(node.get('AutoCorrectionOnTextInput'));
            extInfo.spellCheckingOnTextInput = this.readEnum(node.get('SpellCheckingOnTextInput'));
            extInfo.autoCapitalizationOnTextInput = this.readEnum(node.get('AutoCapitalizationOnTextInput'));
            extInfo.specialTextInputMode = this.readEnum(node.get('SpecialTextInputMode'));
            extInfo.onScreenKeyboardReturnKeyText = this.readEnum(node.get('OnScreenKeyboardReturnKeyText'));
        }

        // InputHint
        extInfo.inputHint = this.readLocalizedString(node.get('InputHint'));

        // ChoiceHistoryOnInput
        extInfo.choiceHistoryOnInput = this.readEnum(node.get('ChoiceHistoryOnInput'));

        // AutofillHint
        extInfo.autofillHint = this.readEnum(node.get('AutofillHint'));

        // === 8.5.1+ ===
        if (this.versionIsAtLeast(context, '8.5.1')) {
            extInfo.choiceButtonTitle = this.readLocalizedString(node.get('ChoiceButtonTitle'));
            extInfo.timeChoiceMode = this.readEnum(node.get('TimeChoiceMode'));
            extInfo.picture = this.readPicture(node.get('Picture'));
            extInfo.dropListHint = this.readLocalizedString(node.get('DropListHint'));
            extInfo.textSize = this.readEnum(node.get('TextSize'));
        }

        // Читаем обработчики событий
        this.readEventHandlers(node, field, context, errorCollector);

        return field;
    }

    /**
     * Читает ChoiceParameterLink
     */
    private readChoiceParameterLink(node: XmlNode): unknown {
        return {
            name: node.attribute('name'),
            dataPath: this.readDataPath(node.get('DataPath'))
        };
    }

    /**
     * Читает ChoiceParameters
     */
    private readChoiceParameters(node: XmlNode): any[] | undefined {
        if (!node.exists()) {
            return undefined;
        }
        // TODO: полная реализация
        return undefined;
    }

    /**
     * Читает описание типа
     */
    private readTypeDescription(node: XmlNode): unknown {
        if (!node.exists()) {
            return undefined;
        }
        
        const types: string[] = [];
        for (const typeNode of node.getAll('Type')) {
            const typeName = typeNode.text();
            if (typeName) {
                types.push(typeName);
            }
        }

        if (types.length === 0) {
            return undefined;
        }

        return { types };
    }
}
