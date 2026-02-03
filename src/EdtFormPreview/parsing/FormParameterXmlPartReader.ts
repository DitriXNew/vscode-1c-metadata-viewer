/**
 * Парсер параметров формы - аналог FormParameterXmlPartReader в EDT
 * По мотивам com._1c.g5.v8.dt.form.import_.xml.reader.part.FormParameterXmlPartReader
 */

import { XmlNode } from './XmlNode';
import { AbstractFormXmlPartReader, XmlReaderContext, XmlReadErrorCollector } from './AbstractFormXmlPartReader';
import { FormParameter } from '../model/FormParameter';
import { TypeDescription } from '../model/FormAttribute';

/**
 * Парсер параметров формы
 */
export class FormParameterXmlPartReader extends AbstractFormXmlPartReader {

    /**
     * Читает параметр формы из XML узла
     */
    read(node: XmlNode, _context: XmlReaderContext, _errorCollector: XmlReadErrorCollector): FormParameter | undefined {
        const parameter: FormParameter = {
            name: ''
        };

        // name
        const name = node.attribute('name');
        if (name) {
            parameter.name = name;
        }

        // Type (ValueType)
        parameter.valueType = this.readTypeDescription(node.get('Type'));

        // KeyParameter
        parameter.keyParameter = this.readBoolean(node.get('KeyParameter'));

        return parameter;
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
