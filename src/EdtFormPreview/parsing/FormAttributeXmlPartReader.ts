/**
 * Парсер атрибутов формы - аналог FormAttributeXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.FormAttributeXmlPartReader
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { FormAttribute, TypeDescription } from '../model/FormAttribute';
import { DynamicListExtInfo } from '../model/DynamicListExtInfo';
import { ValueListExtInfo } from '../model/ValueListExtInfo';
import { SpreadsheetDocumentExtInfo } from '../model/SpreadsheetDocumentExtInfo';

/**
 * Парсер атрибутов формы
 */
export class FormAttributeXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает атрибут формы из XML узла
     */
    read(node: XmlNode, context: XmlReaderContext, errorCollector: XmlReadErrorCollector): FormAttribute | undefined {
        const attribute: FormAttribute = {
            id: 0,
            name: ''
        };

        // Читаем базовые свойства AbstractFormAttribute
        this.readAbstractFormAttribute(node, attribute, context, errorCollector);

        // MainAttribute
        attribute.main = this.readBoolean(node.get('MainAttribute'));

        // SavedData
        attribute.savedData = this.readBoolean(node.get('SavedData'));

        // UseAlways/Field
        const useAlwaysFields = node.get('UseAlways').getAll('Field');
        if (useAlwaysFields.length > 0) {
            attribute.notDefaultUseAlwaysAttributes = useAlwaysFields
                .map(f => f.text())
                .filter((t): t is string => t !== undefined);
        }

        // Save/Field
        const saveFields = node.get('Save').getAll('Field');
        if (saveFields.length > 0) {
            attribute.settingsSavedData = saveFields
                .map(f => f.text())
                .filter((t): t is string => t !== undefined);
        }

        // Columns/Column
        const columns = node.get('Columns').getAll('Column');
        if (columns.length > 0) {
            attribute.columns = columns.map(col => this.readAttributeColumn(col, context, errorCollector));
        }

        // Columns/AdditionalColumns
        const additionalColumns = node.get('Columns').getAll('AdditionalColumns');
        if (additionalColumns.length > 0) {
            attribute.additionalColumns = additionalColumns.map(col => this.readAttributeColumn(col, context, errorCollector));
        }

        // Settings (ExtInfo)
        this.readFormAttributeSettings(node, attribute, context, errorCollector);

        return attribute;
    }

    /**
     * Читает базовые свойства AbstractFormAttribute
     */
    private readAbstractFormAttribute(
        node: XmlNode, 
        attribute: FormAttribute, 
        _context: XmlReaderContext, 
        _errorCollector: XmlReadErrorCollector
    ): void {
        // id
        const id = this.readId(node);
        if (id !== undefined) {
            attribute.id = id;
        }

        // name
        const name = node.attribute('name');
        if (name) {
            attribute.name = name;
        }

        // Title
        attribute.title = this.readLocalizedString(node.get('Title'));

        // Type (ValueType)
        attribute.valueType = this.readTypeDescription(node.get('Type'));

        // View
        attribute.view = this.readEnum(node.get('View'));

        // Edit
        attribute.edit = this.readEnum(node.get('Edit'));

        // FunctionalOptions/Item
        const functionalOptions = node.get('FunctionalOptions').getAll('Item');
        if (functionalOptions.length > 0) {
            attribute.functionalOptions = functionalOptions
                .map(item => item.text())
                .filter((t): t is string => t !== undefined);
        }

        // FillCheck
        attribute.fillChecking = this.readEnum(node.get('FillCheck'));
    }

    /**
     * Читает колонку атрибута
     */
    private readAttributeColumn(
        node: XmlNode, 
        _context: XmlReaderContext, 
        _errorCollector: XmlReadErrorCollector
    ): FormAttribute {
        const column: FormAttribute = {
            id: 0,
            name: ''
        };

        // id
        const id = this.readId(node);
        if (id !== undefined) {
            column.id = id;
        }

        // name
        const name = node.attribute('name');
        if (name) {
            column.name = name;
        }

        // Title
        column.title = this.readLocalizedString(node.get('Title'));

        // Type
        column.valueType = this.readTypeDescription(node.get('Type'));

        return column;
    }

    /**
     * Читает настройки атрибута (ExtInfo)
     */
    private readFormAttributeSettings(
        node: XmlNode, 
        attribute: FormAttribute, 
        context: XmlReaderContext, 
        _errorCollector: XmlReadErrorCollector
    ): void {
        const attributeTypeName = this.getSingleTypeName(attribute.valueType);
        if (!attributeTypeName) {
            return;
        }

        const settingsNode = node.get('Settings');
        const settingsTypeName = this.getSettingTypeName(settingsNode);

        if (attributeTypeName === 'DynamicList') {
            const extInfo: DynamicListExtInfo = {};
            attribute.extInfo = extInfo;

            if (attributeTypeName === settingsTypeName) {
                extInfo.autoFillAvailableFields = this.readBoolean(settingsNode.get('AutoFillAvailableFields'));
                extInfo.customQuery = this.readBoolean(settingsNode.get('ManualQuery'));
                extInfo.dynamicDataRead = this.readBoolean(settingsNode.get('DynamicDataRead'));
                extInfo.mainTable = this.readString(settingsNode.get('MainTable'));
                extInfo.queryText = this.readString(settingsNode.get('QueryText'));
                extInfo.autoSaveUserSettings = this.readBoolean(settingsNode.get('AutoSaveUserSettings'));
                extInfo.getInvisibleFieldPresentations = this.readBoolean(settingsNode.get('GetInvisibleFieldPresentations'));

                // 8.3.12+
                if (this.versionIsAtLeast(context, '8.3.12')) {
                    extInfo.keyField = this.readString(settingsNode.get('KeyField'));
                }

                // 8.3.18+
                if (this.versionIsAtLeast(context, '8.3.18')) {
                    // Fields, CalculatedFields, Parameters - TODO
                }
            }
        } else if (attributeTypeName === 'ValueList') {
            const extInfo: ValueListExtInfo = {};
            attribute.extInfo = extInfo;

            if (settingsTypeName === 'TypeDescription') {
                extInfo.itemValueType = this.readTypeDescription(settingsNode);
            }
        } else if (attributeTypeName === 'SpreadsheetDocument') {
            const extInfo: SpreadsheetDocumentExtInfo = {};
            attribute.extInfo = extInfo;

            if (attributeTypeName === settingsTypeName) {
                // SpreadsheetData - TODO
            }
        }
        // Другие типы ExtInfo: ChartExtInfo, DendrogramExtInfo, etc. - добавить по необходимости
    }

    /**
     * Получает имя типа если атрибут имеет единственный тип
     */
    private getSingleTypeName(valueType: unknown): string | undefined {
        if (!valueType || typeof valueType !== 'object') {
            return undefined;
        }
        const vt = valueType as Record<string, unknown>;
        const types = vt['types'] as string[] | undefined;
        if (types && types.length === 1) {
            // Извлекаем последнюю часть пути типа
            const typePath = types[0];
            const segments = typePath.split('/');
            return segments[segments.length - 1];
        }
        return undefined;
    }

    /**
     * Получает тип настроек из атрибута xsi:type
     */
    private getSettingTypeName(settingsNode: XmlNode): string | undefined {
        const xsiType = settingsNode.attribute('xsi:type');
        if (!xsiType) {
            return undefined;
        }
        const segments = xsiType.split(':');
        return segments[segments.length - 1];
    }

    /**
     * Читает описание типа
     */
    private readTypeDescription(node: XmlNode): TypeDescription | undefined {
        if (!node.exists()) {
            return undefined;
        }
        
        // Простая реализация - возвращаем объект с типами
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
