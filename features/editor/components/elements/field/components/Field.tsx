import * as React from "react";
import { Controller, Path } from "react-hook-form";

import type { Draggable } from "@/features/editor";
import { TextContent } from "@/features/editor";
import type {
  Field,
  FieldWidgetProps,
  FileObjectInput,
  Row,
  SelectOption,
} from "@/widgets/types";

import { Attachment } from "./typeFields/Attachment";
import { CheckboxField } from "./typeFields/Checkbox";
import { Currency } from "./typeFields/Currency";
import { DateInput } from "./typeFields/Date";
import { Duration } from "./typeFields/Duration";
import { Email } from "./typeFields/Email";
import { LinkToRecord } from "./typeFields/LinkToRecord";
import { LongText } from "./typeFields/LongText";
import { MultiSelect } from "./typeFields/MultiSelect";
import { Numbers } from "./typeFields/Numbers";
import { Password } from "./typeFields/Password";
import { Percent } from "./typeFields/Percent";
import { Phone } from "./typeFields/Phone";
import { Ratings } from "./typeFields/Ratings";
import { Role } from "./typeFields/Role";
import { SingleLineText } from "./typeFields/SingleLineText";
import { SingleSelect } from "./typeFields/SingleSelect";
import { Url } from "./typeFields/Url";
import { Username } from "./typeFields/Username";

interface Props extends FieldWidgetProps<Row> {
  item: Draggable;
}

function FieldWidgetGeneric<T>({
  item,
  fields,
  name,
  control,
  onRowChange,
  foreignFields,
  hideLabel,
}: Props) {
  // Field
  const field = React.useMemo(() => {
    return (fields as Field[]).find((field) => field.name === name);
  }, [fields, name]);

  return field ? (
    <Controller
      name={name as Path<T>}
      control={control}
      render={({ field: controllerField, fieldState }) => (
        <>
          {field?.type === "singleLineText" && (
            <SingleLineText
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}

          {field?.type === "longText" && (
            <LongText
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "password" && (
            <Password
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as string | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "singleSelect" && (
            <SingleSelect
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as SelectOption}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "role" && (
            <Role
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as string[]}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "multiSelect" && (
            <MultiSelect
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={
                controllerField.value as unknown as SelectOption[] | undefined
              }
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "checkBox" && (
            <CheckboxField
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as boolean | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "number" && (
            <Numbers
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "rating" && (
            <Ratings
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as number | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "percent" && (
            <Percent
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "url" && (
            <Url
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "username" && (
            <Username
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "email" && (
            <Email
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "phoneNumber" && (
            <Phone
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as string | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "currency" && (
            <Currency
              item={item}
              field={field}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as TextContent[] | undefined}
            />
          )}
          {field?.type === "date" && (
            <DateInput
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as Date | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "duration" && (
            <Duration
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as string | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "attachment" && (
            <Attachment
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as FileObjectInput[] | undefined}
              hideLabel={hideLabel}
            />
          )}
          {field?.type === "linkToRecord" && (
            <LinkToRecord
              field={field}
              error={fieldState.error?.message}
              {...{ ...controllerField, ref: undefined }}
              value={controllerField.value as unknown as Row[] | undefined}
              onRowChange={onRowChange}
              foreignFields={foreignFields}
              hideLabel={hideLabel}
            />
          )}
        </>
      )}
    />
  ) : (
    <div>Wait ...</div>
  );
}

export const FieldWidget = React.memo(
  FieldWidgetGeneric
) as typeof FieldWidgetGeneric;
