// IPropertyInfoProvider - интерфейс провайдера информации о свойствах

import { Form } from './Form';
import { PropertyInfo } from './PropertyInfo';

/**
 * IPropertyInfoProvider - интерфейс провайдера информации о свойствах
 */
export interface IPropertyInfoProvider {
    /** Получить список поддерживаемых имён типов */
    getProvidedTypeNames(): Set<string>;
    
    /** Получить информацию о свойствах на основе родительского свойства */
    getPropertyInfo(parent: PropertyInfo): PropertyInfo[];
    
    /** Проверить, предоставляет ли провайдер свойства для данного родителя */
    providesProperties?(parent: PropertyInfo): boolean;
    
    /** Получить информацию о свойствах формы */
    getPropertyInfoForForm(form: Form): PropertyInfo[];
}

/**
 * Имя провайдера информации о свойствах формы
 */
export const FORM_PROPERTY_INFO_PROVIDER = 'FormPropertyInfoProvider';
