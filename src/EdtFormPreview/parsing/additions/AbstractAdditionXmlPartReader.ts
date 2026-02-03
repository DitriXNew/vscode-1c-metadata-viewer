/**
 * Базовый ридер для дополнений Addition
 * По мотивам readAddition из FormChildItemsXmlPartReader в EDT
 */

import { XmlNode } from '../XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from '../AbstractFormXmlPartReader';
import { Addition } from '../../model/Addition';

/**
 * Базовый ридер для всех типов дополнений
 */
export abstract class AbstractAdditionXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает базовые свойства Addition
     * Аналог readAddition в EDT
     */
    protected readAddition(
        node: XmlNode,
        context: XmlReaderContext,
        _errorCollector: XmlReadErrorCollector
    ): Addition {
        const addition: Addition = {
            id: 0,
            name: ''
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            addition.id = id;
        }

        // name
        this.readNamedElement(node, addition);

        // DisplayImportance
        addition.displayImportance = this.readDisplayImportance(node);

        // AdditionSource
        const sourceNode = node.get('AdditionSource');
        if (sourceNode.exists()) {
            const itemNode = sourceNode.get('Item');
            if (itemNode.exists()) {
                addition.source = itemNode.text();
            }
            // Type читается отдельно в конкретных ридерах
        }

        // GroupHorizontalAlign
        addition.groupHorizontalAlign = this.readEnum(node.get('GroupHorizontalAlign'));

        // GroupVerticalAlign
        addition.groupVerticalAlign = this.readEnum(node.get('GroupVerticalAlign'));

        // Visible
        addition.visible = this.readBoolean(node.get('Visible'));

        // UserVisible
        const userVisibleNode = node.get('UserVisible');
        if (userVisibleNode.exists()) {
            // UserVisible имеет комплексную структуру, для простоты читаем как объект
            // В будущем можно расширить
        }

        // Enabled
        const enabledNode = node.get('Enabled');
        if (enabledNode.exists()) {
            const enabledText = enabledNode.text();
            if (enabledText === 'false') {
                addition.enabled = false;
            }
        }

        // Title
        addition.title = this.readLocalizedStringText(node.get('Title'));

        // ToolTip
        addition.toolTip = this.readLocalizedStringText(node.get('ToolTip'));

        // ToolTipRepresentation
        addition.toolTipRepresentation = this.readEnum(node.get('ToolTipRepresentation'));

        return addition;
    }

    /**
     * Читает локализованную строку и возвращает текст
     */
    protected readLocalizedStringText(node: XmlNode): string | undefined {
        if (!node.exists()) {
            return undefined;
        }
        const contentNode = node.get('v8:content');
        if (contentNode.exists()) {
            return contentNode.text();
        }
        return node.text();
    }
}
