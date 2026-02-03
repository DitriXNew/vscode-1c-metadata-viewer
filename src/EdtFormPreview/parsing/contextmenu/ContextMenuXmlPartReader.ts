/**
 * ContextMenuXmlPartReader - ридер для контекстного меню
 * Based on EDT readContextMenu method in FormChildItemsXmlPartReader
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { ContextMenu } from '../../model/ContextMenu';
import { FormItem } from '../../model/FormItem';

/**
 * Callback для чтения дочерних элементов
 */
type ChildItemsReader = (
    childItemsNode: XmlNode,
    context: XmlReaderContext,
    errorCollector: XmlReadErrorCollector
) => FormItem[];

/**
 * Ридер для контекстного меню
 */
export class ContextMenuXmlPartReader extends AbstractFormXmlPartReader {

    private childItemsReader: ChildItemsReader | undefined;

    /**
     * Устанавливает callback для рекурсивного чтения дочерних элементов
     */
    setChildItemsReader(reader: ChildItemsReader): void {
        this.childItemsReader = reader;
    }

    /**
     * Читает контекстное меню из родительского узла (ищет вложенный ContextMenu)
     * @param parentNode - родительский узел, содержащий подузел ContextMenu
     */
    readFromParent(
        parentNode: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): ContextMenu | undefined {
        const contextMenuNode = parentNode.get('ContextMenu');
        if (!contextMenuNode.exists()) {
            return undefined;
        }
        return this.read(contextMenuNode, context, errorCollector);
    }

    /**
     * Читает контекстное меню из узла ContextMenu напрямую
     * @param contextMenuNode - непосредственно узел ContextMenu
     */
    read(
        contextMenuNode: XmlNode,
        context: XmlReaderContext,
        errorCollector: XmlReadErrorCollector
    ): ContextMenu | undefined {
        if (!contextMenuNode.exists()) {
            return undefined;
        }

        const contextMenu: ContextMenu = {
            id: 0,
            name: ''
        };
        
        // Устанавливаем тип для идентификации
        (contextMenu as any).type = 'ContextMenu';

        // id
        const id = this.readId(contextMenuNode);
        if (id !== undefined) {
            contextMenu.id = id;
        }

        // name
        this.readNamedElement(contextMenuNode, contextMenu);

        // DisplayImportance
        contextMenu.displayImportance = this.readDisplayImportance(contextMenuNode);

        // Visible
        contextMenu.visible = this.readBoolean(contextMenuNode.get('Visible'));

        // UserVisible
        contextMenu.userVisible = this.readUserVisible(contextMenuNode.get('UserVisible'));

        // Enabled
        contextMenu.enabled = this.readBoolean(contextMenuNode.get('Enabled'));

        // ReadOnly
        contextMenu.readOnly = this.readBoolean(contextMenuNode.get('ReadOnly'));

        // EnableContentChange
        contextMenu.enableContentChange = this.readBoolean(contextMenuNode.get('EnableContentChange'));

        // Title
        contextMenu.title = this.readLocalizedString(contextMenuNode.get('Title'));

        // ToolTip
        contextMenu.toolTip = this.readLocalizedString(contextMenuNode.get('ToolTip'));

        // ToolTipRepresentation
        contextMenu.toolTipRepresentation = this.readEnum(contextMenuNode.get('ToolTipRepresentation'));

        // Shortcut
        contextMenu.shortcut = this.readString(contextMenuNode.get('Shortcut'));

        // Width
        contextMenu.width = this.readNumber(contextMenuNode.get('Width'));

        // Height
        contextMenu.height = this.readNumber(contextMenuNode.get('Height'));

        // GroupHorizontalAlign
        contextMenu.groupHorizontalAlign = this.readEnum(contextMenuNode.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        contextMenu.groupVerticalAlign = this.readEnum(contextMenuNode.get('GroupVerticalAlign'));

        // AutoFill (специфично для ContextMenu)
        contextMenu.autoFill = this.readBoolean(contextMenuNode.get('Autofill'));

        // ChildItems - рекурсивно читаем дочерние элементы
        const childItemsNode = contextMenuNode.get('ChildItems');
        if (childItemsNode.exists() && this.childItemsReader) {
            contextMenu.items = this.childItemsReader(childItemsNode, context, errorCollector);
        }

        return contextMenu;
    }
}
