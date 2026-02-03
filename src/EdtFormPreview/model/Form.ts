/**
 * Form - главный интерфейс формы
 * Based on EDT com._1c.g5.v8.dt.form.model.Form
 * 
 * Наследует:
 * - Titled
 * - FormVisualEntity
 * - FormItemContainer
 * - CommandBarHolder
 * - EventHandlerContainer
 * - AbstractForm
 * - FieldSource
 * - FormStandardCommandSource
 * - ExtensionAdoptedProperty
 */

import { FormItem } from './FormItem';
import { FormAttribute } from './FormAttribute';
import { FormCommand } from './FormCommand';
import { FormParameter } from './FormParameter';
import { EventHandler } from './EventHandler';
import { LocalizedString } from './LocalizedString';
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
import { AutoCommandBar } from './AutoCommandBar';
import { FormPurpose } from './FormPurpose';
import { ValueListItem } from './ValueListItem';
import { ElementDataSourceInfo } from './ElementDataSourceInfo';
import { PropertyInfo } from './PropertyInfo';
import { OnFormWindowOpenLockMode } from './OnFormWindowOpenLockMode';
import { FormWindowViewMode } from './FormWindowViewMode';
import { AutoSaveFormDataInSettings } from './AutoSaveFormDataInSettings';
import { LogFormScrollMode } from './LogFormScrollMode';
import { ShowTitle851 } from './ShowTitle851';
import { FormConversationsRepresentation } from './FormConversationsRepresentation';
import { CollapseFormItemsByImportance } from './CollapseFormItemsByImportance';
import { ClientApplicationFormScaleVariant } from './ClientApplicationFormScaleVariant';
import { InterfaceType } from './InterfaceType';
import { FormElementCommandBarLocation } from './FormElementCommandBarLocation';
import { FormCommandPanelGlobalCommandSource } from './FormCommandPanelGlobalCommandSource';
import { DataCompositionConditionalAppearance } from './DataCompositionConditionalAppearance';
import { FormCommandInterface } from './FormCommandInterface';

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
    
    /** Расположение командной панели */
    commandBarLocation?: FormElementCommandBarLocation;
    
    /** Показывать командную панель */
    showCommandBar?: boolean;
    
    /** Автоматическая командная панель */
    autoCommandBar?: AutoCommandBar;
    
    /** Верхняя командная панель */
    topCommandBar?: AutoCommandBar;
    
    /** Нижняя командная панель */
    bottomCommandBar?: AutoCommandBar;
    
    /** FAB командная панель (мобильная) */
    fabCommandBar?: AutoCommandBar;
    
    /** Условное оформление */
    conditionalAppearance?: DataCompositionConditionalAppearance;
    
    /** Назначение формы */
    purpose?: FormPurpose;
    
    /** Тип интерфейса (использовать с назначением) */
    interfaceType?: InterfaceType;
    
    /** Базовая форма (для расширений) */
    baseForm?: Form;
    
    /** Форма расширения */
    extensionForm?: Form;
    
    /** Содержимое командной панели мобильного устройства */
    mobileDeviceCommandBarContent?: ValueListItem[];
    
    /** Информация о свойствах */
    propertyInfos?: PropertyInfo[];
    
    /** Информация об источниках данных элементов */
    elementDataSourceInfos?: ElementDataSourceInfo[];
}
