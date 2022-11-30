/* eslint-disable @typescript-eslint/ban-ts-comment */
import "flatpickr/dist/flatpickr.min.css";

import Input from "@mui/material/OutlinedInput";
import flatpickr from "flatpickr";
import * as React from "react";
import { useController, useFormContext } from "react-hook-form";

import { DateIcon } from "@/assets/icons";
import type {
  FieldOptions,
  FieldOptionsDate,
  FieldType,
  UseControllerProps,
} from "@/types";
import { dayjs } from "@/utils/time";

import type { DateTimeMode, FormTryServiceSimple } from "../../../types";

interface Props extends UseControllerProps<FormTryServiceSimple> {
  w?: string;
  fieldName: string;
  fieldOptions: FieldOptions;
  fieldType: FieldType;
  onSelect: (date: Date, mode: DateTimeMode) => void;
  onShow: () => void;
}

export const InputDate = React.memo(function InputDate({
  w,
  fieldName,
  fieldOptions,
  fieldType,
  onSelect,
  onShow,
  ...rest
}: Props) {
  const { control } = useFormContext<FormTryServiceSimple>();
  const {
    field: { value, onBlur },
  } = useController({ control, ...rest });
  const picker = React.useRef(null);

  const date = value as Date | undefined;
  let { includeTimeField } = fieldOptions as FieldOptionsDate;
  const { timeFormat } = fieldOptions as FieldOptionsDate;

  if (fieldType === "createdAt" || fieldType === "updatedAt") {
    includeTimeField = true;
  }

  const handleChange = React.useCallback(
    (selectedDates: Date[]) => {
      onSelect(
        selectedDates[0] ?? new Date(),
        includeTimeField ? "datetime" : "date"
      );
    },
    [includeTimeField, onSelect]
  );

  const handleOpen = React.useCallback(() => {
    onShow();
  }, [onShow]);

  React.useEffect(() => {
    if (!picker.current) {
      return;
    }

    flatpickr(picker.current, {
      dateFormat: `Y-m-d${
        includeTimeField ? ` ${timeFormat === 24 ? "H:i" : "G:i K"}` : ""
      }`,
      enableTime: includeTimeField,
      minuteIncrement: 1,
      // eslint-disable-next-line camelcase
      time_24hr: timeFormat === 24,
      onChange: handleChange,
      onOpen: handleOpen,
    });
  }, [handleChange, handleOpen, includeTimeField, timeFormat]);

  React.useEffect(() => {
    // @ts-ignore
    if (!date || !picker.current?._flatpickr) {
      return;
    }

    // @ts-ignore
    picker.current._flatpickr.setDate(date);
  }, [date]);

  return (
    <Input
      ref={picker}
      sx={{
        width: w,
        fontSize: "0.875em",
      }}
      size="small"
      value={
        date
          ? dayjs(date).format(
              `YYYY-MM-DD ${
                includeTimeField
                  ? ` ${timeFormat === 24 ? "HH:mm" : "HH:mm A"}`
                  : ""
              }`
            )
          : undefined
      }
      placeholder={fieldName}
      onBlur={onBlur}
      endAdornment={<DateIcon />}
    />
  );
});
