/**
 * AbstractDecorationXmlPartReader - базовый ридер декораций
 * @see com._1c.g5.v8.dt.form.import_.xml.reader.part.FormChildItemsXmlPartReader#readDecoration
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { Decoration } from '../../model/Decoration';
import { EventHandler } from '../../model/EventHandler';

/**
 * Базовый ридер для декораций (LabelDecoration, PictureDecoration)
 */
export abstract class AbstractDecorationXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает общие свойства декорации
     */
    protected readDecoration(node: XmlNode, context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): Decoration {
        const decoration: Decoration = {
            id: this.readId(node) ?? 0,
            name: node.attribute('name') ?? ''
        };

        // DisplayImportance
        decoration.displayImportance = this.readDisplayImportance(node);

        // Title
        decoration.title = this.readLocalizedString(node.get('Title'));
        
        // Formatted (attribute on Title)
        const formattedAttr = node.get('Title').attribute('formatted');
        if (formattedAttr) {
            decoration.formatted = formattedAttr.toLowerCase() === 'true';
        }

        // Visible
        decoration.visible = this.readBoolean(node.get('Visible'));
        decoration.enabled = this.readBoolean(node.get('Enabled'));
        decoration.userVisible = this.readUserVisible(node.get('UserVisible'));

        // Sizes
        decoration.width = this.readNumber(node.get('Width'));
        decoration.autoMaxWidth = this.readBoolean(node.get('AutoMaxWidth'));
        decoration.maxWidth = this.readNumber(node.get('MaxWidth'));
        decoration.minWidth = this.readNumber(node.get('MinWidth'));
        decoration.height = this.readNumber(node.get('Height'));
        decoration.autoMaxHeight = this.readBoolean(node.get('AutoMaxHeight'));
        decoration.maxHeight = this.readNumber(node.get('MaxHeight'));

        // Stretch
        decoration.horizontalStretch = this.readBoolean(node.get('HorizontalStretch'));
        decoration.verticalStretch = this.readBoolean(node.get('VerticalStretch'));

        // SkipOnInput
        decoration.skipOnInput = this.readBoolean(node.get('SkipOnInput'));

        // Text and font
        decoration.textColor = this.readColor(node.get('TextColor'));
        decoration.font = this.readFont(node.get('Font'));

        // Shortcut
        decoration.shortcut = node.get('Shortcut').text();

        // Group align
        decoration.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));
        decoration.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // Tooltip
        decoration.toolTip = this.readLocalizedString(node.get('ToolTip'));
        decoration.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));

        // 8.3.16+
        if (this.versionIsAtLeast(context, '8.3.16')) {
            (decoration as any).onMainServerUnavalableBehavior = node.get('OnMainServerUnavalableBehavior').text();
        }

        // TODO: readContextMenu
        // TODO: readExtendedTooltip

        return decoration;
    }

    /**
     * Читает обработчики событий
     */
    protected readEventHandlers(eventsNode: XmlNode): EventHandler[] | undefined {
        if (!eventsNode.exists()) {
            return undefined;
        }
        
        const handlers: EventHandler[] = [];
        const eventNodes = eventsNode.getAll('Event');
        
        for (const eventNode of eventNodes) {
            const name = eventNode.attribute('name');
            const event = eventNode.text();
            
            if (name) {
                handlers.push({ name, event: event || '' });
            }
        }
        
        return handlers.length > 0 ? handlers : undefined;
    }
}
