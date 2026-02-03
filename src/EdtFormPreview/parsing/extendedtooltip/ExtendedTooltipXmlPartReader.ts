/**
 * ExtendedTooltipXmlPartReader - ридер расширенной подсказки
 * Based on EDT readExtendedTooltip method in FormChildItemsXmlPartReader
 * 
 * ExtendedTooltip наследует от Decoration и имеет тип Label
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { ExtendedTooltip } from '../../model/ExtendedTooltip';
import { LabelDecorationExtInfo } from '../../model/LabelDecorationExtInfo';

/**
 * Ридер для расширенной подсказки
 */
export class ExtendedTooltipXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает расширенную подсказку из родительского узла (ищет вложенный ExtendedTooltip)
     * @param parentNode - родительский узел, содержащий подузел ExtendedTooltip
     */
    readFromParent(
        parentNode: XmlNode,
        _context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): ExtendedTooltip | undefined {
        const etNode = parentNode.get('ExtendedTooltip');
        if (!etNode.exists()) {
            return undefined;
        }
        return this.read(etNode, _context, _errorCollector);
    }

    /**
     * Читает расширенную подсказку из узла ExtendedTooltip напрямую
     * @param etNode - непосредственно узел ExtendedTooltip
     */
    read(
        etNode: XmlNode,
        _context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): ExtendedTooltip | undefined {
        if (!etNode.exists()) {
            return undefined;
        }

        const extendedTooltip: ExtendedTooltip = {
            id: 0,
            name: '',
            type: 'Label' // ExtendedTooltip всегда имеет тип Label
        };

        // ===== Базовые свойства FormItem =====
        
        // id
        const id = this.readId(etNode);
        if (id !== undefined) {
            extendedTooltip.id = id;
        }

        // name
        this.readNamedElement(etNode, extendedTooltip);

        // DisplayImportance
        extendedTooltip.displayImportance = this.readDisplayImportance(etNode);

        // ===== Свойства Visible =====
        
        // Visible
        extendedTooltip.visible = this.readBoolean(etNode.get('Visible'));

        // UserVisible
        extendedTooltip.userVisible = this.readUserVisible(etNode.get('UserVisible'));

        // Enabled
        extendedTooltip.enabled = this.readBoolean(etNode.get('Enabled'));

        // ===== Свойства Titled =====
        
        // Title
        extendedTooltip.title = this.readLocalizedString(etNode.get('Title'));

        // ===== Свойства TooltipContainer =====
        
        // ToolTip
        extendedTooltip.toolTip = this.readLocalizedString(etNode.get('ToolTip'));

        // ToolTipRepresentation
        extendedTooltip.toolTipRepresentation = this.readEnum(etNode.get('ToolTipRepresentation'));

        // ===== Свойства Decoration =====
        
        // Formatted
        extendedTooltip.formatted = this.readBoolean(etNode.get('Formatted'));

        // Width
        extendedTooltip.width = this.readNumber(etNode.get('Width'));

        // AutoMaxWidth
        extendedTooltip.autoMaxWidth = this.readBoolean(etNode.get('AutoMaxWidth'));

        // MaxWidth
        extendedTooltip.maxWidth = this.readNumber(etNode.get('MaxWidth'));

        // MinWidth
        extendedTooltip.minWidth = this.readNumber(etNode.get('MinWidth'));

        // Height
        extendedTooltip.height = this.readNumber(etNode.get('Height'));

        // AutoMaxHeight
        extendedTooltip.autoMaxHeight = this.readBoolean(etNode.get('AutoMaxHeight'));

        // MaxHeight
        extendedTooltip.maxHeight = this.readNumber(etNode.get('MaxHeight'));

        // HorizontalStretch
        extendedTooltip.horizontalStretch = this.readBoolean(etNode.get('HorizontalStretch'));

        // VerticalStretch
        extendedTooltip.verticalStretch = this.readBoolean(etNode.get('VerticalStretch'));

        // SkipOnInput
        extendedTooltip.skipOnInput = this.readBoolean(etNode.get('SkipOnInput'));

        // GroupHorizontalAlign
        extendedTooltip.groupHorizontalAlign = this.readEnum(etNode.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        extendedTooltip.groupVerticalAlign = this.readEnum(etNode.get('GroupVerticalAlign'));

        // ===== LabelDecorationExtInfo (специфичные свойства) =====
        
        const extInfo: LabelDecorationExtInfo = {};
        extendedTooltip.extInfo = extInfo;

        // Hyperlink
        extInfo.hyperlink = this.readBoolean(etNode.get('Hyperlink'));

        // HorizontalAlign
        extInfo.horizontalAlign = this.readEnum(etNode.get('HorizontalAlign'));

        // VerticalAlign
        extInfo.verticalAlign = this.readEnum(etNode.get('VerticalAlign'));

        // TitleHeight
        extInfo.titleHeight = this.readNumber(etNode.get('TitleHeight'));

        // BackColor
        extInfo.backColor = this.readColor(etNode.get('BackColor'));

        // BorderColor
        extInfo.borderColor = this.readColor(etNode.get('BorderColor'));

        // Border
        extInfo.border = this.readBorder(etNode.get('Border'));

        // Note: Event handlers are read into extInfo.handlers
        // but we need readEventHandlers method in base class first
        // TODO: Implement event handlers parsing when needed

        return extendedTooltip;
    }
}
