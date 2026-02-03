/**
 * Главный ридер файла формы - аналог FormXmlFileReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.FormXmlFileReader
 */

import { XMLParser } from 'fast-xml-parser';
import { XmlNode, FastXmlNode, EMPTY_NODE } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, SimpleErrorCollector } from './AbstractFormXmlPartReader';
import { Form } from '../model/Form';
import { FormAttributeXmlPartReader } from './FormAttributeXmlPartReader';
import { FormCommandXmlPartReader } from './FormCommandXmlPartReader';
import { FormParameterXmlPartReader } from './FormParameterXmlPartReader';
import { FormChildItemsXmlPartReader } from './FormChildItemsXmlPartReader';
import { AutoCommandBarXmlPartReader } from './AutoCommandBarXmlPartReader';

/**
 * Результат чтения формы
 */
export interface FormXmlReaderResult {
    form: Form;
    errors: string[];
    warnings: string[];
}

/**
 * Главный ридер формы
 */
export class FormXmlFileReader extends AbstractFormXmlPartReader {
    private readonly parser: XMLParser;
    private readonly attributeReader: FormAttributeXmlPartReader;
    private readonly commandReader: FormCommandXmlPartReader;
    private readonly parameterReader: FormParameterXmlPartReader;
    private readonly childItemsReader: FormChildItemsXmlPartReader;
    private readonly autoCommandBarReader: AutoCommandBarXmlPartReader;

    constructor() {
        super();
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            parseAttributeValue: false,
            parseTagValue: false,
            trimValues: true,
            isArray: (name) => {
                // Эти элементы всегда должны быть массивами
                return [
                    'Attribute', 'Column', 'AdditionalColumns',
                    'Command', 'Parameter', 'Handler', 'Event',
                    'Item', 'LocalizedString', 'Link',
                    'ExcludedCommand', 'Field'
                ].includes(name);
            }
        });

        this.attributeReader = new FormAttributeXmlPartReader();
        this.commandReader = new FormCommandXmlPartReader();
        this.parameterReader = new FormParameterXmlPartReader();
        this.childItemsReader = new FormChildItemsXmlPartReader();
        this.autoCommandBarReader = new AutoCommandBarXmlPartReader();
    }

    /**
     * Читает форму из XML строки
     */
    read(xmlContent: string, version: string = '8.3.24'): FormXmlReaderResult {
        const errorCollector = new SimpleErrorCollector();
        
        // Парсим XML
        let parsed: Record<string, unknown>;
        try {
            parsed = this.parser.parse(xmlContent) as Record<string, unknown>;
        } catch (e) {
            errorCollector.addError(`XML parsing error: ${e}`);
            return {
                form: this.createEmptyForm(),
                errors: errorCollector.errors,
                warnings: errorCollector.warnings
            };
        }

        // Получаем корневой узел Form
        const rootNode = new FastXmlNode(parsed);
        const formNode = rootNode.get('Form');
        
        if (!formNode.exists()) {
            errorCollector.addError('Root node <Form> not found');
            return {
                form: this.createEmptyForm(),
                errors: errorCollector.errors,
                warnings: errorCollector.warnings
            };
        }

        const context: XmlReaderContext = {
            version
        };

        const form = this.readForm(formNode, context, errorCollector);

        return {
            form,
            errors: errorCollector.errors,
            warnings: errorCollector.warnings
        };
    }

    /**
     * Читает содержимое формы
     */
    private readForm(node: XmlNode, context: XmlReaderContext, errorCollector: SimpleErrorCollector): Form {
        const form: Form = this.createEmptyForm();

        // Читаем атрибуты формы
        const attributesNode = node.get('Attributes');
        for (const attrNode of attributesNode.getAll('Attribute')) {
            const attr = this.attributeReader.read(attrNode, context, errorCollector);
            if (attr) {
                form.attributes!.push(attr);
            }
        }

        // Читаем команды формы
        const commandsNode = node.get('Commands');
        for (const cmdNode of commandsNode.getAll('Command')) {
            const cmd = this.commandReader.read(cmdNode, context, errorCollector);
            if (cmd) {
                form.formCommands!.push(cmd);
            }
        }

        // Читаем параметры формы
        const parametersNode = node.get('Parameters');
        for (const paramNode of parametersNode.getAll('Parameter')) {
            const param = this.parameterReader.read(paramNode, context, errorCollector);
            if (param) {
                form.parameters!.push(param);
            }
        }

        // Читаем свойства формы
        this.readFormProperties(node, form, context, errorCollector);

        // Читаем обработчики событий
        this.readEventHandlers(node.get('Events'), form, context, errorCollector);

        // Читаем дочерние элементы
        const childItemsNode = node.get('ChildItems');
        const items = this.childItemsReader.read(childItemsNode, context, errorCollector);
        form.items = items;

        // Читаем AutoCommandBar
        const autoCommandBarNode = node.get('AutoCommandBar');
        if (autoCommandBarNode.exists()) {
            const commandBar = this.autoCommandBarReader.read(autoCommandBarNode, context, errorCollector);
            if (commandBar) {
                form.commandBar = commandBar;
            }
        }

        return form;
    }

    /**
     * Читает свойства формы
     */
    private readFormProperties(node: XmlNode, form: Form, context: XmlReaderContext, _errorCollector: SimpleErrorCollector): void {
        // Title
        form.title = this.readLocalizedString(node.get('Title'));

        // Width, Height
        form.width = this.readNumber(node.get('Width'));
        form.height = this.readNumber(node.get('Height'));

        // WindowOpeningMode / WindowViewMode - зависит от версии
        if (this.versionIsAtLeast(context, '8.5.1')) {
            form.onFormWindowOpenLockMode = this.readEnum(node.get('WindowOpeningMode'));
            form.windowViewMode = this.readEnum(node.get('WindowViewMode'));
        } else {
            form.windowOpeningMode = this.readEnum(node.get('WindowOpeningMode'));
        }

        // EnterKeyBehavior
        form.enterKeyBehavior = this.readEnum(node.get('EnterKeyBehavior'));

        // AutoSaveDataInSettings
        form.autoSaveDataInSettings = this.readEnum(node.get('AutoSaveDataInSettings'));

        // SaveWindowSettings (8.3.22+)
        if (this.versionIsAtLeast(context, '8.3.22')) {
            form.saveWindowSettings = this.readBoolean(node.get('SaveWindowSettings'));
        }

        // SaveDataInSettings
        form.saveDataInSettings = this.readEnum(node.get('SaveDataInSettings'));

        // AutoTitle
        form.autoTitle = this.readBoolean(node.get('AutoTitle'));

        // AutoURL
        form.autoUrl = this.readBoolean(node.get('AutoURL'));

        // Group
        form.group = this.readEnum(node.get('Group'));

        // ChildrenAlign
        form.childrenAlign = this.readEnum(node.get('ChildrenAlign'));

        // HorizontalSpacing, VerticalSpacing
        form.horizontalSpacing = this.readEnum(node.get('HorizontalSpacing'));
        form.verticalSpacing = this.readEnum(node.get('VerticalSpacing'));

        // HorizontalAlign, VerticalAlign
        form.horizontalAlign = this.readEnum(node.get('HorizontalAlign'));
        form.verticalAlign = this.readEnum(node.get('VerticalAlign'));

        // ChildItemsTitleLocation (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            form.childItemsTitleLocation = this.readEnum(node.get('ChildItemsTitleLocation'));
        }

        // ChildItemsWidth
        form.childItemsWidth = this.readEnum(node.get('ChildItemsWidth'));

        // AutoFillCheck
        form.autoFillCheck = this.readBoolean(node.get('AutoFillCheck'));

        // Customizable (AllowFormCustomize)
        form.allowFormCustomize = this.readBoolean(node.get('Customizable'));

        // Enabled
        form.enabled = this.readBoolean(node.get('Enabled'));

        // CommandBarLocation
        form.commandBarLocation = this.readEnum(node.get('CommandBarLocation'));

        // ShowCommandBar (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            form.showCommandBar = this.readBoolean(node.get('ShowCommandBar'));
        }

        // VerticalScroll
        form.verticalScroll = this.readEnum(node.get('VerticalScroll'));

        // ScalingMode
        form.scalingMode = this.readEnum(node.get('ScalingMode'));

        // Scale
        form.scale = this.readNumber(node.get('Scale'));

        // ScaleVariant (8.5.1+)
        if (this.versionIsAtLeast(context, '8.5.1')) {
            form.scaleVariant = this.readEnum(node.get('ScaleVariant'));
            form.showTitle851 = this.readEnum(node.get('ShowTitle'));
        } else {
            form.showTitle = this.readBoolean(node.get('ShowTitle'));
        }

        // ShowCloseButton
        form.showCloseButton = this.readBoolean(node.get('ShowCloseButton'));

        // ConversationsRepresentation
        form.conversationsRepresentation = this.readEnum(node.get('ConversationsRepresentation'));

        // CollapseItemsByImportanceVariant
        form.collapseItemsByImportanceVariant = this.readEnum(node.get('CollapseItemsByImportanceVariant'));

        // CreateButtonsGroupTitle, CreateButtonsGroupPicture (8.3.12+)
        if (this.versionIsAtLeast(context, '8.3.12')) {
            form.createButtonsGroupTitle = this.readLocalizedString(node.get('CreateButtonsGroupTitle'));
            form.createButtonsGroupPicture = this.readPicture(node.get('CreateButtonsGroupPicture'));
        }
    }

    /**
     * Читает обработчики событий
     */
    private readEventHandlers(eventsNode: XmlNode, form: Form, _context: XmlReaderContext, _errorCollector: SimpleErrorCollector): void {
        if (!eventsNode.exists()) {
            return;
        }

        form.handlers = [];
        for (const eventNode of eventsNode.getAll('Event')) {
            const name = eventNode.attribute('name');
            const handler = eventNode.text();
            if (name && handler) {
                form.handlers.push({ event: name, name: handler });
            }
        }
    }

    /**
     * Создаёт пустую форму
     */
    private createEmptyForm(): Form {
        return {
            attributes: [],
            formCommands: [],
            parameters: [],
            items: [],
            handlers: []
        };
    }
}
