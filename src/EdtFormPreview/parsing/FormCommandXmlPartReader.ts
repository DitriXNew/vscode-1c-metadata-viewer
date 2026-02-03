/**
 * Парсер команд формы - аналог FormCommandXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.FormCommandXmlPartReader
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { FormCommand } from '../model/FormCommand';

/**
 * Парсер команд формы
 */
export class FormCommandXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает команду формы из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): FormCommand | undefined {
        const command: FormCommand = {
            id: 0,
            name: ''
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            command.id = id;
        }

        // name
        const name = node.attribute('name');
        if (name) {
            command.name = name;
        }

        // Title
        command.title = this.readLocalizedString(node.get('Title'));

        // ToolTip
        command.toolTip = this.readLocalizedString(node.get('ToolTip'));

        // Use
        command.use = this.readEnum(node.get('Use'));

        // Shortcut
        command.shortcut = this.readString(node.get('Shortcut'));

        // Picture
        command.picture = this.readPicture(node.get('Picture'));

        // Action
        command.action = this.readString(node.get('Action'));

        // FunctionalOptions/Item
        const functionalOptions = node.get('FunctionalOptions').getAll('Item');
        if (functionalOptions.length > 0) {
            command.functionalOptions = functionalOptions
                .map(item => item.text())
                .filter((t): t is string => t !== undefined);
        }

        // Representation
        command.representation = this.readEnum(node.get('Representation'));

        // ModifiesSavedData (ModifiesStoredData)
        command.modifiesStoredData = this.readBoolean(node.get('ModifiesSavedData'));

        // CurrentRowUse
        command.currentRowUse = this.readEnum(node.get('CurrentRowUse'));

        // AssociatedTableElementId - зависит от версии
        if (!this.versionIsAtLeast(context, '8.3.15')) {
            command.associatedTableElementId = this.readNumber(node.get('AssociatedTableElementId'));
        } else {
            const associatedId = this.readString(node.get('AssociatedTableElementId'));
            if (associatedId) {
                command.associatedTableElementId8315 = associatedId;
            }
        }

        // 8.3.27+
        if (this.versionIsAtLeast(context, '8.3.27')) {
            command.actionPurpose = this.readEnum(node.get('ActionPurpose'));
            command.selectedRowsUse = this.readEnum(node.get('SelectedRowsUse'));
        }

        return command;
    }

}
