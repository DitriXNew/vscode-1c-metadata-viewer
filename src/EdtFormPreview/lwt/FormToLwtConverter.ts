/**
 * FormToLwtConverter - конвертер модели формы EDT в LWT контролы
 * Преобразует Form и его элементы в дерево LightControl/LightComposite
 */

import { Form } from '../model/Form';
import { FormItem } from '../model/FormItem';
import { FormField } from '../model/FormField';
import { FormGroup } from '../model/FormGroup';
import { Button } from '../model/Button';
import { Table } from '../model/Table';
import { Decoration } from '../model/Decoration';
import { ManagedFormFieldType } from '../model/types';
import { ManagedFormGroupType } from '../model/types';
import { ManagedFormDecorationType } from '../model/types';
import { LocalizedString } from '../model/LocalizedString';

// LWT imports
import { LightComposite } from '../lwt/core/LightComposite';
import { LightControl } from '../lwt/core/LightControl';
import { ILightControl } from '../lwt/core/interfaces';
import { Rectangle } from '../lwt/geometry/Rectangle';
import { Point } from '../lwt/geometry/Point';
import { Color } from '../lwt/theme';

// LWT контролы
import {
    LabelControl,
    InputFieldControl,
    ButtonControl,
    GroupControl,
    CheckboxControl,
    TableControl,
    CommandBarControl,
    TabsControl,
    CalendarControl,
    ComboBoxControl,
    RadioButtonGroup,
    TreeViewControl,
    ProgressBarControl,
    ScrollBarControl,
    SplitterControl,
    SpinnerControl,
    ListControl,
    ImageControl,
    SeparatorControl,
    FormattedTextControl,
    ControlDecoration,
    ImageComboControl,
    ColorBoxControl,
    ScrolledContentComposite,
    createColumn,
    createCommandBarItem,
    createTabPage
} from '../lwt/controls';

// Layouts
import { FillLayout } from '../lwt/layouts/FillLayout';
import { GridLayout } from '../lwt/layouts/GridLayout';

/**
 * Опции конвертации
 */
export interface ConversionOptions {
    /** Язык для локализованных строк (по умолчанию 'ru') */
    locale?: string;
    
    /** Масштаб (по умолчанию 1.0) */
    scale?: number;
    
    /** Показывать заголовки групп */
    showGroupTitles?: boolean;
    
    /** Использовать цвета из формы */
    useFormColors?: boolean;
}

/**
 * Результат конвертации
 */
export interface ConversionResult {
    /** Корневой LWT контрол */
    root: LightComposite;
    
    /** Маппинг id элемента → LWT контрол */
    controlsById: Map<number, ILightControl>;
    
    /** Маппинг имени элемента → LWT контрол */
    controlsByName: Map<string, ILightControl>;
    
    /** Ошибки конвертации */
    errors: string[];
    
    /** Предупреждения */
    warnings: string[];
}

/**
 * Конвертер формы EDT в LWT контролы
 */
export class FormToLwtConverter {
    private options: ConversionOptions;
    private controlsById: Map<number, ILightControl> = new Map();
    private controlsByName: Map<string, ILightControl> = new Map();
    private errors: string[] = [];
    private warnings: string[] = [];
    
    constructor(options: ConversionOptions = {}) {
        this.options = {
            locale: 'ru',
            scale: 1.0,
            showGroupTitles: true,
            useFormColors: true,
            ...options
        };
    }
    
    /**
     * Конвертирует форму в LWT
     */
    convert(form: Form): ConversionResult {
        this.controlsById.clear();
        this.controlsByName.clear();
        this.errors = [];
        this.warnings = [];
        
        // Создаём корневой контейнер
        const root = new LightComposite();
        root.setLayout(this.createFormLayout(form));
        
        // Устанавливаем размеры формы
        const width = form.width || 800;
        const height = form.height || 600;
        root.setBounds(new Rectangle(0, 0, width, height));
        
        // Конвертируем дочерние элементы
        if (form.items && Array.isArray(form.items)) {
            for (const item of form.items) {
                try {
                    const control = this.convertFormItem(item);
                    if (control) {
                        root.addChild(control);
                    }
                } catch (err) {
                    this.errors.push(`Ошибка конвертации элемента ${(item as any).name}: ${err}`);
                }
            }
        }
        
        // Выполняем layout
        root.layout();
        
        return {
            root,
            controlsById: this.controlsById,
            controlsByName: this.controlsByName,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    
    /**
     * Создаёт layout для формы
     */
    private createFormLayout(form: Form): FillLayout | GridLayout {
        // По умолчанию используем вертикальный FillLayout (512 = VERTICAL)
        const layout = new FillLayout(512);
        layout.marginWidth = 8;
        layout.marginHeight = 8;
        layout.spacing = 4;
        return layout;
    }
    
    /**
     * Конвертирует элемент формы
     */
    private convertFormItem(item: any): ILightControl | null {
        if (!item) return null;
        
        // Определяем тип элемента по его структуре
        if (this.isFormField(item)) {
            return this.convertFormField(item as FormField);
        } else if (this.isFormGroup(item)) {
            return this.convertFormGroup(item as FormGroup);
        } else if (this.isButton(item)) {
            return this.convertButton(item as Button);
        } else if (this.isTable(item)) {
            return this.convertTable(item as Table);
        } else if (this.isDecoration(item)) {
            return this.convertDecoration(item as Decoration);
        } else {
            this.warnings.push(`Неизвестный тип элемента: ${item.name || 'без имени'}`);
            return null;
        }
    }
    
    // ===== Определение типов =====
    
    private isFormField(item: any): boolean {
        return item.type !== undefined && typeof item.type === 'string' && 
               (item.type.includes('Field') || item.dataPath !== undefined);
    }
    
    private isFormGroup(item: any): boolean {
        return item.type !== undefined && typeof item.type === 'string' &&
               (item.type.includes('Group') || item.type === 'Pages' || item.type === 'Page' ||
                item.type === 'CommandBar' || item.type === 'Popup');
    }
    
    private isButton(item: any): boolean {
        return item.commandName !== undefined || 
               (item.type !== undefined && item.type.includes('Button'));
    }
    
    private isTable(item: any): boolean {
        return item.representation !== undefined && item.items !== undefined &&
               (item.type === undefined || !item.type.includes('Group'));
    }
    
    private isDecoration(item: any): boolean {
        return item.type !== undefined && 
               (item.type === 'Label' || item.type === 'Picture' || 
                item.type.includes('Decoration'));
    }
    
    // ===== Конвертация FormField =====
    
    private convertFormField(field: FormField): ILightControl | null {
        const fieldType = field.type as string;
        let control: ILightControl | null = null;
        
        switch (fieldType) {
            case 'InputField':
                control = this.createInputField(field);
                break;
            case 'CheckBoxField':
                control = this.createCheckboxField(field);
                break;
            case 'LabelField':
                control = this.createLabelField(field);
                break;
            case 'CalendarField':
                control = this.createCalendarField(field);
                break;
            case 'ProgressBarField':
                control = this.createProgressBarField(field);
                break;
            case 'RadioButtonField':
                control = this.createRadioButtonField(field);
                break;
            case 'TrackBarField':
                control = this.createTrackBarField(field);
                break;
            case 'PictureField':
                control = this.createPictureField(field);
                break;
            case 'SpreadsheetDocumentField':
            case 'TextDocumentField':
            case 'HTMLDocumentField':
            case 'FormattedDocumentField':
                control = this.createDocumentField(field);
                break;
            case 'ChartField':
            case 'GanttChartField':
            case 'DendrogramField':
                control = this.createChartField(field);
                break;
            case 'PeriodField':
                control = this.createPeriodField(field);
                break;
            case 'GeographicalSchemaField':
            case 'GraphicalSchemaField':
                control = this.createSchemaField(field);
                break;
            case 'PlannerField':
                control = this.createPlannerField(field);
                break;
            case 'PDFDocumentField':
                control = this.createPdfField(field);
                break;
            default:
                this.warnings.push(`Неподдерживаемый тип поля: ${fieldType} (${field.name})`);
                control = this.createFallbackField(field);
        }
        
        if (control) {
            this.registerControl(field, control);
            this.applyCommonFieldProperties(control, field);
        }
        
        return control;
    }
    
    // ===== Создание контролов полей =====
    
    private createInputField(field: FormField): InputFieldControl {
        const control = new InputFieldControl();
        const title = this.getLocalizedString(field.title);
        // InputFieldControl не имеет label, используем placeholder или text
        control.placeholder = title || field.name || '';
        control.readOnly = field.readOnly || false;
        
        // Получаем extInfo для дополнительных настроек
        const extInfo = field.extInfo as any;
        if (extInfo) {
            if (extInfo.multiLine) {
                control.multiline = true;
            }
            if (extInfo.passwordMode) {
                control.passwordMode = true;
            }
        }
        
        return control;
    }
    
    private createCheckboxField(field: FormField): CheckboxControl {
        const control = new CheckboxControl();
        const title = this.getLocalizedString(field.title);
        control.text = title || field.name || '';
        control.checked = false;
        control.readOnly = field.readOnly || false;
        return control;
    }
    
    private createLabelField(field: FormField): LabelControl {
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = title || field.name || '';
        return control;
    }
    
    private createCalendarField(field: FormField): CalendarControl {
        const control = new CalendarControl();
        control.selectedDate = new Date();
        return control;
    }
    
    private createProgressBarField(field: FormField): ProgressBarControl {
        const control = new ProgressBarControl();
        control.value = 0;
        control.maximum = 100;
        return control;
    }
    
    private createRadioButtonField(field: FormField): RadioButtonGroup {
        const control = new RadioButtonGroup();
        
        // Получаем опции из extInfo
        const extInfo = field.extInfo as any;
        if (extInfo?.choiceList) {
            const options = extInfo.choiceList.map((item: any) => ({
                value: item.value || item,
                label: this.getLocalizedString(item.presentation) || String(item.value || item)
            }));
            control.options = options;
        }
        
        return control;
    }
    
    private createTrackBarField(field: FormField): ProgressBarControl {
        // Используем ProgressBarControl как аналог TrackBar
        const control = new ProgressBarControl();
        control.value = 0;
        control.maximum = 100;
        return control;
    }
    
    private createPictureField(field: FormField): ImageControl {
        const control = new ImageControl();
        return control;
    }
    
    private createDocumentField(field: FormField): LabelControl {
        // Заглушка для полей документов
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = `[Документ: ${title || field.name}]`;
        return control;
    }
    
    private createChartField(field: FormField): LabelControl {
        // Заглушка для диаграмм
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = `[Диаграмма: ${title || field.name}]`;
        return control;
    }
    
    private createPeriodField(field: FormField): InputFieldControl {
        const control = new InputFieldControl();
        const title = this.getLocalizedString(field.title);
        control.placeholder = title || field.name || 'Период';
        return control;
    }
    
    private createSchemaField(field: FormField): LabelControl {
        // Заглушка для схем
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = `[Схема: ${title || field.name}]`;
        return control;
    }
    
    private createPlannerField(field: FormField): LabelControl {
        // Заглушка для планировщика
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = `[Планировщик: ${title || field.name}]`;
        return control;
    }
    
    private createPdfField(field: FormField): LabelControl {
        // Заглушка для PDF
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = `[PDF: ${title || field.name}]`;
        return control;
    }
    
    private createFallbackField(field: FormField): LabelControl {
        const control = new LabelControl();
        const title = this.getLocalizedString(field.title);
        control.text = title || field.name || 'Поле';
        return control;
    }
    
    // ===== Конвертация FormGroup =====
    
    private convertFormGroup(group: FormGroup): ILightControl | null {
        const groupType = group.type as string;
        let control: ILightControl | null = null;
        
        switch (groupType) {
            case 'UsualGroup':
                control = this.createUsualGroup(group);
                break;
            case 'Pages':
                control = this.createPagesGroup(group);
                break;
            case 'Page':
                control = this.createPageGroup(group);
                break;
            case 'CommandBar':
                control = this.createCommandBar(group);
                break;
            case 'ButtonGroup':
                control = this.createButtonGroup(group);
                break;
            case 'ColumnGroup':
                control = this.createColumnGroup(group);
                break;
            case 'Popup':
                control = this.createPopupGroup(group);
                break;
            case 'ContextMenu':
                control = this.createContextMenu(group);
                break;
            default:
                this.warnings.push(`Неподдерживаемый тип группы: ${groupType} (${group.name})`);
                control = this.createFallbackGroup(group);
        }
        
        if (control) {
            this.registerControl(group, control);
        }
        
        return control;
    }
    
    // ===== Создание контролов групп =====
    
    private createUsualGroup(group: FormGroup): GroupControl {
        const control = new GroupControl();
        const title = this.getLocalizedString(group.title);
        control.title = this.options.showGroupTitles ? (title || group.name || '') : '';
        control.collapsible = false;
        
        // Добавляем дочерние элементы
        this.addGroupChildren(control, group);
        
        return control;
    }
    
    private createPagesGroup(group: FormGroup): TabsControl {
        const control = new TabsControl();
        
        // Каждая дочерняя группа Page становится вкладкой
        if (group.items && Array.isArray(group.items)) {
            const pages: any[] = [];
            for (const pageItem of group.items) {
                if ((pageItem as any).type === 'Page') {
                    const pageTitle = this.getLocalizedString((pageItem as any).title) || (pageItem as any).name || 'Страница';
                    
                    // Создаём контейнер для содержимого страницы
                    const pageContent = new LightComposite();
                    pageContent.setLayout(new FillLayout(512)); // VERTICAL
                    
                    // Добавляем элементы страницы
                    if ((pageItem as any).items && Array.isArray((pageItem as any).items)) {
                        for (const item of (pageItem as any).items) {
                            const childControl = this.convertFormItem(item);
                            if (childControl) {
                                pageContent.addChild(childControl);
                            }
                        }
                    }
                    
                    // Создаём страницу вкладки
                    const page = createTabPage(
                        (pageItem as any).name || String((pageItem as any).id), 
                        pageTitle,
                        { content: pageContent }
                    );
                    pages.push(page);
                    
                    this.registerControl(pageItem as FormItem, pageContent);
                }
            }
            control.pages = pages;
            if (pages.length > 0) {
                control.activePageId = pages[0].id;
            }
        }
        
        return control;
    }
    
    private createPageGroup(group: FormGroup): LightComposite {
        // Page сама по себе - это контейнер
        const control = new LightComposite();
        control.setLayout(new FillLayout(512)); // VERTICAL
        
        // Добавляем дочерние элементы
        if (group.items && Array.isArray(group.items)) {
            for (const item of group.items) {
                const childControl = this.convertFormItem(item);
                if (childControl) {
                    control.addChild(childControl);
                }
            }
        }
        
        return control;
    }
    
    private createCommandBar(group: FormGroup): CommandBarControl {
        const control = new CommandBarControl();
        
        // Добавляем кнопки из дочерних элементов
        const items: any[] = [];
        if (group.items && Array.isArray(group.items)) {
            for (const item of group.items) {
                if (this.isButton(item)) {
                    const button = item as Button;
                    const title = this.getLocalizedString(button.title);
                    const cmdItem = createCommandBarItem(
                        button.name || String(button.id),
                        title || button.name || ''
                    );
                    items.push(cmdItem);
                    this.registerControl(button as any, control);
                }
            }
        }
        control.items = items;
        
        return control;
    }
    
    private createButtonGroup(group: FormGroup): LightComposite {
        const control = new LightComposite();
        control.setLayout(new FillLayout(256)); // HORIZONTAL
        
        // Добавляем кнопки
        if (group.items && Array.isArray(group.items)) {
            for (const item of group.items) {
                const childControl = this.convertFormItem(item);
                if (childControl) {
                    control.addChild(childControl);
                }
            }
        }
        
        return control;
    }
    
    private createColumnGroup(group: FormGroup): LightComposite {
        // Группа колонок - горизонтальный layout
        const control = new LightComposite();
        control.setLayout(new FillLayout(256)); // HORIZONTAL
        
        this.addGroupChildren(control, group);
        
        return control;
    }
    
    private createPopupGroup(group: FormGroup): LightComposite {
        // Popup как обычный контейнер (не отображается как popup)
        const control = new LightComposite();
        control.setLayout(new FillLayout(512)); // VERTICAL
        
        this.addGroupChildren(control, group);
        
        return control;
    }
    
    private createContextMenu(group: FormGroup): LightComposite {
        // ContextMenu как контейнер
        const control = new LightComposite();
        return control;
    }
    
    private createFallbackGroup(group: FormGroup): GroupControl {
        const control = new GroupControl();
        const title = this.getLocalizedString(group.title);
        control.title = title || group.name || 'Группа';
        
        this.addGroupChildren(control, group);
        
        return control;
    }
    
    /**
     * Добавляет дочерние элементы в группу
     */
    private addGroupChildren(container: LightComposite | GroupControl, group: FormGroup): void {
        if (group.items && Array.isArray(group.items)) {
            for (const item of group.items) {
                const childControl = this.convertFormItem(item);
                if (childControl) {
                    container.addChild(childControl);
                }
            }
        }
    }
    
    // ===== Конвертация Button =====
    
    private convertButton(button: Button): ButtonControl {
        const control = new ButtonControl();
        const title = this.getLocalizedString(button.title);
        control.title = title || button.name || '';
        
        // Иконка
        if (button.picture) {
            // TODO: загрузка иконки из Picture
        }
        
        this.registerControl(button as any, control);
        
        return control;
    }
    
    // ===== Конвертация Table =====
    
    private convertTable(table: Table): TableControl {
        const control = new TableControl();
        
        // Колонки
        const columns: any[] = [];
        if (table.items && Array.isArray(table.items)) {
            for (const columnItem of table.items) {
                const column = columnItem as any;
                const title = this.getLocalizedString(column.title);
                const col = createColumn(
                    column.name || String(column.id),
                    title || column.name || '',
                    { width: column.width || 100 }
                );
                columns.push(col);
            }
        }
        control.columns = columns;
        
        this.registerControl(table as any, control);
        
        return control;
    }
    
    // ===== Конвертация Decoration =====
    
    private convertDecoration(decoration: Decoration): ILightControl {
        const decorationType = decoration.type as string;
        let control: ILightControl;
        
        if (decorationType === 'Label' || decorationType === 'LabelDecoration') {
            const labelControl = new LabelControl();
            const title = this.getLocalizedString(decoration.title);
            labelControl.text = title || decoration.name || '';
            
            // Форматирование
            if (decoration.formatted) {
                // Для форматированного текста можно использовать FormattedTextControl
                // но для простоты пока используем LabelControl
            }
            
            control = labelControl;
        } else if (decorationType === 'Picture' || decorationType === 'PictureDecoration') {
            const imageControl = new ImageControl();
            // TODO: загрузка изображения
            control = imageControl;
        } else {
            const labelControl = new LabelControl();
            const title = this.getLocalizedString(decoration.title);
            labelControl.text = title || decoration.name || '';
            control = labelControl;
        }
        
        this.registerControl(decoration, control);
        
        return control;
    }
    
    // ===== Вспомогательные методы =====
    
    /**
     * Регистрирует контрол в маппингах
     */
    private registerControl(item: FormItem, control: ILightControl): void {
        if (item.id !== undefined) {
            this.controlsById.set(item.id, control);
        }
        if (item.name) {
            this.controlsByName.set(item.name, control);
        }
    }
    
    /**
     * Применяет общие свойства поля
     */
    private applyCommonFieldProperties(control: ILightControl, field: FormField): void {
        // Размеры
        const width = (field as any).width;
        const height = (field as any).height;
        if (width !== undefined || height !== undefined) {
            const bounds = control.getBounds();
            control.setBounds(new Rectangle(
                bounds.x,
                bounds.y,
                width !== undefined ? width : bounds.width,
                height !== undefined ? height : bounds.height
            ));
        }
        
        // Видимость
        const visible = (field as any).visible;
        if (visible !== undefined) {
            control.setVisible(visible);
        }
        
        // Enabled
        if (field.readOnly) {
            control.setEnabled(false);
        }
    }
    
    /**
     * Получает локализованную строку
     */
    private getLocalizedString(value: LocalizedString | LocalizedString[] | string | undefined): string {
        if (!value) return '';
        
        if (typeof value === 'string') {
            return value;
        }
        
        if (Array.isArray(value)) {
            // Массив LocalizedString
            for (const item of value) {
                if (item.lang === this.options.locale || item.language === this.options.locale) {
                    return item.content || item.value || '';
                }
            }
            // Fallback: первый элемент
            if (value.length > 0) {
                return (value[0] as any).content || (value[0] as any).value || '';
            }
            return '';
        }
        
        // Объект с локализациями
        const loc = value as any;
        if (loc[this.options.locale!]) {
            return loc[this.options.locale!];
        }
        if (loc.ru) return loc.ru;
        if (loc.en) return loc.en;
        if (loc.content) return loc.content;
        if (loc.value) return loc.value;
        
        // Первое доступное значение
        const keys = Object.keys(loc);
        for (const key of keys) {
            if (typeof loc[key] === 'string') {
                return loc[key];
            }
        }
        
        return '';
    }
}

/**
 * Фабричная функция для создания конвертера
 */
export function createFormToLwtConverter(options?: ConversionOptions): FormToLwtConverter {
    return new FormToLwtConverter(options);
}

/**
 * Быстрая конвертация формы в LWT
 */
export function convertFormToLwt(form: Form, options?: ConversionOptions): ConversionResult {
    const converter = new FormToLwtConverter(options);
    return converter.convert(form);
}
