/**
 * Базовый ридер для полей формы (FormField)
 * По мотивам readFormField из FormChildItemsXmlPartReader в EDT
 * 
 * Содержит общую логику чтения базовых свойств всех типов полей
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { FormField } from '../../model/FormField';

/**
 * Базовый ридер для всех типов полей формы
 */
export abstract class AbstractFormFieldXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает базовые свойства FormField
     * Аналог readFormField в EDT
     */
    protected readFormField(
        node: XmlNode,
        context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): FormField {
        const field: FormField = {
            id: 0,
            name: '',
            type: 'InputField'
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            field.id = id;
        }

        // name
        this.readNamedElement(node, field);

        // DisplayImportance
        field.displayImportance = this.readDisplayImportance(node);

        // DataPath
        field.dataPath = this.readDataPath(node.get('DataPath'));

        // Visible
        field.visible = this.readBoolean(node.get('Visible'));

        // UserVisible
        field.userVisible = this.readUserVisible(node.get('UserVisible'));

        // DefaultItem
        field.defaultItem = this.readBoolean(node.get('DefaultItem'));

        // Enabled
        field.enabled = this.readBoolean(node.get('Enabled'));

        // ReadOnly
        field.readOnly = this.readBoolean(node.get('ReadOnly'));

        // SkipOnInput
        field.skipOnInput = this.readBoolean(node.get('SkipOnInput'));

        // Title
        field.title = this.readLocalizedString(node.get('Title'));

        // TitleTextColor
        field.titleTextColor = this.readColor(node.get('TitleTextColor'));

        // TitleBackColor
        field.titleBackColor = this.readColor(node.get('TitleBackColor'));

        // TitleFont
        field.titleFont = this.readFont(node.get('TitleFont'));

        // TitleLocation
        field.titleLocation = this.readEnum(node.get('TitleLocation'));

        // TitleHeight
        field.titleHeight = this.readNumber(node.get('TitleHeight'));

        // ToolTip
        field.toolTip = this.readLocalizedString(node.get('ToolTip'));

        // ToolTipRepresentation
        field.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));

        // WarningOnEditRepresentation
        field.warningOnEditRepresentation = this.readEnum(node.get('WarningOnEditRepresentation'));

        // WarningOnEdit
        field.warningOnEdit = this.readLocalizedString(node.get('WarningOnEdit'));

        // Shortcut
        field.shortcut = this.readString(node.get('Shortcut'));

        // CommandSet/ExcludedCommand
        const excludedCommands = node.get('CommandSet').getAll('ExcludedCommand');
        if (excludedCommands.length > 0) {
            field.excludedCommands = excludedCommands
                .map(cmd => cmd.text())
                .filter((t): t is string => t !== undefined);
        }

        // HorizontalAlign
        field.horizontalAlign = this.readEnum(node.get('HorizontalAlign'));

        // VerticalAlign
        field.verticalAlign = this.readEnum(node.get('VerticalAlign'));

        // GroupHorizontalAlign
        field.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        field.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // EditMode
        field.editMode = this.readEnum(node.get('EditMode'));

        // FixingInTable
        field.fixingInTable = this.readEnum(node.get('FixingInTable'));

        // 8.5.1+ properties
        if (this.versionIsAtLeast(context, '8.5.1')) {
            // AutoEditMode - if set and EditMode is ENTER_ON_INPUT, change to AUTO
            const autoEditModeNode = node.get('AutoEditMode');
            if (autoEditModeNode.exists() && field.editMode === 'EnterOnInput') {
                field.editMode = 'Auto';
            }

            field.markRequiredComplete = this.readBoolean(node.get('MarkRequiredComplete'));
            field.appearanceInCard = this.readEnum(node.get('AppearanceInCard'));
            field.autoWidthInTable = this.readEnum(node.get('AutoWidthInTable'));
            field.cellMark = this.readEnum(node.get('CellMark'));
            field.fixInCard = this.readBoolean(node.get('FixInCard'));
            field.showInCard = this.readBoolean(node.get('ShowInCard'));
            field.showTitleInCard = this.readBoolean(node.get('ShowTitleInCard'));
            field.widthInCard = this.readEnum(node.get('WidthInCard'));
            field.cellHyperlinkRepresentation = this.readEnum(node.get('CellHyperlinkRepresentation'));
            field.cellHyperlinkDisplayVariant = this.readEnum(node.get('CellHyperlinkDisplayVariant'));
        }

        // CellHyperlink
        field.cellHyperlink = this.readBoolean(node.get('CellHyperlink'));

        // AutoCellHeight
        field.autoCellHeight = this.readBoolean(node.get('AutoCellHeight'));

        // ShowInHeader
        field.showInHeader = this.readBoolean(node.get('ShowInHeader'));

        // HeaderPicture
        field.headerPicture = this.readPicture(node.get('HeaderPicture'));

        // HeaderHorizontalAlign
        field.headerHorizontalAlign = this.readEnum(node.get('HeaderHorizontalAlign'));

        // ShowInFooter
        field.showInFooter = this.readBoolean(node.get('ShowInFooter'));

        // FooterText
        field.footerText = this.readLocalizedString(node.get('FooterText'));

        // FooterTextColor
        field.footerTextColor = this.readColor(node.get('FooterTextColor'));

        // FooterBackColor
        field.footerBackColor = this.readColor(node.get('FooterBackColor'));

        // FooterFont
        field.footerFont = this.readFont(node.get('FooterFont'));

        // FooterPicture
        field.footerPicture = this.readPicture(node.get('FooterPicture'));

        // FooterHorizontalAlign
        field.footerHorizontalAlign = this.readEnum(node.get('FooterHorizontalAlign'));

        return field;
    }

    /**
     * Читает обработчики событий для поля и его ExtInfo
     */
    protected readEventHandlers(
        node: XmlNode,
        field: FormField,
        _context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): void {
        const eventsNode = node.get('Events');
        if (!eventsNode.exists()) {
            return;
        }

        field.handlers = [];
        for (const eventNode of eventsNode.getAll('Event')) {
            const name = eventNode.attribute('name');
            const handler = eventNode.text();
            if (name && handler) {
                field.handlers.push({ event: name, name: handler });
            }
        }
    }
}
