/**
 * ManagedFormFieldType - типы полей управляемой формы
 * @see com._1c.g5.v8.dt.form.model.ManagedFormFieldType
 */
export type ManagedFormFieldType = 
  | 'None'                      // 0 - Нет
  | 'HTMLDocumentField'         // 1 - Поле HTML документа
  | 'InputField'                // 2 - Поле ввода
  | 'GeographicalSchemaField'   // 3 - Поле географической схемы
  | 'GraphicalSchemaField'      // 4 - Поле графической схемы
  | 'DendrogramField'           // 5 - Поле дендрограммы
  | 'ChartField'                // 6 - Поле диаграммы
  | 'GanttChartField'           // 7 - Поле диаграммы Ганта
  | 'ProgressBarField'          // 8 - Поле индикатора прогресса
  | 'CalendarField'             // 9 - Поле календаря
  | 'PictureField'              // 10 - Поле картинки
  | 'LabelField'                // 11 - Поле надписи
  | 'RadioButtonField'          // 12 - Поле переключателя
  | 'TrackBarField'             // 13 - Поле полосы регулировки
  | 'SpreadsheetDocumentField'  // 14 - Поле табличного документа
  | 'TextDocumentField'         // 15 - Поле текстового документа
  | 'CheckBoxField'             // 16 - Поле флажка
  | 'FormattedDocumentField'    // 17 - Поле форматированного документа
  | 'PlannerField'              // 18 - Поле планировщика
  | 'PeriodField'               // 19 - Поле периода
  | 'PDFDocumentField';         // 20 - Поле PDF документа

export const ManagedFormFieldTypeValues = {
  None: 0,
  HTMLDocumentField: 1,
  InputField: 2,
  GeographicalSchemaField: 3,
  GraphicalSchemaField: 4,
  DendrogramField: 5,
  ChartField: 6,
  GanttChartField: 7,
  ProgressBarField: 8,
  CalendarField: 9,
  PictureField: 10,
  LabelField: 11,
  RadioButtonField: 12,
  TrackBarField: 13,
  SpreadsheetDocumentField: 14,
  TextDocumentField: 15,
  CheckBoxField: 16,
  FormattedDocumentField: 17,
  PlannerField: 18,
  PeriodField: 19,
  PDFDocumentField: 20
} as const;
