/**
 * EDT Form Model - экспорт всех типов модели форм EDT
 * Структура соответствует com._1c.g5.v8.dt.form.model
 */

// Базовые типы
export * from './FormVisualEntity';
export * from './Titled';
export * from './Visible';
export * from './TitleStyle';
export * from './TooltipContainer';
export * from './EventHandler';
export * from './DataPath';
export * from './ItemAlignment';
export * from './DisplayImportance';

// Enums
export * from './ManagedFormGroupType';
export * from './ManagedFormFieldType';
export * from './ManagedFormDecorationType';

// ExtInfo базовые
export * from './ExtInfo';
export * from './GroupExtInfo';
export * from './FieldExtInfo';
export * from './DecorationExtInfo';

// GroupExtInfo наследники
export * from './UsualGroupExtInfo';
export * from './PagesGroupExtInfo';
export * from './PageGroupExtInfo';
export * from './CommandBarExtInfo';
export * from './ButtonGroupExtInfo';
export * from './ColumnGroupExtInfo';
export * from './PopupGroupExtInfo';

// FieldExtInfo наследники
export * from './InputFieldExtInfo';
export * from './LabelFieldExtInfo';
export * from './CheckBoxFieldExtInfo';
export * from './ImageFieldExtInfo';

// DecorationExtInfo наследники
export * from './LabelDecorationExtInfo';
export * from './PictureDecorationExtInfo';

// Основные элементы формы
export * from './FormItem';
export * from './DataItem';
export * from './Group';
export * from './FormGroup';
export * from './FormField';
export * from './Decoration';
export * from './Table';
export * from './Button';
