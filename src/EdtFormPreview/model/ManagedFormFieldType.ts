/**
 * ManagedFormFieldType - типы полей управляемой формы
 * @see com._1c.g5.v8.dt.form.model.ManagedFormFieldType
 */
export { ManagedFormFieldType } from './types';

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
