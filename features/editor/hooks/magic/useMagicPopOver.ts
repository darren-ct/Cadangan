import * as React from "react";

import type {
  DateTimeSubProps,
  FieldSubProps,
  NewRecordSubProps,
  OtherComponentSubProps,
  ParamSubProps,
  TableSubProps,
  TextContent,
  UserSubProps,
} from "@/features/editor";

interface Props {
  onSelect: (newTextContent: TextContent | Record<string, unknown>) => void;
}

export const useMagicPopOver = ({ onSelect }: Props) => {
  //   FUNCTIONS
  const onAddMagicTextContent = React.useCallback(
    (id: string) => {
      // Prepare Text Content
      const newTextContent: TextContent | Record<string, unknown> = {
        id: null,
        type: null,
        subProps: {},
      };

      const idArr = id.split("-");
      const type = idArr[0];

      const dateTimeSubProps = newTextContent.subProps as DateTimeSubProps;
      const userSubProps = newTextContent.subProps as UserSubProps;
      const tableSubProps = newTextContent.subProps as TableSubProps;
      const fieldSubProps = newTextContent.subProps as FieldSubProps;
      const otherComponentSubProps =
        newTextContent.subProps as OtherComponentSubProps;
      const newRecordSubProps = newTextContent.subProps as NewRecordSubProps;
      const newParamSubProps = newTextContent.subProps as ParamSubProps;
      // Set Id
      newTextContent.id = Date.now().toString();

      // Set type & subProps
      switch (type) {
        case "DATE_TIME":
          newTextContent.type = type;
          dateTimeSubProps.subType = idArr[1] as
            | "NONE"
            | "CURRENT_TIME"
            | "START_OF_TODAY"
            | "1_YEAR_AGO";

          break;

        case "USER":
          newTextContent.type = type;
          userSubProps.subType = idArr[1] as
            | "EMAIL"
            | "FIRST_NAME"
            | "LAST_NAME"
            | "PHONE_NUMBER";
          break;

        case "TABLE":
          newTextContent.type = type;
          tableSubProps.tableId = idArr[2];
          tableSubProps.subType = "COUNT";
          break;

        case "FIELD":
          newTextContent.type = type;

          fieldSubProps.subType = idArr[1] as
            | "SUM"
            | "AVERAGE"
            | "MINIMUM"
            | "MAXIMUM"
            | "MIN_MAX";

          fieldSubProps.tableId = idArr[2];
          fieldSubProps.fieldId = idArr[3];
          break;

        case "OTHER_COMPONENTS":
          newTextContent.type = type;
          otherComponentSubProps.draggableId = idArr[2];
          otherComponentSubProps.subType = idArr[1];
          break;

        case "NEW_RECORD":
          newTextContent.type = type;
          newRecordSubProps.tableId = idArr[1];
          newRecordSubProps.recordId = idArr[2];
          newRecordSubProps.fieldName = idArr[3];
          newRecordSubProps.subType = idArr[3];
          break;

        case "PARAM":
          newTextContent.type = type;
          newParamSubProps.subType = idArr[1];
          newParamSubProps.stringifiedKey = idArr[1];
      }

      onSelect(newTextContent);
    },
    [onSelect]
  );

  return { onAddMagicTextContent };
};
