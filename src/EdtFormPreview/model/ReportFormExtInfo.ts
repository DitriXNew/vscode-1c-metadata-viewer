/**
 * ReportFormExtInfo - расширенная информация формы отчёта
 * Based on EDT com._1c.g5.v8.dt.form.model.ReportFormExtInfo
 */

import { FormExtInfo } from './FormExtInfo';
import { ReportFormType } from './ReportFormType';

export type AutoShowStateMode = 
    | 'Auto'
    | 'DontShow'
    | 'ShowOnTop'
    | 'ShowAtBottom';

export type ReportResultViewMode = 
    | 'Auto'
    | 'Form'
    | 'Window';

export type ViewModeApplicationOnSetReportResult = 
    | 'Auto'
    | 'Apply'
    | 'DontApply';

export interface ReportFormExtInfo extends FormExtInfo {
    /** Показ состояния */
    showState?: AutoShowStateMode;
    
    /** Форма настроек */
    settingsForm?: ReportFormType;
    
    /** Режим просмотра результата отчёта */
    reportResultViewMode?: ReportResultViewMode;
    
    /** Применение режима просмотра при установке результата */
    viewModeApplicationOnSetReportResult?: ViewModeApplicationOnSetReportResult;
}
