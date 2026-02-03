/**
 * ManagedFormFieldType - типы полей управляемой формы
 * @see com._1c.g5.v8.dt.form.model.ManagedFormFieldType
 */
export enum ManagedFormFieldType {
  None = 'None',                              // 0
  HTMLDocumentField = 'HTMLDocumentField',    // 1
  InputField = 'InputField',                  // 2
  GeographicalSchemaField = 'GeographicalSchemaField',  // 3
  GraphicalSchemaField = 'GraphicalSchemaField',        // 4
  DendrogramField = 'DendrogramField',        // 5
  ChartField = 'ChartField',                  // 6
  GanttChartField = 'GanttChartField',        // 7
  ProgressBarField = 'ProgressBarField',      // 8
  CalendarField = 'CalendarField',            // 9
  PictureField = 'PictureField',              // 10
  LabelField = 'LabelField',                  // 11
  RadioButtonField = 'RadioButtonField',      // 12
  TrackBarField = 'TrackBarField',            // 13
  SpreadsheetDocumentField = 'SpreadsheetDocumentField',  // 14
  TextDocumentField = 'TextDocumentField',    // 15
  CheckBoxField = 'CheckBoxField',            // 16
  FormattedDocumentField = 'FormattedDocumentField',      // 17
  PlannerField = 'PlannerField',              // 18
  PeriodField = 'PeriodField',                // 19
  PDFDocumentField = 'PDFDocumentField'       // 20
}

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
