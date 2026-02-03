/**
 * Абстрактный базовый парсер - аналог AbstractFormXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.AbstractFormXmlPartReader
 */

import { XmlNode } from './XmlNode';
import { LocalizedString } from '../model/LocalizedString';
import { NamedElement } from '../model/NamedElement';
import { Color } from '../model/Color';
import { Font } from '../model/Font';
import { Picture } from '../model/Picture';
import { Border } from '../model/Border';
import { DataPath } from '../model/DataPath';
import { UserVisible } from '../model/UserVisible';
import { DisplayImportance } from '../model';

/**
 * Контекст чтения - хранит информацию о версии и родительском объекте
 */
export interface XmlReaderContext {
    /**
     * Версия платформы
     */
    version: string;

    /**
     * Родительский объект (форма или другой контейнер)
     */
    parent?: unknown;
}

/**
 * Коллектор ошибок чтения
 */
export interface XmlReadErrorCollector {
    addError(message: string, node?: XmlNode): void;
    addWarning(message: string, node?: XmlNode): void;
}

/**
 * Простой коллектор ошибок - собирает в массив
 */
export class SimpleErrorCollector implements XmlReadErrorCollector {
    readonly errors: string[] = [];
    readonly warnings: string[] = [];

    addError(message: string, _node?: XmlNode): void {
        this.errors.push(message);
    }

    addWarning(message: string, _node?: XmlNode): void {
        this.warnings.push(message);
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }
}

/**
 * Абстрактный парсер XML части формы
 */
export abstract class AbstractFormXmlPartReader {
    
    /**
     * Читает имя из атрибута name
     */
    protected readNamedElement(node: XmlNode, element: NamedElement): void {
        const name = node.attribute('name');
        if (name) {
            element.name = name;
        }
    }

    /**
     * Читает строковое значение из текста узла
     */
    protected readString(node: XmlNode): string | undefined {
        return node.text();
    }

    /**
     * Читает булево значение
     */
    protected readBoolean(node: XmlNode): boolean | undefined {
        const text = node.text();
        if (text === undefined) {
            return undefined;
        }
        return text.toLowerCase() === 'true';
    }

    /**
     * Читает числовое значение
     */
    protected readNumber(node: XmlNode): number | undefined {
        const text = node.text();
        if (text === undefined) {
            return undefined;
        }
        const num = Number(text);
        return isNaN(num) ? undefined : num;
    }

    /**
     * Читает enum значение
     */
    protected readEnum<T extends string>(node: XmlNode, _enumType?: Record<string, string>): T | undefined {
        const text = node.text();
        if (text === undefined) {
            return undefined;
        }
        return text as T;
    }

    /**
     * Читает локализованную строку
     * Структура в XML:
     * <Title>
     *   <LocalizedString>
     *     <key>ru</key>
     *     <value>Заголовок</value>
     *   </LocalizedString>
     * </Title>
     */
    protected readLocalizedString(node: XmlNode): LocalizedString | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const result: LocalizedString = {};
        
        // Проверяем разные форматы
        const localizedStrings = node.getAll('LocalizedString');
        if (localizedStrings.length > 0) {
            for (const ls of localizedStrings) {
                const key = ls.get('key').text();
                const value = ls.get('value').text();
                if (key && value !== undefined) {
                    result[key] = value;
                }
            }
            return Object.keys(result).length > 0 ? result : undefined;
        }

        // Простой формат - прямой текст
        const text = node.text();
        if (text) {
            return { '': text };
        }

        return undefined;
    }

    /**
     * Читает id элемента
     */
    protected readId(node: XmlNode): number | undefined {
        const idStr = node.attribute('id');
        if (idStr === undefined) {
            return undefined;
        }
        const id = parseInt(idStr, 10);
        return isNaN(id) ? undefined : id;
    }

    /**
     * Читает DisplayImportance из атрибута
     */
    protected readDisplayImportance(node: XmlNode): DisplayImportance | undefined {
        const value = node.attribute('DisplayImportance');
        if (value === 'Auto' || value === 'VeryLow' || value === 'Low' || 
            value === 'High' || value === 'VeryHigh') {
            return value;
        }
        return undefined;
    }

    /**
     * Сравнение версий - проверяет что текущая версия >= указанной
     */
    protected versionIsAtLeast(context: XmlReaderContext, requiredVersion: string): boolean {
        return this.compareVersions(context.version, requiredVersion) >= 0;
    }

    /**
     * Сравнивает две версии. Возвращает:
     * -1 если v1 < v2
     *  0 если v1 == v2
     *  1 если v1 > v2
     */
    protected compareVersions(v1: string, v2: string): number {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const len = Math.max(parts1.length, parts2.length);
        
        for (let i = 0; i < len; i++) {
            const p1 = parts1[i] || 0;
            const p2 = parts2[i] || 0;
            if (p1 < p2) return -1;
            if (p1 > p2) return 1;
        }
        return 0;
    }

    /**
     * Читает UserVisible
     */
    protected readUserVisible(node: XmlNode): UserVisible | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const commonNode = node.get('Common');
        if (commonNode.exists()) {
            return {
                common: this.readBoolean(commonNode)
            };
        }

        const text = node.text();
        if (text) {
            return {
                common: text.toLowerCase() === 'true'
            };
        }

        return undefined;
    }

    /**
     * Читает цвет
     */
    protected readColor(node: XmlNode): Color | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const xsiType = node.attribute('xsi:type');
        if (xsiType === 'v8:Color' || xsiType === 'v8ui:Color') {
            return {
                red: this.readNumber(node.get('Red')) ?? 0,
                green: this.readNumber(node.get('Green')) ?? 0,
                blue: this.readNumber(node.get('Blue')) ?? 0
            };
        }

        // Ссылка на стандартный цвет
        if (xsiType) {
            return { compositeId: xsiType };
        }

        return undefined;
    }

    /**
     * Читает шрифт
     */
    protected readFont(node: XmlNode): Font | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const xsiType = node.attribute('xsi:type');
        if (xsiType === 'v8:Font' || xsiType === 'v8ui:Font') {
            return {
                faceName: this.readString(node.get('FaceName')),
                height: this.readNumber(node.get('Height')),
                bold: this.readBoolean(node.get('Bold')),
                italic: this.readBoolean(node.get('Italic')),
                underline: this.readBoolean(node.get('Underline')),
                strikeout: this.readBoolean(node.get('Strikeout'))
            };
        }

        // Ссылка на стандартный шрифт
        if (xsiType) {
            return { ref: xsiType };
        }

        return undefined;
    }

    /**
     * Читает картинку
     */
    protected readPicture(node: XmlNode): Picture | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const xsiType = node.attribute('xsi:type');
        const value = node.text();

        if (xsiType || value) {
            return {
                value: value
            };
        }

        return undefined;
    }

    /**
     * Читает Border (рамку)
     */
    protected readBorder(node: XmlNode): Border | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const xsiType = node.attribute('xsi:type');
        
        // BorderDef тип
        if (xsiType === 'v8:BorderDef') {
            return {
                style: this.readEnum(node.get('Style')) as Border['style'],
                width: this.readNumber(node.get('Width')),
                color: this.readColor(node.get('Color'))
            };
        }

        // Ссылка на стандартную рамку
        if (xsiType) {
            return { ref: xsiType };
        }

        return undefined;
    }

    /**
     * Читает DataPath
     */
    protected readDataPath(node: XmlNode): DataPath | undefined {
        if (!node.exists()) {
            return undefined;
        }

        const segments = node.text();
        if (!segments) {
            return undefined;
        }

        return { segments };
    }

    /**
     * Читает универсальное значение
     */
    protected readValue(node: XmlNode): unknown {
        if (!node.exists()) {
            return undefined;
        }

        const xsiType = node.attribute('xsi:type');
        const text = node.text();

        if (xsiType === 'xs:boolean' || xsiType === 'xsd:boolean') {
            return text?.toLowerCase() === 'true';
        }
        if (xsiType === 'xs:decimal' || xsiType === 'xsd:decimal' || 
            xsiType === 'xs:integer' || xsiType === 'xsd:integer') {
            return Number(text);
        }
        if (xsiType === 'xs:string' || xsiType === 'xsd:string') {
            return text;
        }

        return text;
    }
}
