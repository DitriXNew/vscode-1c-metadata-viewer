/**
 * Парсер автокомандной панели - аналог AutoCommandBarXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.AutoCommandBarXmlPartReader
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { AutoCommandBar } from '../model/AutoCommandBar';

/**
 * Парсер автокомандной панели
 */
export class AutoCommandBarXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает автокомандную панель из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): AutoCommandBar | undefined {
        const commandBar: AutoCommandBar = {
            name: 'AutoCommandBar',
            id: 0
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            commandBar.id = id;
        }

        // name
        const name = node.attribute('name');
        if (name && name.trim() !== '') {
            commandBar.name = name;
        }

        // DisplayImportance
        commandBar.displayImportance = this.readDisplayImportance(node);

        // Visible
        commandBar.visible = this.readBoolean(node.get('Visible'));

        // UserVisible
        commandBar.userVisible = this.readUserVisible(node.get('UserVisible'));

        // Enabled
        commandBar.enabled = this.readBoolean(node.get('Enabled'));

        // ReadOnly
        commandBar.readOnly = this.readBoolean(node.get('ReadOnly'));

        // EnableContentChange
        commandBar.enableContentChange = this.readBoolean(node.get('EnableContentChange'));

        // Title
        commandBar.title = this.readLocalizedString(node.get('Title'));

        // TitleTextColor
        commandBar.titleTextColor = this.readColor(node.get('TitleTextColor'));

        // TitleFont
        commandBar.titleFont = this.readFont(node.get('TitleFont'));

        // ToolTip
        commandBar.toolTip = this.readLocalizedString(node.get('ToolTip'));

        // ToolTipRepresentation
        commandBar.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));

        // Shortcut
        commandBar.shortcut = this.readString(node.get('Shortcut'));

        // Width
        commandBar.width = this.readNumber(node.get('Width'));

        // Height
        commandBar.height = this.readNumber(node.get('Height'));

        // HorizontalStretch
        commandBar.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));

        // VerticalStretch
        commandBar.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // GroupHorizontalAlign
        commandBar.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        commandBar.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // HorizontalAlign
        commandBar.horizontalAlign = this.readEnum(node.get('HorizontalAlign'));

        // AppearanceMode (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            commandBar.appearanceMode = this.readEnum(node.get('AppearanceMode'));
        }

        // Autofill
        commandBar.autoFill = this.readBoolean(node.get('Autofill'));

        // ChildItems - дочерние элементы будут парситься отдельно
        // TODO: интеграция с FormChildItemsXmlPartReader

        return commandBar;
    }
}
