/**
 * FormAttribute - реквизит формы
 * Based on EDT com._1c.g5.v8.dt.form.model.FormAttribute
 */

import { LocalizedString } from './LocalizedString';
import { FormAttributeExtInfo } from './FormAttributeExtInfo';
import { AdjustableBoolean, FillChecking } from './types';

/**
 * Описание типа
 */
export interface TypeDescription {
    /** Типы */
    types?: string[];
    /** Квалификатор числа */
    numberQualifiers?: {
        digits?: number;
        fractionDigits?: number;
        allowedSign?: string;
    };
    /** Квалификатор строки */
    stringQualifiers?: {
        length?: number;
        allowedLength?: string;
    };
    /** Квалификатор даты */
    dateQualifiers?: {
        dateFractions?: string;
    };
}

/**
 * Колонка реквизита формы
 */
export interface FormAttributeColumn {
    /** Имя */
    name?: string;
    /** ID */
    id?: number;
    /** Заголовок */
    title?: LocalizedString;
    /** Тип значения */
    valueType?: TypeDescription;
}

/**
 * Дополнительные колонки реквизита формы
 */
export interface FormAttributeAdditionalColumns {
    /** Путь к данным */
    dataPath?: string;
    /** Колонки */
    columns?: FormAttributeColumn[];
}

/**
 * Базовый интерфейс реквизита формы
 */
export interface AbstractFormAttribute {
    /** Имя */
    name?: string;
    /** ID */
    id?: number;
    /** Заголовок */
    title?: LocalizedString;
    /** Тип значения */
    valueType?: TypeDescription;
    /** Просмотр */
    view?: AdjustableBoolean;
    /** Редактирование */
    edit?: AdjustableBoolean;
    /** Проверка заполнения */
    fillChecking?: FillChecking;
    /** Функциональные опции */
    functionalOptions?: string[];
}

/**
 * Реквизит формы
 */
export interface FormAttribute extends AbstractFormAttribute {
    /** Атрибуты не по умолчанию, используемые всегда */
    notDefaultUseAlwaysAttributes?: string[];
    /** Сохраняемые данные настроек */
    settingsSavedData?: string[];
    /** Главный */
    main?: boolean;
    /** Сохраняемые данные */
    savedData?: boolean;
    /** Колонки */
    columns?: FormAttributeColumn[];
    /** Дополнительные колонки */
    additionalColumns?: FormAttributeAdditionalColumns[];
    /** Расширенная информация */
    extInfo?: FormAttributeExtInfo;
    /** Комментарий */
    comment?: string;
}
