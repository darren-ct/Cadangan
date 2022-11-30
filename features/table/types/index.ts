import type {
  CalculatedColumn as RDGCalculatedColumn,
  Column as RDGColumn,
  EditorProps as RDGEditorProps,
  FormatterProps as RDGFormatterProps,
  HeaderRendererProps as RDGHeaderRendererProps,
  RowsChangeData as RDGRowsChangeData,
} from "@kontenbase/data-grid";
import type * as React from "react";

import type {
  Field,
  FieldOptions,
  FieldType,
  Row,
  SelectOption,
} from "@/types";

export interface SR {
  id: string;
  totalRows: number;
}

export interface Column extends RDGColumn<Row, SR> {
  attachmentProps?: AttachmentProps;
  fieldId?: string;
  headerProps?: HeaderProps;
  linkToRecordProps?: LinkToRecordProps;
  options?: FieldOptions;
  type?: FieldType;
  onCreateRecord?: (row: Row, column: CalculatedColumn) => void;
  setSelectProps?: (
    fieldName: string,
    anchorEl: HTMLElement,
    row: Row,
    column: CalculatedColumn
  ) => void;
}

export interface CalculatedColumn extends RDGCalculatedColumn<Row, SR> {
  attachmentProps?: AttachmentProps;
  fieldId?: string;
  headerProps?: HeaderProps;
  linkToRecordProps?: LinkToRecordProps;
  options?: FieldOptions;
  type?: FieldType;
  onCreateRecord?: () => void;
  setSelectProps?: (
    fieldName: string,
    anchorEl: HTMLElement,
    row: Row,
    column: CalculatedColumn
  ) => void;
}

export interface RowsChangeData extends RDGRowsChangeData<Row, SR> {
  column: CalculatedColumn;
  indexes: number[];
}
export interface HeaderRendererProps extends RDGHeaderRendererProps<Row, SR> {
  column: CalculatedColumn;
}

export interface FormatterProps extends RDGFormatterProps<Row, SR> {
  column: CalculatedColumn;
}

export interface EditorProps extends RDGEditorProps<Row, SR> {
  column: CalculatedColumn;
}

export interface SelectProperties {
  anchorEl: HTMLElement | null;
  column: CalculatedColumn | null;
  isOpen: boolean;
  options: SelectOption[];
  row: Row | null;
  type: "singleSelect" | "multiSelect" | null;
}

export interface AttachmentProps {
  onAddAttachment: (row: Row, column: CalculatedColumn) => void;
  onExpandAttachment: (
    row: Row,
    column: CalculatedColumn,
    anchorEl: HTMLElement | null
  ) => void;
}

export interface LinkToRecordProps {
  onAddLinkToRecord: (
    row: Row,
    column: CalculatedColumn,
    anchorEl: HTMLElement | null
  ) => void;
  onDeleteLinkToRecord: (
    row: Row,
    column: CalculatedColumn,
    rowToDelete: Row
  ) => void;
  onExpandLinkToRecord: (
    row: Row,
    column: CalculatedColumn,
    anchorEl: HTMLElement | null
  ) => void;
}

export interface HeaderProps {
  onDeleteSelected: (selectedRows: Set<React.Key>) => void;
}

export interface ToolbarField extends Partial<Field> {
  value?: unknown;
  key?: string;
  operator?: string;
}

export interface TableForm {
  name: string | null;
}
