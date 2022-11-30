export interface ClassicSubProps {
  text: string | number;
}

export interface DateTimeSubProps {
  subType: "NONE" | "CURRENT_TIME" | "START_OF_TODAY" | "1_YEAR_AGO";
}

export interface UserSubProps {
  subType: "EMAIL" | "FIRST_NAME" | "LAST_NAME" | "PHONE_NUMBER";
}

export interface TableSubProps {
  tableId: string;
  subType: "COUNT";
}

export interface FieldSubProps {
  tableId: string;
  fieldId: string;
  subType: "SUM" | "AVERAGE" | "MINIMUM" | "MAXIMUM" | "MIN_MAX";
}

export interface OtherComponentSubProps {
  draggableId: string;
  subType: string;
}

export interface NewRecordSubProps {
  tableId: string;
  recordId: string;
  fieldName: string;
  subType: string;
}

export interface ParamSubProps {
  subType: string;
  key?: TextContent[];
  stringifiedKey?: string;
}

export interface TextContent {
  id: string;
  format?: "STRING" | "NUMBER";
  type:
    | "CLASSIC"
    | "DATE_TIME"
    | "USER"
    | "TABLE"
    | "FIELD"
    | "OTHER_COMPONENTS"
    | "NEW_RECORD"
    | "PARAM";
  subProps:
    | ClassicSubProps
    | DateTimeSubProps
    | UserSubProps
    | TableSubProps
    | FieldSubProps
    | OtherComponentSubProps
    | NewRecordSubProps
    | ParamSubProps;
}

export interface MagicTextSubLink {
  id?: string;
  title: string;
  icon?: string;
  isBorderTopped?: boolean;
  sublinks?: MagicTextSubLink[];
}
