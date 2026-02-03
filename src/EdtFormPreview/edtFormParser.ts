/**
 * Парсер EDT форм (.form файлы)
 * Преобразует XML формат EDT в типизированную структуру
 */

import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import {
  EdtForm,
  FormItem,
  FormField,
  FormGroup,
  FormTable,
  FormDecoration,
  FormButton,
  FormCommand,
  LocalizedString,
  DataPath,
  EventHandler,
  ParsedFormNode
} from './edtFormInterfaces';

export class EdtFormParser {
  private parser: XMLParser;

  constructor() {
    // Настраиваем парсер для корректной обработки EDT формата
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '$_',
      textNodeName: '_text',
      // Эти пути всегда должны быть массивами
      isArray: (name, jpath, isLeafNode, isAttribute) => {
        const arrayPaths = [
          'form:Form.items',
          'items',
          'formCommands',
          'handlers',
          'attributes',
          'parameters',
          'title',
          'toolTip'
        ];
        // Проверяем окончание пути
        for (const path of arrayPaths) {
          if (jpath.endsWith(path)) {
            return true;
          }
        }
        return false;
      },
    });
  }

  /**
   * Парсит .form файл и возвращает типизированную структуру
   */
  parseFormFile(filePath: string): EdtForm | null {
    if (!fs.existsSync(filePath)) {
      console.error(`Form file not found: ${filePath}`);
      return null;
    }

    const xml = fs.readFileSync(filePath, 'utf8');
    return this.parseFormXml(xml);
  }

  /**
   * Парсит XML содержимое формы
   */
  parseFormXml(xml: string): EdtForm | null {
    try {
      const parsed = this.parser.parse(xml);
      const formNode = parsed['form:Form'];
      
      if (!formNode) {
        console.error('Invalid form XML: root element form:Form not found');
        return null;
      }

      return this.convertToEdtForm(formNode);
    } catch (error) {
      console.error('Error parsing form XML:', error);
      return null;
    }
  }

  /**
   * Конвертирует распарсенный XML узел в EdtForm
   */
  private convertToEdtForm(node: any): EdtForm {
    const form: EdtForm = {};

    // Элементы формы
    if (node.items) {
      form.items = this.parseItems(node.items);
    }

    // Автокомандная панель
    if (node.autoCommandBar) {
      form.autoCommandBar = {
        name: node.autoCommandBar.name,
        id: node.autoCommandBar.id,
        items: node.autoCommandBar.items ? this.parseItems(node.autoCommandBar.items) : []
      };
    }

    // Команды формы
    if (node.formCommands) {
      form.formCommands = this.parseCommands(node.formCommands);
    }

    // Атрибуты
    if (node.attributes) {
      form.attributes = this.parseAttributes(node.attributes);
    }

    // Параметры
    if (node.parameters) {
      form.parameters = node.parameters;
    }

    // Обработчики событий
    if (node.handlers) {
      form.handlers = this.parseHandlers(node.handlers);
    }

    // ExtInfo формы
    if (node.extInfo) {
      form.extInfo = {
        handlers: node.extInfo.handlers ? this.parseHandlers(node.extInfo.handlers) : [],
        repostOnWrite: node.extInfo.repostOnWrite === 'true' || node.extInfo.repostOnWrite === true
      };
    }

    // Свойства формы
    if (node.title) {
      form.title = this.parseLocalizedString(node.title);
    }
    if (node.width !== undefined) {
      form.width = parseInt(node.width);
    }
    if (node.height !== undefined) {
      form.height = parseInt(node.height);
    }
    if (node.autoTitle !== undefined) {
      form.autoTitle = node.autoTitle === 'true' || node.autoTitle === true;
    }

    return form;
  }

  /**
   * Парсит массив элементов формы
   */
  private parseItems(items: any[]): FormItem[] {
    if (!Array.isArray(items)) {
      items = [items];
    }

    return items.map(item => this.parseItem(item)).filter(item => item !== null) as FormItem[];
  }

  /**
   * Парсит отдельный элемент формы
   */
  private parseItem(item: ParsedFormNode): FormItem | null {
    const xsiType = item['$_xsi:type'];

    switch (xsiType) {
      case 'form:FormGroup':
        return this.parseFormGroup(item);
      case 'form:FormField':
        return this.parseFormField(item);
      case 'form:Table':
        return this.parseFormTable(item);
      case 'form:Button':
        return this.parseFormButton(item);
      case 'form:Decoration':
        return this.parseFormDecoration(item);
      default:
        // Пытаемся определить тип по другим признакам
        if (item.items) {
          return this.parseFormGroup(item);
        }
        if (item.dataPath) {
          return this.parseFormField(item);
        }
        console.warn(`Unknown form item type: ${xsiType}`);
        return null;
    }
  }

  /**
   * Парсит группу формы
   */
  private parseFormGroup(node: any): FormGroup {
    const group: FormGroup = {
      name: node.name,
      id: parseInt(node.id),
      visible: this.parseBoolean(node.visible),
      enabled: this.parseBoolean(node.enabled),
      type: node.type || 'UsualGroup'
    };

    if (node.title) {
      group.title = this.parseLocalizedString(node.title);
    }

    if (node.titleLocation) {
      group.titleLocation = node.titleLocation;
    }

    if (node.userVisible) {
      group.userVisible = {
        common: this.parseBoolean(node.userVisible.common)
      };
    }

    if (node.items) {
      group.items = this.parseItems(node.items);
    }

    if (node.extInfo) {
      group.extInfo = this.parseGroupExtInfo(node.extInfo);
    }

    if (node.extendedTooltip) {
      group.extendedTooltip = this.parseExtendedTooltip(node.extendedTooltip);
    }

    return group;
  }

  /**
   * Парсит поле формы
   */
  private parseFormField(node: any): FormField {
    const field: FormField = {
      name: node.name,
      id: parseInt(node.id),
      visible: this.parseBoolean(node.visible),
      enabled: this.parseBoolean(node.enabled),
      type: node.type || 'InputField'
    };

    if (node.title) {
      field.title = this.parseLocalizedString(node.title);
    }

    if (node.titleLocation) {
      field.titleLocation = node.titleLocation;
    }

    if (node.userVisible) {
      field.userVisible = {
        common: this.parseBoolean(node.userVisible.common)
      };
    }

    if (node.dataPath) {
      field.dataPath = this.parseDataPath(node.dataPath);
    }

    if (node.handlers) {
      field.handlers = this.parseHandlers(node.handlers);
    }

    if (node.editMode) {
      field.editMode = node.editMode;
    }

    if (node.maxWidth !== undefined) {
      field.maxWidth = parseInt(node.maxWidth);
    }

    if (node.horizontalStretch !== undefined) {
      field.horizontalStretch = this.parseBoolean(node.horizontalStretch);
    }

    if (node.extInfo) {
      field.extInfo = this.parseFieldExtInfo(node.extInfo);
    }

    if (node.extendedTooltip) {
      field.extendedTooltip = this.parseExtendedTooltip(node.extendedTooltip);
    }

    return field;
  }

  /**
   * Парсит таблицу формы
   */
  private parseFormTable(node: any): FormTable {
    const table: FormTable = {
      name: node.name,
      id: parseInt(node.id),
      visible: this.parseBoolean(node.visible),
      enabled: this.parseBoolean(node.enabled)
    };

    if (node.title) {
      table.title = this.parseLocalizedString(node.title);
    }

    if (node.titleLocation) {
      table.titleLocation = node.titleLocation;
    }

    if (node.userVisible) {
      table.userVisible = {
        common: this.parseBoolean(node.userVisible.common)
      };
    }

    if (node.dataPath) {
      table.dataPath = this.parseDataPath(node.dataPath);
    }

    if (node.items) {
      table.items = this.parseItems(node.items);
    }

    if (node.handlers) {
      table.handlers = this.parseHandlers(node.handlers);
    }

    return table;
  }

  /**
   * Парсит кнопку формы
   */
  private parseFormButton(node: any): FormButton {
    const button: FormButton = {
      name: node.name,
      id: parseInt(node.id),
      visible: this.parseBoolean(node.visible),
      enabled: this.parseBoolean(node.enabled)
    };

    if (node.title) {
      button.title = this.parseLocalizedString(node.title);
    }

    if (node.commandName) {
      button.commandName = node.commandName;
    }

    if (node.representation) {
      button.representation = node.representation;
    }

    if (node.handlers) {
      button.handlers = this.parseHandlers(node.handlers);
    }

    return button;
  }

  /**
   * Парсит декорацию (надпись/картинка)
   */
  private parseFormDecoration(node: any): FormDecoration {
    const decoration: FormDecoration = {
      name: node.name,
      id: parseInt(node.id),
      visible: this.parseBoolean(node.visible),
      enabled: this.parseBoolean(node.enabled),
      type: node.type || 'Label'
    };

    if (node.title) {
      decoration.title = this.parseLocalizedString(node.title);
    }

    if (node.maxWidth !== undefined) {
      decoration.maxWidth = parseInt(node.maxWidth);
    }

    if (node.autoMaxWidth !== undefined) {
      decoration.autoMaxWidth = this.parseBoolean(node.autoMaxWidth);
    }

    if (node.autoMaxHeight !== undefined) {
      decoration.autoMaxHeight = this.parseBoolean(node.autoMaxHeight);
    }

    if (node.extInfo) {
      decoration.extInfo = this.parseDecorationExtInfo(node.extInfo);
    }

    return decoration;
  }

  /**
   * Парсит локализованную строку
   */
  private parseLocalizedString(value: any): LocalizedString | LocalizedString[] {
    if (Array.isArray(value)) {
      return value.map(v => ({
        key: v.key || '',
        value: v.value || ''
      }));
    }
    return {
      key: value.key || '',
      value: value.value || ''
    };
  }

  /**
   * Парсит DataPath
   */
  private parseDataPath(value: any): DataPath {
    if (typeof value === 'string') {
      return { segments: value };
    }
    return {
      segments: value.segments || ''
    };
  }

  /**
   * Парсит обработчики событий
   */
  private parseHandlers(handlers: any): EventHandler[] {
    if (!Array.isArray(handlers)) {
      handlers = [handlers];
    }
    return handlers.map((h: any) => ({
      event: h.event || '',
      name: h.name || ''
    }));
  }

  /**
   * Парсит ExtInfo для групп
   */
  private parseGroupExtInfo(extInfo: any): any {
    const result: any = {};
    
    if (extInfo.group) {
      result.group = extInfo.group;
    }
    if (extInfo.showLeftMargin !== undefined) {
      result.showLeftMargin = this.parseBoolean(extInfo.showLeftMargin);
    }
    if (extInfo.united !== undefined) {
      result.united = this.parseBoolean(extInfo.united);
    }
    if (extInfo.throughAlign) {
      result.throughAlign = extInfo.throughAlign;
    }
    if (extInfo.currentRowUse) {
      result.currentRowUse = extInfo.currentRowUse;
    }
    if (extInfo.representation) {
      result.representation = extInfo.representation;
    }
    if (extInfo.showTitle !== undefined) {
      result.showTitle = this.parseBoolean(extInfo.showTitle);
    }
    if (extInfo.pagesRepresentation) {
      result.pagesRepresentation = extInfo.pagesRepresentation;
    }

    return result;
  }

  /**
   * Парсит ExtInfo для полей
   */
  private parseFieldExtInfo(extInfo: any): any {
    const result: any = {};

    if (extInfo.handlers) {
      result.handlers = this.parseHandlers(extInfo.handlers);
    }
    if (extInfo.autoMaxWidth !== undefined) {
      result.autoMaxWidth = this.parseBoolean(extInfo.autoMaxWidth);
    }
    if (extInfo.autoMaxHeight !== undefined) {
      result.autoMaxHeight = this.parseBoolean(extInfo.autoMaxHeight);
    }
    if (extInfo.wrap !== undefined) {
      result.wrap = this.parseBoolean(extInfo.wrap);
    }
    if (extInfo.chooseType !== undefined) {
      result.chooseType = this.parseBoolean(extInfo.chooseType);
    }
    if (extInfo.typeDomainEnabled !== undefined) {
      result.typeDomainEnabled = this.parseBoolean(extInfo.typeDomainEnabled);
    }
    if (extInfo.textEdit !== undefined) {
      result.textEdit = this.parseBoolean(extInfo.textEdit);
    }
    if (extInfo.choiceHistoryOnInput) {
      result.choiceHistoryOnInput = extInfo.choiceHistoryOnInput;
    }
    if (extInfo.maxWidth !== undefined) {
      result.maxWidth = parseInt(extInfo.maxWidth);
    }
    if (extInfo.width !== undefined) {
      result.width = parseInt(extInfo.width);
    }
    if (extInfo.horizontalStretch !== undefined) {
      result.horizontalStretch = this.parseBoolean(extInfo.horizontalStretch);
    }
    if (extInfo.hyperlink !== undefined) {
      result.hyperlink = this.parseBoolean(extInfo.hyperlink);
    }

    return result;
  }

  /**
   * Парсит ExtInfo для декораций
   */
  private parseDecorationExtInfo(extInfo: any): any {
    const result: any = {};

    if (extInfo.handlers) {
      result.handlers = this.parseHandlers(extInfo.handlers);
    }
    if (extInfo.horizontalAlign) {
      result.horizontalAlign = extInfo.horizontalAlign;
    }
    if (extInfo.hyperlink !== undefined) {
      result.hyperlink = this.parseBoolean(extInfo.hyperlink);
    }
    if (extInfo.picture) {
      result.picture = {
        picture: extInfo.picture.picture || ''
      };
    }
    if (extInfo.fileDragMode) {
      result.fileDragMode = extInfo.fileDragMode;
    }

    return result;
  }

  /**
   * Парсит ExtendedTooltip
   */
  private parseExtendedTooltip(tooltip: any): any {
    return {
      name: tooltip.name,
      id: parseInt(tooltip.id),
      type: tooltip.type || 'Label',
      autoMaxWidth: this.parseBoolean(tooltip.autoMaxWidth),
      autoMaxHeight: this.parseBoolean(tooltip.autoMaxHeight)
    };
  }

  /**
   * Парсит команды формы
   */
  private parseCommands(commands: any[]): FormCommand[] {
    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    return commands.map(cmd => {
      const command: FormCommand = {
        name: cmd.name,
        id: parseInt(cmd.id)
      };

      if (cmd.title) {
        command.title = this.parseLocalizedString(cmd.title);
      }
      if (cmd.toolTip) {
        command.toolTip = this.parseLocalizedString(cmd.toolTip);
      }
      if (cmd.use) {
        command.use = { common: this.parseBoolean(cmd.use.common) };
      }
      if (cmd.picture) {
        command.picture = { picture: cmd.picture.picture || '' };
      }
      if (cmd.action && cmd.action.handler) {
        command.action = { handler: { name: cmd.action.handler.name || '' } };
      }
      if (cmd.representation) {
        command.representation = cmd.representation;
      }
      if (cmd.modifiesStoredData !== undefined) {
        command.modifiesStoredData = this.parseBoolean(cmd.modifiesStoredData);
      }
      if (cmd.currentRowUse) {
        command.currentRowUse = cmd.currentRowUse;
      }
      if (cmd.functionalOptions) {
        command.functionalOptions = cmd.functionalOptions;
      }

      return command;
    });
  }

  /**
   * Парсит атрибуты формы
   */
  private parseAttributes(attributes: any[]): any[] {
    if (!Array.isArray(attributes)) {
      attributes = [attributes];
    }

    return attributes.map(attr => ({
      name: attr.name,
      id: parseInt(attr.id),
      title: attr.title ? this.parseLocalizedString(attr.title) : undefined,
      mainAttribute: this.parseBoolean(attr.mainAttribute),
      savedData: this.parseBoolean(attr.savedData),
      fillCheck: attr.fillCheck
    }));
  }

  /**
   * Преобразует строковое значение в boolean
   */
  private parseBoolean(value: any): boolean {
    if (value === undefined || value === null) {
      return true; // по умолчанию true для visible/enabled
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  }
}
