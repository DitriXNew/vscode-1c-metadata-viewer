/**
 * Интерфейс для работы с XML нодой - аналог IXmlNode в EDT
 * По мотивам com._1c.g5.v8.dt.import_.xml.reader.IXmlNode
 */

export interface XmlNode {
    /**
     * Имя текущего узла
     */
    readonly name: string;

    /**
     * Текстовое содержимое узла
     */
    text(): string | undefined;

    /**
     * Получить значение атрибута
     */
    attribute(name: string): string | undefined;

    /**
     * Получить дочерний узел по имени
     * Если узел не найден - возвращает пустой узел
     */
    get(name: string): XmlNode;

    /**
     * Получить все дочерние узлы с указанным именем
     */
    getAll(name: string): XmlNode[];

    /**
     * Проверить существует ли узел
     */
    exists(): boolean;

    /**
     * Получить все дочерние узлы (для итерации)
     */
    children(): XmlNode[];
}

/**
 * Пустой узел - возвращается когда узел не найден
 */
class EmptyXmlNode implements XmlNode {
    readonly name = '';

    text(): string | undefined {
        return undefined;
    }

    attribute(_name: string): string | undefined {
        return undefined;
    }

    get(_name: string): XmlNode {
        return EMPTY_NODE;
    }

    getAll(_name: string): XmlNode[] {
        return [];
    }

    exists(): boolean {
        return false;
    }

    children(): XmlNode[] {
        return [];
    }
}

export const EMPTY_NODE: XmlNode = new EmptyXmlNode();

/**
 * Реализация XmlNode для работы с fast-xml-parser результатом
 */
export class FastXmlNode implements XmlNode {
    private readonly data: Record<string, unknown>;
    readonly name: string;

    constructor(data: Record<string, unknown>, name: string = '') {
        this.data = data ?? {};
        this.name = name;
    }

    text(): string | undefined {
        // fast-xml-parser может положить текст в #text или напрямую
        const textValue = this.data['#text'];
        if (textValue !== undefined) {
            return String(textValue);
        }
        // Если узел содержит только текст, data будет строкой
        if (typeof this.data === 'string') {
            return this.data;
        }
        return undefined;
    }

    attribute(name: string): string | undefined {
        // fast-xml-parser кладёт атрибуты с префиксом @_ 
        const attrKey = `@_${name}`;
        const value = this.data[attrKey];
        if (value !== undefined) {
            return String(value);
        }
        return undefined;
    }

    get(childName: string): XmlNode {
        const child = this.data[childName];
        if (child === undefined || child === null) {
            return EMPTY_NODE;
        }
        // Если дочерний элемент массив - берём первый
        if (Array.isArray(child)) {
            if (child.length === 0) {
                return EMPTY_NODE;
            }
            const first = child[0];
            if (typeof first === 'object' && first !== null) {
                return new FastXmlNode(first as Record<string, unknown>, childName);
            }
            // Если это примитив - оборачиваем
            return new FastXmlNode({ '#text': first }, childName);
        }
        // Если это объект
        if (typeof child === 'object') {
            return new FastXmlNode(child as Record<string, unknown>, childName);
        }
        // Если это примитив (строка, число) - оборачиваем
        return new FastXmlNode({ '#text': child }, childName);
    }

    getAll(childName: string): XmlNode[] {
        const child = this.data[childName];
        if (child === undefined || child === null) {
            return [];
        }
        if (Array.isArray(child)) {
            return child.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return new FastXmlNode(item as Record<string, unknown>, childName);
                }
                return new FastXmlNode({ '#text': item }, childName);
            });
        }
        // Одиночный элемент
        if (typeof child === 'object') {
            return [new FastXmlNode(child as Record<string, unknown>, childName)];
        }
        return [new FastXmlNode({ '#text': child }, childName)];
    }

    exists(): boolean {
        return Object.keys(this.data).length > 0;
    }

    children(): XmlNode[] {
        const result: XmlNode[] = [];
        for (const [key, value] of Object.entries(this.data)) {
            // Пропускаем атрибуты и текст
            if (key.startsWith('@_') || key === '#text') {
                continue;
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    if (typeof item === 'object' && item !== null) {
                        result.push(new FastXmlNode(item as Record<string, unknown>, key));
                    } else {
                        result.push(new FastXmlNode({ '#text': item }, key));
                    }
                }
            } else if (typeof value === 'object' && value !== null) {
                result.push(new FastXmlNode(value as Record<string, unknown>, key));
            } else if (value !== undefined) {
                result.push(new FastXmlNode({ '#text': value }, key));
            }
        }
        return result;
    }
}
