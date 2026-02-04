/**
 * Тесты конвертера форм EDT в LWT контролы
 * Проверяет конвертацию всех тестовых форм из FORM_TEST_XML
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { FormXmlFileReader } from './parsing/FormXmlFileReader';
import { FormToLwtConverter, ConversionResult } from './lwt/FormToLwtConverter';

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

describe('FormToLwtConverter', () => {
    let formFiles: string[];
    let reader: FormXmlFileReader;
    let converter: FormToLwtConverter;

    beforeAll(() => {
        formFiles = getFormFiles();
        reader = new FormXmlFileReader();
        converter = new FormToLwtConverter({ locale: 'ru' });
    });

    it('should find test form files', () => {
        expect(formFiles.length).toBeGreaterThan(0);
        console.log(`Found ${formFiles.length} test form files`);
    });

    describe('convert all forms', () => {
        // Статистика
        const conversionStats = {
            totalForms: 0,
            successfulForms: 0,
            failedForms: 0,
            totalControls: 0,
            totalErrors: 0,
            totalWarnings: 0,
        };

        // Статистика по типам предупреждений
        const warningStats: Record<string, number> = {};
        
        // Статистика по типам созданных контролов
        const controlStats: Record<string, number> = {};
        
        // Неподдерживаемые типы полей
        const unsupportedFieldTypes: Record<string, number> = {};
        const unsupportedGroupTypes: Record<string, number> = {};
        
        // Ошибки конвертации
        const conversionErrors: Array<{ file: string; error: string }> = [];

        it('should convert all forms successfully', () => {
            const files = getFormFiles();
            
            for (const formFile of files) {
                const fileName = path.basename(formFile);
                let xmlContent: string;
                
                try {
                    xmlContent = fs.readFileSync(formFile, 'utf-8');
                } catch (err) {
                    conversionErrors.push({ file: fileName, error: `Cannot read file: ${err}` });
                    conversionStats.failedForms++;
                    continue;
                }

                try {
                    // Парсим форму
                    const parseResult = reader.read(xmlContent, '8.3.24');
                    
                    // Конвертируем в LWT
                    const convResult = converter.convert(parseResult.form);
                    
                    conversionStats.totalForms++;
                    
                    // Проверяем что получили корневой контрол
                    expect(convResult.root).toBeDefined();
                    
                    // Считаем успешность
                    if (convResult.errors.length === 0) {
                        conversionStats.successfulForms++;
                    } else {
                        conversionStats.failedForms++;
                    }
                    
                    // Собираем статистику
                    conversionStats.totalControls += convResult.controlsById.size;
                    conversionStats.totalErrors += convResult.errors.length;
                    conversionStats.totalWarnings += convResult.warnings.length;
                    
                    // Анализируем warnings
                    for (const warning of convResult.warnings) {
                        categorizeWarning(warning, warningStats, unsupportedFieldTypes, unsupportedGroupTypes);
                    }
                    
                    // Считаем типы контролов
                    collectControlStats(convResult, controlStats);
                    
                } catch (err) {
                    conversionErrors.push({ file: fileName, error: `${err}` });
                    conversionStats.failedForms++;
                }
            }

            // ============================================
            // ВЫВОД СТАТИСТИКИ
            // ============================================
            
            console.log('\n' + '='.repeat(60));
            console.log('CONVERSION STATISTICS');
            console.log('='.repeat(60));
            
            console.log(`\nForms:`);
            console.log(`  Total:      ${conversionStats.totalForms}`);
            console.log(`  Successful: ${conversionStats.successfulForms}`);
            console.log(`  With errors: ${conversionStats.failedForms}`);
            console.log(`  Success rate: ${(conversionStats.successfulForms / conversionStats.totalForms * 100).toFixed(1)}%`);
            
            console.log(`\nControls created: ${conversionStats.totalControls}`);
            console.log(`Total errors: ${conversionStats.totalErrors}`);
            console.log(`Total warnings: ${conversionStats.totalWarnings}`);
            
            // Статистика по типам контролов
            console.log('\n--- CONTROL TYPES CREATED ---');
            const sortedControls = Object.entries(controlStats)
                .sort((a, b) => b[1] - a[1]);
            for (const [type, count] of sortedControls) {
                console.log(`  ${type}: ${count}`);
            }
            
            // Неподдерживаемые типы полей
            if (Object.keys(unsupportedFieldTypes).length > 0) {
                console.log('\n--- UNSUPPORTED FIELD TYPES ---');
                const sortedFields = Object.entries(unsupportedFieldTypes)
                    .sort((a, b) => b[1] - a[1]);
                for (const [type, count] of sortedFields) {
                    console.log(`  ${type}: ${count}`);
                }
            }
            
            // Неподдерживаемые типы групп
            if (Object.keys(unsupportedGroupTypes).length > 0) {
                console.log('\n--- UNSUPPORTED GROUP TYPES ---');
                const sortedGroups = Object.entries(unsupportedGroupTypes)
                    .sort((a, b) => b[1] - a[1]);
                for (const [type, count] of sortedGroups) {
                    console.log(`  ${type}: ${count}`);
                }
            }
            
            // Статистика по категориям warnings
            if (Object.keys(warningStats).length > 0) {
                console.log('\n--- WARNING CATEGORIES ---');
                const sortedWarnings = Object.entries(warningStats)
                    .sort((a, b) => b[1] - a[1]);
                for (const [category, count] of sortedWarnings) {
                    console.log(`  ${category}: ${count}`);
                }
            }
            
            // Ошибки конвертации
            if (conversionErrors.length > 0) {
                console.log('\n--- CONVERSION ERRORS ---');
                for (const { file, error } of conversionErrors.slice(0, 10)) {
                    console.log(`  ${file}: ${error.substring(0, 100)}`);
                }
                if (conversionErrors.length > 10) {
                    console.log(`  ... and ${conversionErrors.length - 10} more`);
                }
            }
            
            console.log('\n' + '='.repeat(60));
            
            // Тест не должен фейлиться если есть только warnings
            // Фейлим только если есть критические ошибки конвертации
            expect(conversionErrors.length).toBeLessThan(conversionStats.totalForms * 0.1); // менее 10% ошибок
        });

        it('should create at least some controls', () => {
            expect(conversionStats.totalControls).toBeGreaterThan(0);
        });
    });

    describe('specific form element conversion', () => {
        it('should convert InputField correctly', () => {
            const form = {
                items: [
                    {
                        name: 'TestInput',
                        id: 1,
                        type: 'InputField',
                        title: 'Тестовое поле'
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestInput')).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should convert UsualGroup with children', () => {
            const form = {
                items: [
                    {
                        name: 'TestGroup',
                        id: 1,
                        type: 'UsualGroup',
                        title: 'Тестовая группа',
                        items: [
                            { name: 'Field1', id: 2, type: 'InputField' },
                            { name: 'Field2', id: 3, type: 'CheckBoxField' }
                        ]
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestGroup')).toBe(true);
            expect(result.controlsByName.has('Field1')).toBe(true);
            expect(result.controlsByName.has('Field2')).toBe(true);
        });

        it('should convert Pages with tabs', () => {
            const form = {
                items: [
                    {
                        name: 'TestPages',
                        id: 1,
                        type: 'Pages',
                        items: [
                            { name: 'Page1', id: 2, type: 'Page', title: 'Страница 1', items: [] },
                            { name: 'Page2', id: 3, type: 'Page', title: 'Страница 2', items: [] }
                        ]
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestPages')).toBe(true);
        });

        it('should convert Button', () => {
            const form = {
                items: [
                    {
                        name: 'TestButton',
                        id: 1,
                        commandName: 'Save',
                        title: 'Сохранить'
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestButton')).toBe(true);
        });

        it('should convert Table with columns', () => {
            const form = {
                items: [
                    {
                        name: 'TestTable',
                        id: 1,
                        representation: 'Table',
                        items: [
                            { name: 'Column1', id: 2, title: 'Колонка 1', width: 100 },
                            { name: 'Column2', id: 3, title: 'Колонка 2', width: 150 }
                        ]
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestTable')).toBe(true);
        });

        it('should handle Decoration (Label)', () => {
            const form = {
                items: [
                    {
                        name: 'TestLabel',
                        id: 1,
                        type: 'Label',
                        title: 'Текст надписи'
                    }
                ]
            };
            
            const result = converter.convert(form as any);
            
            expect(result.root).toBeDefined();
            expect(result.controlsByName.has('TestLabel')).toBe(true);
        });
    });
});

/**
 * Категоризирует warning и собирает статистику
 */
function categorizeWarning(
    warning: string, 
    stats: Record<string, number>,
    unsupportedFields: Record<string, number>,
    unsupportedGroups: Record<string, number>
): void {
    // Неподдерживаемый тип поля
    const fieldMatch = warning.match(/Неподдерживаемый тип поля: (\w+)/);
    if (fieldMatch) {
        const type = fieldMatch[1];
        unsupportedFields[type] = (unsupportedFields[type] || 0) + 1;
        stats['Unsupported field type'] = (stats['Unsupported field type'] || 0) + 1;
        return;
    }
    
    // Неподдерживаемый тип группы
    const groupMatch = warning.match(/Неподдерживаемый тип группы: (\w+)/);
    if (groupMatch) {
        const type = groupMatch[1];
        unsupportedGroups[type] = (unsupportedGroups[type] || 0) + 1;
        stats['Unsupported group type'] = (stats['Unsupported group type'] || 0) + 1;
        return;
    }
    
    // Неизвестный тип элемента
    if (warning.includes('Неизвестный тип элемента')) {
        stats['Unknown element type'] = (stats['Unknown element type'] || 0) + 1;
        return;
    }
    
    // Другие
    stats['Other'] = (stats['Other'] || 0) + 1;
}

/**
 * Собирает статистику по созданным контролам
 */
function collectControlStats(result: ConversionResult, stats: Record<string, number>): void {
    for (const control of result.controlsById.values()) {
        const typeName = control.constructor.name;
        stats[typeName] = (stats[typeName] || 0) + 1;
    }
}
