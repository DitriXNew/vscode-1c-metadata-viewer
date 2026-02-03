// IElementDataSourceInfoProvider - интерфейс провайдера информации об источнике данных элемента

import { ElementDataSourceInfo } from './ElementDataSourceInfo';
import { Form } from './Form';

/**
 * IElementDataSourceInfoProvider - интерфейс провайдера информации об источнике данных элемента
 */
export interface IElementDataSourceInfoProvider {
    /** Получить список поддерживаемых имён типов */
    getProvidedTypeNames(): Set<string>;
    
    /** Получить информацию об источнике данных элемента на основе родительского элемента */
    getElementDataSourceInfo(parent: ElementDataSourceInfo): ElementDataSourceInfo[];
    
    /** Получить информацию об источнике данных элемента на основе формы */
    getElementDataSourceInfoForForm(form: Form): ElementDataSourceInfo[];
}

/**
 * Имя провайдера информации об источнике данных элемента формы
 */
export const FORM_ELEMENT_DATA_SOURCE_INFO_PROVIDER = 'FormElementDataSourceInfoProvider';
