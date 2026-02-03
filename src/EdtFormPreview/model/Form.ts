/**
 * Form - главный интерфейс формы
 * Based on EDT com._1c.g5.v8.dt.form.model.Form
 */

import { FormItem } from './FormItem';
import { FormAttribute } from './FormAttribute';
import { FormCommand } from './FormCommand';
import { FormParameter } from './FormParameter';
import { EventHandler } from './EventHandler';
import { LocalizedString } from './Titled';
import { ItemHorizontalAlignment, ItemVerticalAlignment } from './ItemAlignment';
import { FormChildrenGroup } from './FormChildrenGroup';
import { FormChildrenAlign } from './FormChildrenAlign';
import { FormItemSpacing } from './FormItemSpacing';
import { FormChildrenWidth } from './FormChildrenWidth';
import { ChildrenTitleLocation } from './ChildrenTitleLocation';
import { Picture } from './Picture';
import { FormWindowOpeningMode } from './FormWindowOpeningMode';
import { FormEnterKeyBehavior } from './FormEnterKeyBehavior';
import { SaveFormDataInSettings } from './SaveFormDataInSettings';
import { FormBaseFontVariant } from './FormBaseFontVariant';
import { FormExtInfo } from './FormExtInfo';

/**
 * Режим блокировки при открытии окна формы
 */
export type OnFormWindowOpenLockMode = 
    | 'Window'
    | 'WholeInterface';

/**
 * Режим просмотра окна формы
 */
export type FormWindowViewMode = 
    | 'Normal'
    | 'Minimized'
    | 'Maximized';

/**
 * Автосохранение данных формы в настройках
 */
export type AutoSaveFormDataInSettings = 
    | 'Auto'
    | 'Use'
    | 'DontUse';

/**
 * Режим прокрутки формы
 */
export type LogFormScrollMode = 
    | 'UseIfNecessary'
    | 'Use'
    | 'DontUse';

/**
 * Показывать заголовок (8.5.1)
 */
export type ShowTitle851 = 
    | 'Auto'
    | 'Show'
    | 'Hide';

/**
 * Представление обсуждений формы
 */
export type FormConversationsRepresentation = 
    | 'Auto'
    | 'None'
    | 'Compact'
    | 'Full';

/**
 * Сворачивание элементов формы по важности
 */
export type CollapseFormItemsByImportance = 
    | 'Auto'
    | 'DontCollapse'
    | 'Collapse';

/**
 * Вариант масштаба формы клиентского приложения
 */
export type ClientApplicationFormScaleVariant = 
    | 'Auto'
    | 'Normal'
    | 'Compact'
    | 'Large';

/**
 * Интерфейс командной панели формы
 */
export interface FormCommandInterface {
    /** Навигационная панель */
    navigationPanel?: any;
    /** Командная панель */
    commandPanel?: any;
}

/**
 * Источник глобальных команд командной панели
 */
export type FormCommandPanelGlobalCommandSource = 
    | 'Auto'
    | 'Enabled';

/**
 * Главный интерфейс формы
 */
export interface Form {
    /** Ширина */
    width?: number;
    
    /** Высота */
    height?: number;
    
    /** Режим открытия окна */
    windowOpeningMode?: FormWindowOpeningMode;
    
    /** Режим блокировки при открытии */
    onFormWindowOpenLockMode?: OnFormWindowOpenLockMode;
    
    /** Режим просмотра окна */
    windowViewMode?: FormWindowViewMode;
    
    /** Поведение клавиши Enter */
    enterKeyBehavior?: FormEnterKeyBehavior;
    
    /** Автосохранение данных в настройках */
    autoSaveDataInSettings?: AutoSaveFormDataInSettings;
    
    /** Сохранение данных в настройках */
    saveDataInSettings?: SaveFormDataInSettings;
    
    /** Сохранять настройки окна */
    saveWindowSettings?: boolean;
    
    /** Хранилище настроек */
    settingsStorage?: string;
    
    /** Автозаголовок */
    autoTitle?: boolean;
    
    /** Авто URL */
    autoUrl?: boolean;
    
    /** Группировка */
    group?: FormChildrenGroup;
    
    /** Выравнивание дочерних элементов */
    childrenAlign?: FormChildrenAlign;
    
    /** Горизонтальное расстояние */
    horizontalSpacing?: FormItemSpacing;
    
    /** Вертикальное расстояние */
    verticalSpacing?: FormItemSpacing;
    
    /** Горизонтальное выравнивание */
    horizontalAlign?: ItemHorizontalAlignment;
    
    /** Вертикальное выравнивание */
    verticalAlign?: ItemVerticalAlignment;
    
    /** Расположение заголовков дочерних элементов */
    childItemsTitleLocation?: ChildrenTitleLocation;
    
    /** Ширина дочерних элементов */
    childItemsWidth?: FormChildrenWidth;
    
    /** Авто проверка заполнения */
    autoFillCheck?: boolean;
    
    /** Разрешить настройку формы */
    allowFormCustomize?: boolean;
    
    /** Доступность */
    enabled?: boolean;
    
    /** Вертикальная прокрутка */
    verticalScroll?: LogFormScrollMode;
    
    /** Режим масштабирования */
    scalingMode?: FormBaseFontVariant;
    
    /** Масштаб */
    scale?: number;
    
    /** Показывать заголовок */
    showTitle?: boolean;
    
    /** Показывать заголовок (8.5.1) */
    showTitle851?: ShowTitle851;
    
    /** Показывать кнопку закрытия */
    showCloseButton?: boolean;
    
    /** Представление обсуждений */
    conversationsRepresentation?: FormConversationsRepresentation;
    
    /** Сворачивание элементов по важности */
    collapseItemsByImportanceVariant?: CollapseFormItemsByImportance;
    
    /** Заголовок группы кнопок создания */
    createButtonsGroupTitle?: { [key: string]: string };
    
    /** Картинка группы кнопок создания */
    createButtonsGroupPicture?: Picture;
    
    /** Вариант масштаба */
    scaleVariant?: ClientApplicationFormScaleVariant;
    
    /** Заголовок */
    title?: LocalizedString | string;
    
    /** Элементы формы */
    items?: FormItem[];
    
    /** Реквизиты */
    attributes?: FormAttribute[];
    
    /** Команды формы */
    formCommands?: FormCommand[];
    
    /** Параметры */
    parameters?: FormParameter[];
    
    /** Командный интерфейс */
    commandInterface?: FormCommandInterface;
    
    /** Расширенная информация */
    extInfo?: FormExtInfo;
    
    /** Источник глобальных команд командной панели */
    commandPanelGlobalCommandSource?: FormCommandPanelGlobalCommandSource;
    
    /** Обработчики событий */
    handlers?: EventHandler[];
    
    /** Командная панель */
    commandBar?: FormItem;
}
