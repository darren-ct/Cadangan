import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Row } from "@/types";
import { useWidgetGlobalEvent } from "@/widgets";
import { Field, WidgetProps, WidgetRowOnChangeEvent } from "@/widgets/types";

import { Draggable } from "../../types";
import { FieldWidget } from "./field";

interface Props extends Omit<WidgetProps, "src" | "onGetTables"> {
  item: Draggable;
  buttonText: string;
  onSubmit?: (values: Row, fields: Field[]) => unknown;
}

export const Form = React.memo(function Form({
  item,
  buttonText,
  fields,
  foreignFields,
  onGetForeignRecords,
  onRowChange,
  onUploadAttachment,
  onSubmit,
}: Props) {
  useWidgetGlobalEvent({
    onGetForeignRecords,
    onRowChange,
    onUploadAttachment,
  });

  const { control, handleSubmit: rawHandleSubmit } = useForm<Row>();

  const handleSubmit = React.useCallback(
    (values: Row) => {
      onSubmit(values, fields);
    },
    [fields, onSubmit]
  );

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",

        width: "100%",
      }}
      onSubmit={(e) => rawHandleSubmit(handleSubmit)(e)}
    >
      <Stack
        spacing={1}
        sx={{
          position: "relative",
          flexDirection: "column",
          marginBottom: "16px",
          width: "100%",
        }}
      >
        {fields.map((field) => (
          <FieldWidget
            item={item}
            key={field.id}
            name={field.name}
            fields={fields}
            control={control}
            foreignFields={foreignFields}
            onRowChange={onRowChange as WidgetRowOnChangeEvent<Row>}
          />
        ))}
      </Stack>

      <Button
        variant="contained"
        size="small"
        type="submit"
        fullWidth
        sx={(theme) => ({ fontSize: theme.typography.fontSize - 1 })}
      >
        {buttonText || "Click Me"}
      </Button>
    </form>
  );
});
