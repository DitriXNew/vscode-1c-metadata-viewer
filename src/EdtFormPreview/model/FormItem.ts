/**
 * FormItem - базовый интерфейс для всех элементов формы
 * @see com._1c.g5.v8.dt.form.model.FormItem
 * 
 * Наследует:
 * - NamedElement (name)
 * - FormVisualEntity (userChangedProperties)
 */
import { FormVisualEntity } from './FormVisualEntity';
import { DisplayImportance } from './DisplayImportance';

export type Origin = 
  | 'Auto'
  | 'AppliedInterfaceExtension';

export interface FormItem extends FormVisualEntity {
  /** Имя элемента */
  name: string;
  
  /** Идентификатор элемента */
  id: number;
  
  /** Важность отображения */
  displayImportance?: DisplayImportance;
  
  /** Флаг изменения позиции */
  positionChanged?: boolean;
  
  /** Происхождение элемента */
  origin?: Origin;
}
