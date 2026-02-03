/**
 * Тесты парсера форм EDT
 * Проверяет парсинг всех 277 тестовых форм из TEST_FORM
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { FormXmlFileReader } from './parsing/FormXmlFileReader';

// Путь к тестовым формам (XML из конфигуратора)
const TEST_FORMS_DIR = path.resolve(process.cwd(), 'FORM_TEST_XML');

// Получаем список всех .xml файлов
function getFormFiles(): string[] {
    if (!fs.existsSync(TEST_FORMS_DIR)) {
        return [];
    }
    return fs.readdirSync(TEST_FORMS_DIR)
        .filter(file => file.endsWith('.xml'))
        .map(file => path.join(TEST_FORMS_DIR, file));
}

describe('FormXmlFileReader', () => {
    let formFiles: string[];
    let reader: FormXmlFileReader;

    beforeAll(() => {
        formFiles = getFormFiles();
        reader = new FormXmlFileReader();
    });

    it('should find test form files', () => {
        expect(formFiles.length).toBeGreaterThan(0);
        console.log(`Found ${formFiles.length} test form files`);
    });

    describe('parse all forms without errors', () => {
        // Статистика по типам элементов
        const elementStats: Record<string, number> = {};
        const parseErrors: Array<{ file: string; error: string }> = [];
        const parseWarnings: Array<{ file: string; warnings: string[] }> = [];

        it('should parse all forms successfully', () => {
            const files = getFormFiles();
            
            for (const formFile of files) {
                const fileName = path.basename(formFile);
                let xmlContent: string;
                
                try {
                    xmlContent = fs.readFileSync(formFile, 'utf-8');
                } catch (err) {
                    parseErrors.push({ file: fileName, error: `Cannot read file: ${err}` });
                    continue;
                }

                try {
                    const result = reader.read(xmlContent, '8.3.24');
                    
                    // Проверяем что форма распарсилась
                    expect(result.form).toBeDefined();
                    
                    // Собираем статистику по элементам
                    collectElementStats(result.form.items || [], elementStats);
                    
                    // Собираем warnings
                    if (result.errors.length > 0) {
                        parseWarnings.push({ file: fileName, warnings: result.errors });
                    }
                } catch (err) {
                    parseErrors.push({ file: fileName, error: `${err}` });
                }
            }

            // Выводим статистику
            console.log('\n=== ELEMENT STATISTICS ===');
            const sortedStats = Object.entries(elementStats)
                .sort((a, b) => b[1] - a[1]);
            for (const [type, count] of sortedStats) {
                console.log(`  ${type}: ${count}`);
            }
            console.log(`\nTotal elements: ${Object.values(elementStats).reduce((a, b) => a + b, 0)}`);
            console.log(`Total element types: ${Object.keys(elementStats).length}`);

            // Выводим ошибки парсинга если есть
            if (parseErrors.length > 0) {
                console.log('\n=== PARSE ERRORS ===');
                for (const { file, error } of parseErrors) {
                    console.log(`  ${file}: ${error}`);
                }
            }

            // Собираем статистику по Unknown типам из warnings
            const unknownTypeStats: Record<string, number> = {};
            const otherWarnings: Array<{ file: string; warnings: string[] }> = [];
            
            for (const { file, warnings } of parseWarnings) {
                const unknownTypes = extractUnknownTypes(warnings);
                for (const type of unknownTypes) {
                    unknownTypeStats[type] = (unknownTypeStats[type] || 0) + 1;
                }
                const nonUnknownWarnings = warnings.filter(w => !w.includes('Unknown child item type:'));
                if (nonUnknownWarnings.length > 0) {
                    otherWarnings.push({ file, warnings: nonUnknownWarnings });
                }
            }
            
            // Выводим статистику Unknown типов
            if (Object.keys(unknownTypeStats).length > 0) {
                console.log('\n=== UNKNOWN ELEMENT TYPES ===');
                const sortedUnknown = Object.entries(unknownTypeStats)
                    .sort((a, b) => b[1] - a[1]);
                for (const [type, count] of sortedUnknown) {
                    console.log(`  ${type}: ${count}`);
                }
            }

            // Выводим остальные warnings если есть
            if (otherWarnings.length > 0) {
                console.log('\n=== OTHER WARNINGS ===');
                for (const { file, warnings } of otherWarnings) {
                    console.log(`  ${file}: ${warnings.join(', ')}`);
                }
            }

            // Проверяем что нет критических ошибок
            expect(parseErrors.length).toBe(0);
        });
    });
});

/**
 * Рекурсивно собирает статистику по типам элементов
 */
function collectElementStats(items: any[], stats: Record<string, number>): void {
    for (const item of items) {
        // Определяем тип элемента - используем type напрямую (ManagedFormFieldType/ManagedFormGroupType)
        let elementType = 'Unknown';
        
        if (item.type) {
            // FormField.type или FormGroup.type
            elementType = item.type;
        }
        
        stats[elementType] = (stats[elementType] || 0) + 1;
        
        // Рекурсивно обходим дочерние элементы
        if (item.items && Array.isArray(item.items)) {
            collectElementStats(item.items, stats);
        }
        
        // Для таблиц обходим колонки
        if (item.columns && Array.isArray(item.columns)) {
            collectElementStats(item.columns, stats);
        }
        
        // Для контекстных меню
        if (item.contextMenu) {
            collectElementStats([item.contextMenu], stats);
        }
        
        // Для расширенных подсказок
        if (item.extendedTooltip) {
            collectElementStats([item.extendedTooltip], stats);
        }
        
        // Для автокоммандных панелей
        if (item.autoCommandBar) {
            collectElementStats([item.autoCommandBar], stats);
        }
    }
}

/**
 * Извлекает типы Unknown элементов из warnings
 */
function extractUnknownTypes(warnings: string[]): string[] {
    const unknownTypes: string[] = [];
    for (const warning of warnings) {
        const match = warning.match(/Unknown child item type: "(\w+)"/);
        if (match) {
            unknownTypes.push(match[1]);
        }
    }
    return unknownTypes;
}
