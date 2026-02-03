/**
 * LocalizedString - локализованная строка
 * @see com._1c.g5.v8.bm.core.server.storage.LocalizedStringMap
 * 
 * В EDT это EMap<String, String> - ключ-значение где ключ - код языка
 */
export interface LocalizedString {
    [languageCode: string]: string;
}
